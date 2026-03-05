// PDF Export using Puppeteer backend service
import axios from 'axios';

export interface ArticlePDFOptions {
  title: string;
  author: string;
  date: string;
  content: string;
  coverImage?: string;
  tags: string[];
}

// Configuration
const PDF_SERVICE_URL = import.meta.env.VITE_PDF_SERVICE_URL || 'http://localhost:3001';

// Error messages
const PDF_ERRORS = {
  MISSING_TITLE: 'Article title is required for PDF generation',
  MISSING_CONTENT: 'Article content is required for PDF generation',
  CONTENT_TOO_LARGE: 'Article content is too large to generate PDF',
  GENERATION_FAILED: 'Failed to generate PDF. Please try again.',
  SERVICE_UNAVAILABLE: 'PDF service is currently unavailable. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  INVALID_DATA: 'Invalid article data provided',
};

// Validation function
function validateArticleData(options: ArticlePDFOptions): string | null {
  if (!options.title || options.title.trim().length === 0) {
    return PDF_ERRORS.MISSING_TITLE;
  }

  if (!options.content || options.content.trim().length === 0) {
    return PDF_ERRORS.MISSING_CONTENT;
  }

  // Check if content is too large (> 1MB of text)
  if (options.content.length > 1000000) {
    return PDF_ERRORS.CONTENT_TOO_LARGE;
  }

  return null;
}

/**
 * Generates a PDF document from article data using Puppeteer backend
 * @param options Article data to include in the PDF
 * @returns Promise that resolves when PDF is generated and downloaded
 * @throws Error if validation fails or PDF generation encounters an error
 */
export async function generateArticlePDF(options: ArticlePDFOptions): Promise<void> {
  try {
    // Validate input data
    const validationError = validateArticleData(options);
    if (validationError) {
      console.error('PDF validation failed:', validationError);
      throw new Error(validationError);
    }

    const { title, author, date, content, coverImage, tags } = options;

    // Call PDF service
    const response = await axios.post(
      `${PDF_SERVICE_URL}/api/pdf/generate`,
      {
        title: title.trim(),
        author: author.trim(),
        date,
        content: content.trim(),
        coverImage: coverImage?.trim(),
        tags: tags || [],
      },
      {
        responseType: 'blob',
        timeout: 60000, // 60 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Create blob from response
    const blob = new Blob([response.data], { type: 'application/pdf' });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizeFilename(title)}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error: any) {
    console.error('PDF generation error:', error);
    
    // Handle specific error types
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('PDF generation timed out. Please try again.');
      }
      
      if (error.response) {
        // Server responded with error
        const errorMessage = error.response.data?.message || error.response.data?.error;
        throw new Error(errorMessage || PDF_ERRORS.GENERATION_FAILED);
      }
      
      if (error.request) {
        // Request made but no response
        throw new Error(PDF_ERRORS.SERVICE_UNAVAILABLE);
      }
      
      // Network error
      throw new Error(PDF_ERRORS.NETWORK_ERROR);
    }
    
    // Re-throw validation errors
    if (error.message && Object.values(PDF_ERRORS).includes(error.message)) {
      throw error;
    }
    
    throw new Error(PDF_ERRORS.GENERATION_FAILED);
  }
}

/**
 * Checks if the PDF service is available
 * @returns Promise that resolves to true if service is available
 */
export async function checkPDFServiceHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${PDF_SERVICE_URL}/health`, {
      timeout: 5000,
    });
    return response.status === 200 && response.data?.status === 'ok';
  } catch (error) {
    console.error('PDF service health check failed:', error);
    return false;
  }
}

/**
 * Sanitizes a string to be used as a filename
 * @param filename Original filename
 * @returns Sanitized filename
 */
function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100) || 'article';
}
