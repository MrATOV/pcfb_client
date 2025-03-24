import React, { useEffect, useRef } from 'react';
import styles from "./LogViewer.module.css";

const LogViewer = ({ logs = [], style }) => {
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <textarea
      ref={textAreaRef}
      readOnly
      value={logs.join('\n')}
      className={styles.logView}
      aria-label="Log viewer"
    />
  );
};

export default LogViewer;