import AudioView from "./AudioView/AudioView";
import CodeEditor from "../../CodeEditor/CodeEditor";
import HeaderView from "./HeaderView/HeaderView";
import ImageView from "./ImageView/ImageView";
import MarkdownView from "./MarkdownView/MarkdownView";
import VideoView from "./VideoView/VideoView";
import {useLessonActions} from '../useLessonActions';

const ContentBlock = ({type, content}) => {
    const {lessonTeacherId} = useLessonActions();

    switch(type) {
        case "audio":
            return <AudioView content={content} />;
        case "code":
            return <div style={{border: "1px solid var(--sub-color)"}}><CodeEditor code={content} teacherId={lessonTeacherId} /></div>;
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