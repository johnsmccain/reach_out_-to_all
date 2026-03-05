export const isRichContent = (content: string): boolean => {
  return content.trim().startsWith('<') && content.trim().includes('>');
};

export const plainTextToHTML = (text: string): string => {
  return text
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');
};

export const htmlToPlainText = (html: string): string => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

export const migrateContent = (content: string): string => {
  if (isRichContent(content)) {
    return content;
  }
  return plainTextToHTML(content);
};
