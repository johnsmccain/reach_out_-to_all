import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PDF_SERVICE_PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many PDF generation requests, please try again later.'
});

app.use('/api/pdf', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'PDF Generation Service' });
});

// PDF generation endpoint
app.post('/api/pdf/generate',
  [
    body('title').notEmpty().trim().isLength({ max: 500 }),
    body('author').notEmpty().trim().isLength({ max: 200 }),
    body('date').notEmpty().trim(),
    body('content').notEmpty().isLength({ max: 1000000 }),
    body('coverImage').optional().isURL(),
    body('tags').optional().isArray(),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { title, author, date, content, coverImage, tags } = req.body;

    let browser = null;

    try {
      // Launch Puppeteer
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      });

      const page = await browser.newPage();

      // Generate HTML content
      const htmlContent = generateArticleHTML({
        title,
        author,
        date,
        content,
        coverImage,
        tags: tags || []
      });

      // Set content
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="width: 100%; font-size: 9px; text-align: center; color: #666; padding: 0 20mm;">
            <span class="pageNumber"></span> / <span class="totalPages"></span>
          </div>
        `
      });

      // Send PDF
      const filename = sanitizeFilename(title);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
      res.send(pdfBuffer);

    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ 
        error: 'Failed to generate PDF', 
        message: error.message 
      });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
);

// Generate HTML template for article
function generateArticleHTML({ title, author, date, content, coverImage, tags }) {
  // Convert markdown-style content to HTML
  const htmlContent = content
    .split('\n\n')
    .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Georgia', 'Times New Roman', serif;
          line-height: 1.8;
          color: #333;
          background: white;
        }

        .container {
          max-width: 100%;
          padding: 0;
        }

        .cover-image {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: cover;
          margin-bottom: 30px;
          border-radius: 8px;
        }

        .header {
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }

        h1 {
          font-size: 36px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .meta {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .tag {
          display: inline-block;
          padding: 4px 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .content {
          font-size: 16px;
          line-height: 1.8;
          color: #374151;
        }

        .content p {
          margin-bottom: 20px;
          text-align: justify;
        }

        .content p:last-child {
          margin-bottom: 0;
        }

        .footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
        }

        /* Print-specific styles */
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

        /* Page break control */
        h1, h2, h3 {
          page-break-after: avoid;
        }

        p {
          page-break-inside: avoid;
        }

        .cover-image {
          page-break-after: avoid;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${coverImage ? `<img src="${coverImage}" alt="${title}" class="cover-image" onerror="this.style.display='none'">` : ''}
        
        <div class="header">
          <h1>${title}</h1>
          <div class="meta">
            <div class="meta-item">
              <strong>Author:</strong> ${author}
            </div>
            <div class="meta-item">
              <strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          ${tags && tags.length > 0 ? `
            <div class="tags">
              ${tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>

        <div class="content">
          ${htmlContent}
        </div>

        <div class="footer">
          <p>Generated from Reachout To All Ministry</p>
          <p>© ${new Date().getFullYear()} All rights reserved</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Sanitize filename
function sanitizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100) || 'article';
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`PDF Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
