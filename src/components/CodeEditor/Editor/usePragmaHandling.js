import { useEffect } from 'react';
import { setPragmasEffect } from './CodemirrorExtensions';

const formatSectionsInfoCode = (data, indent) => {
    const subIndent = data.pos[1] + indent;
    const subContent = data.sub.map(sub => `${' '.repeat(subIndent)}${sub.directive}`).join('\n');
    return `${data.directive}\n${' '.repeat(data.pos[1])}{\n${subContent}\n${' '.repeat(data.pos[1])}}`;
};

const formatSectionsWarningCode = (data, indent) => {
    const mainIndent = data.pos[1];
    const subIndent = mainIndent + indent;
    const subContent = data.sub.map(sub => {
        let str;
        if (sub.type !== 'remove') {
            str += `${' '.repeat(subIndent)}${sub.directive}\n`;
        }
        return str;
    });
    
    const remContent = data.sub.map(sub => {
        let str;
        if (sub.type == 'remove') {
            str += `${sub.directive}\n${' '.repeat(mainIndent)}`;
        }
        return str;
    });
    
    return `${data.directive}\n${' '.repeat(mainIndent)}{\n${subContent}\n${' '.repeat(mainIndent)}}\n${remContent}`;
};

const formatSectionsRemoveCode = (data) => {
    const indent = data.pos[1];
    return data.sub.map(sub => `${sub.directive}`).join(`\n${' '.repeat(indent)}`);
}

const getLineRange = (state, lineNum, col, isEnd = false) => {
    try {
        const line = state.doc.line(lineNum);
        const offset = isEnd && lineNum < state.doc.lines ? 1 : 0;
        return { from: line.from + col, to: line.to + offset };
    } catch (error) {
        console.error(`Line processing error at line ${lineNum}:`, error.message);
        return null;
    }
};

const handleSectionsPragma = (editorView, data) => {
    const { pos, end } = data;
    if (!pos || !end) return;

    const [ startLine, startCol ] = pos;
    const [ endLine, endCol ] = end;

    const state = editorView.state;
    const start = getLineRange(state, startLine + 1, startCol);
    const endPos = getLineRange(state, endLine + 1, endCol);
    if (!start || !endPos) return;

    let sectionsCode;
    if (data.hintType == 'info') {
        sectionsCode = formatSectionsInfoCode(data, 4);
    } else if (data.hintType == 'warning') {
        sectionsCode = formatSectionsWarningCode(data, 4);
    } else {
        sectionsCode = formatSectionsRemoveCode(data);
    }
    editorView.dispatch({
        changes: [{ from: start.from, to: endPos.to, insert: sectionsCode }]
    });
};

const handleWarningPragma = (editorView, data) => {
    const { pos } = data;
    if (!pos) return;

    const state = editorView.state;
    data.sub?.forEach(subpragma => {
        const [line, col] = subpragma.pos;
        const range = getLineRange(state, line, 0);
        if (!range) return;

        editorView.dispatch({
            changes: [{
                from: range.to,
                insert: `\n${' '.repeat(col)}${subpragma.directive || ''}`
            }]
        });
    });

    const [line, col] = data.pos; 
    const range = getLineRange(state, line, 0, true);
    if (!range) return;

    editorView.dispatch({
        changes: [{ 
            from: range.from, 
            to: range.to, 
            insert: `${' '.repeat(col)}${data.directive}\n` 
        }]
    });

};

const handleRemovePragma = (editorView, data) => {
    const { pos } = data;
    if (!pos) return;
    const state = editorView.state;

    const [line, col] = data.pos;
    const range = getLineRange(state, line, 0, true);
    if (!range) return;

    editorView.dispatch({
        changes: [{ 
            from: range.from, 
            to: range.to, 
            insert: '' 
        }]
    });
};

const handleInfoPragma = (editorView, data) => {
    const state = editorView.state;
    
    data.sub?.forEach(subpragma => {
        const [line, col] = subpragma.pos;
        const range = getLineRange(state, line, 0);
        if (!range) return;

        editorView.dispatch({
            changes: [{
                from: range.to,
                insert: `\n${' '.repeat(col)}${subpragma.directive || ''}`
            }]
        });
    });
    
    const [ line, col ] = data.pos;
    
    const range = getLineRange(state, line, 0);
    if (!range) return;

    editorView.dispatch({
        changes: [{
            from: range.to,
            insert: `\n${' '.repeat(col)}${data.directive || ''}`
        }]
    });
};

export const usePragmaHandling = (editorView, pragmas, setPragmas) => {
    useEffect(() => {
        if (!editorView) return;
        editorView.dispatch({ effects: [setPragmasEffect.of(pragmas)] });
    }, [pragmas, editorView]);

    useEffect(() => {
        if (!editorView) return;

        const handleAddPragma = (e) => {
            const pragmaData = e.detail || {};
            if (!pragmaData) return;
            console.log(pragmaData);
            
            setPragmas(prev => prev.filter(p => 
                p.pos?.[0] !== pragmaData?.pos?.[0] || 
                p.pos?.[1] !== pragmaData?.pos?.[1]
            ));


            try {
                if (pragmaData.directive.includes('sections')) {
                    handleSectionsPragma(editorView, pragmaData);
                } else if (pragmaData.hintType == "info") {
                    handleInfoPragma(editorView, pragmaData);
                } else if (pragmaData.hintType == "warning") {
                    handleWarningPragma(editorView, pragmaData);
                } else {
                    handleRemovePragma(editorView, pragmaData);
                }
            } catch (error) {
                console.error('Pragma handling error:', error);
            }
        };

        window.addEventListener('addPragma', handleAddPragma);
        return () => window.removeEventListener('addPragma', handleAddPragma);
    }, [editorView, setPragmas]);
};