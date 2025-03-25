import { useEffect } from 'react';
import { ANALYSIS_FILE_URI, ANALYSIS_SERVER_URI } from '../../../config/constants';

export const createMessage = (method, params) => ({
    jsonrpc: "2.0",
    method,
    params
});

export const createInitializeMsg = () => ({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
        processId: null,
        capabilities: { textDocument: { synchronization: { didSave: true } } }
    }
});

export const useWebSocketConnection = (code, socket, setSocket, setPragmas) => {
  useEffect(() => {
    const ws = new WebSocket(ANALYSIS_SERVER_URI);

    const handleMessage = ({ data }) => {
      try {
        const msg = JSON.parse(data);
        if (msg.method === "textDocument/publishDiagnostics") {
          const newPragmas = msg.params.diagnostics.map(d => ({
            ...d.message,
            pos: [d.range.start.line - 1, d.range.start.character - 1],
            end: d.range.end ? [d.range.end.line - 1, d.range.end.character - 1] : null,
            sub: d.relatedInformation.length > 0 ? d.relatedInformation.map(s => ({
              ...s.message,
              pos: [s.range.start.line - 1, s.range.start.character - 1],
              end: s.range.end ? [s.range.end.line - 1, s.range.end.character - 1] : null,
            })) : null
          }));
          setPragmas(newPragmas);
        } else if (msg.id === 1) {
          ws.send(JSON.stringify(createMessage("initialized")));
        }
      } catch (error) {
        console.error("Message handling error:", error);
      }
    };

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify(createInitializeMsg()));
    };

    ws.onmessage = handleMessage;
    ws.onerror = (e) => console.error("WebSocket error:", e);
    ws.onclose = () => setSocket(null);

    return () => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(createMessage("textDocument/didClose", {
          textDocument: { uri: ANALYSIS_FILE_URI }
        })));
        ws.send(JSON.stringify({ jsonrpc: "2.0", id: 2, method: "shutdown" }));
        ws.send(JSON.stringify({ jsonrpc: "2.0", method: "exit" }));
        ws.close();
      }
    };
  }, [setSocket, setPragmas]);

  useEffect(() => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        jsonrpc: "2.0",
        method: "textDocument/didOpen",
        params: {
          textDocument: {
            uri: ANALYSIS_FILE_URI,
            languageId: 'cpp',
            version: 1,
            text: code
          }
        }
      }));
    }
  }, [socket]);
};

export const ChangeCode = (newCode, viewUpdate, socket, setCode, documentVersion, ANALYSIS_FILE_URI) => {
  setCode(newCode);

  if (socket && viewUpdate?.changes) {
    const contentChanges = [];
    
    viewUpdate.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
      try {
        const startLine = viewUpdate.startState.doc.lineAt(fromA);
        const endLine = viewUpdate.startState.doc.lineAt(toA);

        contentChanges.push({
          range: {
            start: {
              line: startLine.number - 1,
              character: fromA - startLine.from,
            },
            end: {
              line: endLine.number - 1,
              character: toA - endLine.from,
            },
          },
          text: inserted.toString(),
        });
      } catch (e) {
        console.error("Error processing change:", e);
      }
    });

    if (contentChanges.length > 0) {
      documentVersion.current += 1;
      socket.send(JSON.stringify({
        jsonrpc: "2.0",
        method: "textDocument/didChange",
        params: {
          textDocument: {
            uri: ANALYSIS_FILE_URI,
            version: documentVersion.current,
          },
          contentChanges: contentChanges,
        },
      }));
    }
  }
};