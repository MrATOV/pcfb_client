import { WidgetType } from '@codemirror/view';
import { createRoot } from 'react-dom/client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import styles from './HintWidget.module.css';

const HintType = (type, info, warning, remove) => {
  switch (type) {
    case 'info':
      return info;
    case 'warning':
      return warning;
    case 'remove':
      return remove;
    default:
      return null;
  }
};

const HintTooltip = ({ hint, position, onMouseEnter, onMouseLeave }) => {
  if (!hint) return null;

  return (
    <div
      className={styles.hintTooltip}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {hint}
      </ReactMarkdown>
    </div>
  );
};

export class HintWidget extends WidgetType {
  constructor(data) {
    super();
    this.data = data;
    this.state = { showTooltip: false, tooltipPosition: { x: 0, y: 0 } };
    this.tooltipRoot = null;
    this.tooltipTimeout = null;
  }

  toDOM() {
    const data = this.data || {};
    const wrap = document.createElement('div');
    wrap.className = `${styles.hintWidget} ${HintType(
      data.hintType,
      styles.info,
      styles.warning,
      styles.remove
    )}`;

    const innerDiv = document.createElement('div');
    innerDiv.className = styles.hintText;

    const icon = document.createElement('span');
    icon.textContent = HintType(data.hintType, '🔵 ', '⭐ ', '⌫ ');
    innerDiv.appendChild(icon);

    const text = document.createElement('span');
    text.textContent = data.directive || 'Unknown directive';
    innerDiv.appendChild(text);

    const actionButton = document.createElement('button');
    actionButton.textContent = HintType(data.hintType, '+', '↻', '×');
    actionButton.addEventListener('click', (e) => {
      e.stopPropagation();
      window.dispatchEvent(
        new CustomEvent('addPragma', {
          detail: this.data || {},
        })
      );
    });

    const hintButton = document.createElement('button');
    hintButton.className = styles.hintTrigger;
    hintButton.textContent = '?';
    hintButton.addEventListener('mouseenter', (e) => {
      const rect = wrap.getBoundingClientRect();
      this.state.showTooltip = true;
      this.state.tooltipPosition = { x: rect.left, y: rect.bottom + 5 };
      this.updateTooltip();
    });

    hintButton.addEventListener('mouseleave', () => {
      this.tooltipTimeout = setTimeout(() => {
        this.state.showTooltip = false;
        this.updateTooltip();
      }, 300);
    });

    innerDiv.appendChild(actionButton);
    innerDiv.appendChild(hintButton);
    wrap.appendChild(innerDiv);


    return wrap;
  }

  updateTooltip() {
    if (!this.tooltipRoot) {
      const tooltipContainer = document.createElement('div');
      document.body.appendChild(tooltipContainer);
      this.tooltipRoot = createRoot(tooltipContainer);
    }

    if (this.state.showTooltip && this.data.hint) {
      this.tooltipRoot.render(
        <HintTooltip
          hint={this.data.hint}
          position={this.state.tooltipPosition}
          onMouseEnter={() => clearTimeout(this.tooltipTimeout)}
          onMouseLeave={() => {
            this.state.showTooltip = false;
            this.updateTooltip();
          }}
        />
      );
    } else {
      this.tooltipRoot.render(null);
    }
  }

  ignoreEvent() {
    return true;
  }
}