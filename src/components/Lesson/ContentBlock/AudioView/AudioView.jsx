import styles from './AudioView.module.css';

const AudioView = ({content}) => {
    const isAudioContent = (url) => {
        const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
        return audioExtensions.some(ext => url.toLowerCase().endsWith(ext));
    }

    return isAudioContent(content) ? (
        <div className={styles.audioContainer}>
            <audio
                controls
                src={content}
                className={styles.audio}
            />
        </div>
    ) : (
        <div className={styles.iframeContainer}>
            <iframe
                src={content}
                className={styles.iframe}
                webkitAllowFullScreen
                mozallowfullscreen
                allowFullScreen
            />
        </div>
    )
};

export default AudioView;