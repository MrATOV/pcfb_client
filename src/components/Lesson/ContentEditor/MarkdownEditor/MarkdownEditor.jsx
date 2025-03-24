import MDEditor from "@uiw/react-md-editor";
import "./MarkdownEditor.css";
import { Context } from '/src/Context';
import { useContext } from 'react';

const MarkdownEditor = ({content, onUpdate}) => {
    const { isDark } = useContext(Context);

    return (
        <MDEditor 
            value={content} 
            onChange={onUpdate}
            data-color-mode={isDark ? "dark" : "light"}
            style={{
                backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
                color: isDark ? "#ffffff" : "#000000",
            }}
        />
    )
};

export default MarkdownEditor;