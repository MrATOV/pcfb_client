import HeaderEditor from "./HeaderEditor/HeaderEditor";
import MarkdownEditor from "./MarkdownEditor/MarkdownEditor";
import CodeEditor from "../../CodeEditor/CodeEditor";
import MediaUploader from "./MediaUploader/MediaUploader";

const ContentEditor = ({type, content, onUpdate}) => {
    switch(type) {
        case "header":
            return <HeaderEditor content={content} onUpdate={onUpdate} />;
        case "image":
            return <MediaUploader content={content} onUpdate={onUpdate} mediaType="image"/>;
        case "audio":
            return <MediaUploader content={content} onUpdate={onUpdate} mediaType="audio"/>;
            case "video":
            return <MediaUploader content={content} onUpdate={onUpdate} mediaType="video"/>;
        case "text":
            return <MarkdownEditor content={content} onUpdate={onUpdate} />;
        case "code":
            return <CodeEditor code={content} setCode={onUpdate} editable={true} />;
        default:
            return <p>Неизвестный тип</p>
    }
};

export default ContentEditor;