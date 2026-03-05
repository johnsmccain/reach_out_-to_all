// import { describe, it, expect } from 'vitest';
// import { sanitizeHTML, validateURL, validateImageFile } from '../lib/contentSanitizer';

// Tests disabled - vitest not installed
/*
describe('Content Sanitizer', () => {
  describe('sanitizeHTML', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>world</strong></p>';
      const output = sanitizeHTML(input);
      expect(output).toContain('<p>');
      expect(output).toContain('<strong>');
    });

    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert("XSS")</script>';
      const output = sanitizeHTML(input);
      expect(output).not.toContain('<script>');
      expect(output).not.toContain('alert');
    });

    it('should remove onclick handlers', () => {
      const input = '<p onclick="alert(\'XSS\')">Click me</p>';
      const output = sanitizeHTML(input);
      expect(output).not.toContain('onclick');
    });

    it('should allow safe link attributes', () => {
      const input = '<a href="https://example.com" target="_blank">Link</a>';
      const output = sanitizeHTML(input);
      expect(output).toContain('href');
      expect(output).toContain('target');
    });
  });

  describe('validateURL', () => {
    it('should accept valid HTTP URLs', () => {
      expect(validateURL('http://example.com')).toBe(true);
      expect(validateURL('https://example.com')).toBe(true);
    });

    it('should reject invalid protocols', () => {
      expect(validateURL('javascript:alert(1)')).toBe(false);
      expect(validateURL('data:text/html,<script>alert(1)</script>')).toBe(false);
    });

    it('should reject malformed URLs', () => {
      expect(validateURL('not a url')).toBe(false);
      expect(validateURL('')).toBe(false);
    });
  });

  describe('validateImageFile', () => {
    it('should accept valid image types', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid file types', () => {
      const file = new File([''], 'test.exe', { type: 'application/x-msdownload' });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject files over 5MB', () => {
      const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(largeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('5MB');
    });
  });
});
*/
