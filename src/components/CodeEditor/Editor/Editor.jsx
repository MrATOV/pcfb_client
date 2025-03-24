import { useMemo, useState, useRef, useContext } from "react";
import { EditorView } from "@codemirror/view";
import { cpp } from "@codemirror/lang-cpp";
import { indentUnit } from "@codemirror/language";
import { autocompletion } from "@codemirror/autocomplete";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import CodeMirror, { EditorState } from "@uiw/react-codemirror";
import { pragmaExtension } from './CodemirrorExtensions';
import { usePragmaHandling } from './usePragmaHandling';
import { ANALYSIS_FILE_URI, CLANGD_FILE_URI, CLANGD_SERVER_URI } from '../../../config/constants';
import { useWebSocketConnection, ChangeCode } from './useWebSocketConnection';
import { languageServer } from 'codemirror-languageserver';
import {Context} from '/src/Context';

const Editor = ({code, setCode}) => {
    const [socket, setSocket] = useState(null);
    const [editorView, setEditorView] = useState(null);
    const [pragmas, setPragmas] = useState([]);
    const documentVersion = useRef(0);
    const {isDark} = useContext(Context);

    useWebSocketConnection(code, socket, setSocket, setPragmas);

    usePragmaHandling(editorView, pragmas, setPragmas);

    const lspExtension = useMemo(() => languageServer({
        serverUri: CLANGD_SERVER_URI,
        rootUri: 'file:///home/user/server_clangd',
        documentUri: CLANGD_FILE_URI,
        languageId: 'cpp',
    }), []);

    const extensions = useMemo(() => [
        cpp(),
        autocompletion(),
        EditorState.tabSize.of(4),
        indentUnit.of("    "),
        lspExtension,
        pragmaExtension,
    ], [lspExtension]);

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
                value={code}
                extensions={extensions}
                onChange={(newCode, viewUpdate) => ChangeCode(newCode, viewUpdate, socket, setCode, documentVersion, ANALYSIS_FILE_URI)}
                theme={isDark ? vscodeDark : vscodeLight}
                onCreateEditor={setEditorView}
                basicSetup={{ 
                    autocompletion: true,
                    highlightActiveLine: true,
                    lineNumbers: true,
                }}
            />
        </div>
    );
};

export default Editor;