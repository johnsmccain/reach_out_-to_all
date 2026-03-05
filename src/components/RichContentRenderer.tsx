import { sanitizeHTML } from '@/lib/contentSanitizer';

interface RichContentRendererProps {
  content: string;
  className?: string;
}

export const RichContentRenderer = ({ content, className = '' }: RichContentRendererProps) => {
  const sanitizedContent = sanitizeHTML(content);

  return (
    <div
      className={`prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};
