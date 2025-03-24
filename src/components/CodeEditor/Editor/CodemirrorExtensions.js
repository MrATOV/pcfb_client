import { StateEffect, StateField } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';
import {HintWidget} from './HintWidget';

export const setPragmasEffect = StateEffect.define();

export const pragmaDecorations = StateField.define({
  create() {
    return Decoration.none;
  },

  update(decorations, tr) {
    decorations = decorations.map(tr.changes);

    tr.effects.forEach(effect => {
      if (effect.is(setPragmasEffect)) {
        decorations = Decoration.none;
        const newDecorations = effect.value.map(data => {
          try {
            const lineInfo = tr.state.doc.line(data.pos[0]);
            return Decoration.widget({
              widget: new HintWidget(data),
              side: 1,
              block: true,
            }).range(lineInfo.to);
          } catch (e) {
            console.warn('Decoration error:', e);
            return null;
          }
        }).filter(Boolean);

        decorations = decorations.update({
          add: newDecorations,
          sort: true,
        });
      }
    });

    return decorations;
  },

  provide: f => EditorView.decorations.from(f),
});

export const pragmaExtension = [
  pragmaDecorations,
];