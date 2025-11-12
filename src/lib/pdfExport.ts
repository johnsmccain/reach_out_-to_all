import jsPDF from 'jspdf';

export interface ArticlePDFOptions {
  title: string;
  author: string;
  date: string;
  content: string;
  coverImage?: string;
  tags: string[];
}

// Error messages
const PDF_ERRORS = {
  MISSING_TITLE: 'Article title is required for PDF generation',
  MISSING_CONTENT: 'Article content is required for PDF generation',
  CONTENT_TOO_LARGE: 'Article content is too large to generate PDF',
  IMAGE_LOAD_FAILED: 'Failed to load cover image',
  GENERATION_FAILED: 'Failed to generate PDF. Please try again.',
  BROWSER_NOT_SUPPORTED: 'Your browser does not support PDF generation',
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

  // Check if content is too large (> 500KB of text)
  if (options.content.length > 500000) {
    return PDF_ERRORS.CONTENT_TOO_LARGE;
  }

  return null;
}

/**
 * Generates a PDF document from article data
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

    // Check browser compatibility
    if (!checkBrowserCompatibility()) {
      console.error('Browser not compatible with PDF generation');
      throw new Error(PDF_ERRORS.BROWSER_NOT_SUPPORTED);
    }

    const { title, author, date, content, coverImage, tags } = options;

    // Create new PDF document (A4 size)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Add cover image if provided
    if (coverImage) {
      try {
        const imgData = await loadImageAsDataURL(coverImage);
        const imgWidth = contentWidth;
        const imgHeight = imgWidth * 10 / 20; // Fixed height for cover image based on 20:9 aspect ratio
        
        pdf.addImage(imgData, 'JPEG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      } catch (error) {
        console.warn('Error loading cover image, continuing without it:', error);
        // Continue without image if it fails to load
        // Add a note that image couldn't be loaded
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.text('[Cover image could not be loaded]', margin, yPosition);
        yPosition += 10;
        pdf.setTextColor(0, 0, 0);
      }
    }

    // Add title
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    const titleLines = pdf.splitTextToSize(title, contentWidth);
    pdf.text(titleLines, margin, yPosition);
    yPosition += (titleLines.length * 8) + 5;

    // Add author and date
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`By ${author || 'Unknown Author'}`, margin, yPosition);
    yPosition += 6;
    pdf.text(date || 'No date', margin, yPosition);
    yPosition += 10;

    // Add separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Add content
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    const paragraphs = content.split('\n').filter(p => p.trim());
    
    for (const paragraph of paragraphs) {
      if (paragraph.trim()) {
        try {
          const lines = pdf.splitTextToSize(paragraph, contentWidth);
          
          for (const line of lines) {
            // Check if we need a new page
            if (yPosition > pageHeight - margin - 20) {
              pdf.addPage();
              yPosition = margin;
            }
            
            pdf.text(line, margin, yPosition);
            yPosition += 6;
          }
          
          // Add spacing between paragraphs
          yPosition += 4;
        } catch (error) {
          console.error('Error rendering paragraph:', error);
          // Continue with next paragraph
        }
      }
    }

    // Add footer with tags on the last page
    const footerY = pageHeight - 15;
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    
    if (tags && tags.length > 0) {
      try {
        const tagsText = `Tags: ${tags.map(tag => `#${tag}`).join(' ')}`;
        const tagLines = pdf.splitTextToSize(tagsText, contentWidth);
        pdf.text(tagLines, margin, footerY - 5);
      } catch (error) {
        console.error('Error rendering tags:', error);
        // Continue without tags
      }
    }

    // Add page numbers to all pages
    try {
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    } catch (error) {
      console.error('Error adding page numbers:', error);
      // Continue without page numbers
    }

    // Generate filename from title (sanitize)
    const filename = sanitizeFilename(title);
    
    // Save the PDF
    try {
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw new Error('Failed to save PDF file. Please try again.');
    }
  } catch (error: any) {
    // Log the error for debugging
    console.error('PDF generation error:', error);
    
    // Re-throw with user-friendly message
    if (error.message && Object.values(PDF_ERRORS).includes(error.message)) {
      throw error;
    }
    
    throw new Error(PDF_ERRORS.GENERATION_FAILED);
  }
}

/**
 * Checks if the browser supports required features for PDF generation
 * @returns true if browser is compatible, false otherwise
 */
function checkBrowserCompatibility(): boolean {
  try {
    // Check for required features
    if (typeof document === 'undefined') {
      return false;
    }

    // Check for canvas support
    const canvas = document.createElement('canvas');
    if (!canvas.getContext || !canvas.getContext('2d')) {
      return false;
    }

    // Check for Blob support (required for PDF save)
    if (typeof Blob === 'undefined') {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Browser compatibility check failed:', error);
    return false;
  }
}

/**
 * Loads an image from URL and converts it to data URL
 * @param imageUrl URL of the image to load
 * @returns Promise that resolves with data URL
 * @throws Error if image fails to load or canvas is not supported
 */
async function loadImageAsDataURL(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate URL
    if (!imageUrl || typeof imageUrl !== 'string') {
      reject(new Error('Invalid image URL'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // Set timeout for image loading (10 seconds)
    const timeout = setTimeout(() => {
      reject(new Error('Image loading timeout'));
    }, 10000);
    
    img.onload = () => {
      clearTimeout(timeout);
      
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl);
        } catch (error) {
          reject(new Error('Failed to convert image to data URL'));
        }
      } catch (error) {
        reject(new Error('Failed to process image'));
      }
    };
    
    img.onerror = (error) => {
      clearTimeout(timeout);
      console.error('Image load error:', error);
      reject(new Error(PDF_ERRORS.IMAGE_LOAD_FAILED));
    };
    
    try {
      img.src = imageUrl;
    } catch (error) {
      clearTimeout(timeout);
      reject(new Error('Failed to set image source'));
    }
  });
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
