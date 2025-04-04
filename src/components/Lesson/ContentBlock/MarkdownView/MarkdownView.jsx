import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import styles from './MarkdownView.module.css';

const MarkdownView = ({content, className}) => {
    return (
        <div className={className ? className : styles.markdownContainer}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownView;