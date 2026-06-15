import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderChatMarkdown(source: string): string {
  if (!source?.trim()) {
    return '';
  }

  const html = marked.parse(source, { async: false }) as string;
  return DOMPurify.sanitize(html);
}
