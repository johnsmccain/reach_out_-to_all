import { z } from 'zod';
import { sanitizeHTML } from './contentSanitizer';
import { supabase } from './supabase';

// Article validation schema
export const articleSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  
  content: z.string()
    .min(1, 'Content is required')
    .max(100000, 'Content is too long')
    .refine(
      (content) => {
        // Ensure content is not just whitespace
        const temp = document.createElement('div');
        temp.innerHTML = content;
        const text = temp.textContent || temp.innerText || '';
        return text.trim().length > 0;
      },
      { message: 'Content cannot be empty' }
    ),
  
  author: z.string()
    .min(1, 'Author is required')
    .max(100, 'Author name must be less than 100 characters')
    .trim(),
  
  cover_image: z.string()
    .url('Invalid image URL')
    .nullable()
    .optional()
    .refine(
      (url) => {
        if (!url) return true;
        try {
          const parsed = new URL(url);
          return ['http:', 'https:'].includes(parsed.protocol);
        } catch {
          return false;
        }
      },
      { message: 'Image URL must use http or https protocol' }
    ),
  
  tags: z.array(z.string().trim())
    .max(10, 'Maximum 10 tags allowed')
    .default([]),
  
  is_top: z.boolean().default(false),
  
  published: z.boolean().default(true),
  
  content_type: z.enum(['plain', 'html']).default('html'),
});

// Type inference
export type ArticleInput = z.infer<typeof articleSchema>;

// Validation function
export const validateArticle = (data: unknown) => {
  return articleSchema.safeParse(data);
};

// Example usage in API route
export const createArticleHandler = async (req: Request) => {
  const validation = validateArticle(req.body);
  
  if (!validation.success) {
    return {
      error: 'Validation failed',
      details: validation.error.issues,
    };
  }
  
  const articleData = validation.data;
  
  // Sanitize content before saving
  const sanitizedContent = sanitizeHTML(articleData.content);
  
  // Save to database
  const { data, error } = await supabase
    .from('articles')
    .insert([{
      ...articleData,
      content: sanitizedContent,
    }]);
  
  if (error) {
    return { error: error.message };
  }
  
  return { data };
};
