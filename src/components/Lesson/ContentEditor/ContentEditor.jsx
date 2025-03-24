import AudioVideoUploader from "./AudioVideoUploader/AudioVideoUploader";
import HeaderEditor from "./HeaderEditor/HeaderEditor";
import ImageUploader from "./ImageUploader/ImageUploader";
import MarkdownEditor from "./MarkdownEditor/MarkdownEditor";
import CodeEditor from "../../CodeEditor/CodeEditor";

const ContentEditor = ({type, content, onUpdate}) => {
    switch(type) {
        case "header":
            return <HeaderEditor content={content} onUpdate={onUpdate} />;
        case "image":
            return <ImageUploader content={content} onUpdate={onUpdate} />;
        case "audio":
            return <AudioVideoUploader type="audio" content={content} onUpdate={onUpdate} />;
        case "video":
            return <AudioVideoUploader type="video" content={content} onUpdate={onUpdate} />;
        case "text":
            return <MarkdownEditor content={content} onUpdate={onUpdate} />;
        case "code":
            return <CodeEditor code={content} setCode={onUpdate} editable={true} />;
        default:
            return <p>Неизвестный тип</p>
    }
};

export default ContentEditor;