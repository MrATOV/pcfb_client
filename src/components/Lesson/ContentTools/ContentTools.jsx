import headerIcon from '/src/assets/icons/dark/header.svg';
import imageIcon from '/src/assets/icons/dark/image.svg';
import audioIcon from '/src/assets/icons/dark/audio.svg';
import videoIcon from '/src/assets/icons/dark/video.svg';
import textIcon from '/src/assets/icons/dark/text.svg';
import codeIcon from '/src/assets/icons/dark/code.svg';

const initialContents = {
    header: "",
    image: null,
    audio: "",
    video: "",
    text: "",
    code: "",
};

const ContentTools = ({ onAddNewItem }) => {
    const addNewContentBlock = (type) => {
        const newItem = {
            type,
            content: initialContents[type],
        };

        onAddNewItem(newItem);
    }

    return (
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <button onClick={() => addNewContentBlock("header")}>
                <img src={headerIcon} alt=""/>
                Заголовок
            </button>
            <button onClick={() => addNewContentBlock("image")}>
                <img src={imageIcon} alt="" />
                Изображение
            </button>
            <button onClick={() => addNewContentBlock("audio")}>
                <img src={audioIcon} alt=""/>
                Аудио
            </button>
            <button onClick={() => addNewContentBlock("video")}>
                <img src={videoIcon} alt=""/>
                Видео
            </button>
            <button onClick={() => addNewContentBlock("text")}>
                <img src={textIcon} alt=""/>
                Текст
            </button>
            <button onClick={() => addNewContentBlock("code")}>
                <img src={codeIcon} alt=""/>
                Код
            </button>
        </div>
    )
};

export default ContentTools;