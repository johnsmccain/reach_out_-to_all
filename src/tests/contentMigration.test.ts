// import { describe, it, expect } from 'vitest';
// import { isRichContent, plainTextToHTML, migrateContent } from '../lib/contentMigration';

// Tests disabled - vitest not installed
/*
describe('Content Migration', () => {
  describe('isRichContent', () => {
    it('should detect HTML content', () => {
      expect(isRichContent('<p>Hello</p>')).toBe(true);
      expect(isRichContent('<div>Test</div>')).toBe(true);
    });

    it('should detect plain text', () => {
      expect(isRichContent('Plain text')).toBe(false);
      expect(isRichContent('No HTML here')).toBe(false);
    });
  });

  describe('plainTextToHTML', () => {
    it('should convert single paragraph', () => {
      const result = plainTextToHTML('Hello world');
      expect(result).toBe('<p>Hello world</p>');
    });

    it('should convert multiple paragraphs', () => {
      const result = plainTextToHTML('First paragraph\n\nSecond paragraph');
      expect(result).toContain('<p>First paragraph</p>');
      expect(result).toContain('<p>Second paragraph</p>');
    });

    it('should convert line breaks within paragraphs', () => {
      const result = plainTextToHTML('Line 1\nLine 2');
      expect(result).toContain('<br>');
    });
  });

  describe('migrateContent', () => {
    it('should keep HTML content unchanged', () => {
      const html = '<p>Already HTML</p>';
      expect(migrateContent(html)).toBe(html);
    });

    it('should convert plain text to HTML', () => {
      const plain = 'Plain text content';
      const result = migrateContent(plain);
      expect(result).toContain('<p>');
      expect(result).toContain('Plain text content');
    });
  });
});
*/
