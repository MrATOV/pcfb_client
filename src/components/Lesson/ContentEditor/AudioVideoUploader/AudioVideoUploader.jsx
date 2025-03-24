import React from 'react';
import PropTypes from 'prop-types';

const AudioVideoUploader = ({ content, onUpdate, type = 'video' }) => {
  const isEmbeddable = (content) => {
    try {
      const parsedUrl = new URL(content);
      return [
        'youtube.com',
        'youtu.be',
        'vimeo.com',
        'dailymotion.com',
        'soundcloud.com'
      ].some(domain => parsedUrl.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const getMediaType = () => {
    if (!content) return 'none';
    if (isEmbeddable(content)) return 'iframe';
    
    const extension = content.split('.').pop().split(/[#?]/)[0].toLowerCase();
    const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];
    
    if (audioExtensions.includes(extension)) return 'audio';
    if (videoExtensions.includes(extension)) return 'video';
    
    return type;
  };

  const handleInputChange = (e) => {
    const newURL = e.target.value;
    onUpdate(newURL);
  };

  const renderMedia = () => {
    const mediaType = getMediaType();

    switch (mediaType) {
      case 'iframe':
        return (
          <iframe
            width="100%"
            height="400"
            src={content}
            title="media-content"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            key={content}
          />
        );
      case 'video':
        return (
          <video controls width="100%" key={content}>
            <source src={content} type={`video/${content.split('.').pop()}`} />
            Ваш браузер не поддерживает видео
          </video>
        );
      case 'audio':
        return (
          <audio controls key={content}>
            <source src={content} type={`audio/${content.split('.').pop()}`} />
            Ваш браузер не поддерживает аудио
          </audio>
        );
      default:
        return <div>Введите URL медиа-файла</div>;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto' }}>
      <div style={{ marginBottom: '20px' }}>
        {renderMedia()}
      </div>
      
      <input
        type="url"
        value={content || ''}
        onChange={handleInputChange}
        placeholder={`Введите URL ${type} файла или ссылку для встраивания`}
        style={{
          width: '100%',
          padding: '8px',
          boxSizing: 'border-box'
        }}
        pattern="https?://.+"
      />
    </div>
  );
};

AudioVideoUploader.propTypes = {
  content: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['video', 'audio'])
};

export default AudioVideoUploader;