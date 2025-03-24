import React, { memo, useMemo, useContext } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { EditorView } from '@codemirror/view';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import {Context} from '/src/Context';

const cppExtensions = [
  cpp(),
  EditorView.editable.of(false),
  EditorView.theme({
    '&.cm-editor.cm-focused': { outline: 'none' },
    '.cm-content': { cursor: 'default' }
  })
];

const CodeView = memo(({ code }) => {
  const memoizedCode = useMemo(() => code, [code]);
  const {isDark} = useContext(Context);

  return (

    <div style={{ 
      display: "flex",
      height: "100%",
      flex: 1,
      overflow: 'auto'
    }}>
        <CodeMirror
          height="100%"
          style={{flex: 1, overflow: "hidden"}}
          value={memoizedCode}
          extensions={cppExtensions}
          theme={isDark ? vscodeDark : vscodeLight}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: false,
            foldGutter: false,
            history: false,
            searchKeymap: false
          }}
        />
    </div>
  );
});

export default CodeView;