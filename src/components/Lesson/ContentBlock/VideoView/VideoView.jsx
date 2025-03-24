import styles from './VideoView.module.css';

const VideoView = ({content}) => {
    const isVideoContent = (url) => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
    };

    return isVideoContent(content) ? (
        <div className={styles.videoContainer}>
        <video
            controls
            src={content}
            className={styles.video}
        />   
        </div>
        ) 
        :
        (<div className={styles.iframeContainer}>
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

export default VideoView;