import AudioView from "./AudioView/AudioView";
import CodeEditor from "../../CodeEditor/CodeEditor";
import HeaderView from "./HeaderView/HeaderView";
import ImageView from "./ImageView/ImageView";
import MarkdownView from "./MarkdownView/MarkdownView";
import VideoView from "./VideoView/VideoView";

const ContentBlock = ({type, content}) => {
    switch(type) {
        case "audio":
            return <AudioView content={content} />;
        case "code":
            return <CodeEditor code={content} />;
        case "header":
            return <HeaderView content={content} />;
        case "image":
            return <ImageView content={content} />;
        case "text":
            return <MarkdownView content={content} />;
        case "video":
            return <VideoView content={content} />;
        default:
            return <p>Неизвестный тип</p>
    }
};

export default ContentBlock;