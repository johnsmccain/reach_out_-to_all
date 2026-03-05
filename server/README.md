# PDF Generation Service

A Puppeteer-based PDF generation service for converting articles to high-quality PDF documents.

## Features

- ✅ High-quality PDF generation using Puppeteer
- ✅ Professional article formatting with cover images
- ✅ Automatic page numbering and headers/footers
- ✅ Rate limiting to prevent abuse
- ✅ Input validation and sanitization
- ✅ CORS support for frontend integration
- ✅ Security headers with Helmet
- ✅ Error handling and logging

## Installation

```bash
# Install dependencies
npm install

# Or install Puppeteer separately
npm install puppeteer
```

## Configuration

Create a `.env` file in the root directory:

```env
# PDF Service Configuration
PDF_SERVICE_PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Running the Service

### Development Mode (with auto-reload)
```bash
npm run dev:pdf
```

### Production Mode
```bash
npm run pdf-service
```

### Run Both Frontend and PDF Service
```bash
npm run dev:all
```

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "service": "PDF Generation Service"
}
```

### Generate PDF
```
POST /api/pdf/generate
Content-Type: application/json
```

Request Body:
```json
{
  "title": "Article Title",
  "author": "Author Name",
  "date": "2024-03-04",
  "content": "Article content...",
  "coverImage": "https://example.com/image.jpg",
  "tags": ["tag1", "tag2"]
}
```

Response:
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="article-title.pdf"`
- Binary PDF data

### Rate Limiting

- 10 requests per 15 minutes per IP address
- Returns 429 status code when limit exceeded

## Usage from Frontend

```typescript
import { generateArticlePDF } from '@/lib/pdfExport';

// Generate PDF
await generateArticlePDF({
  title: 'My Article',
  author: 'John Doe',
  date: new Date().toISOString(),
  content: 'Article content here...',
  coverImage: 'https://example.com/cover.jpg',
  tags: ['ministry', 'outreach']
});
```

## PDF Features

### Layout
- A4 page format
- 20mm margins on all sides
- Professional typography
- Automatic page breaks

### Content
- Cover image (optional)
- Article title with gradient styling
- Author and date metadata
- Tags with gradient badges
- Formatted content with proper spacing
- Page numbers (X / Total)
- Footer with ministry information

### Styling
- Georgia/Times New Roman serif fonts
- Gradient accents for tags
- Professional color scheme
- Print-optimized layout

## Error Handling

The service handles various error scenarios:

- **400 Bad Request**: Invalid input data
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: PDF generation failed

Error Response Format:
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": [] // Validation errors if applicable
}
```

## Security

- Helmet.js for security headers
- CORS configuration
- Input validation with express-validator
- Rate limiting
- Request size limits (10MB)
- Sanitized filenames

## Performance

- Puppeteer runs in headless mode
- Browser instances are properly closed after use
- 60-second timeout for PDF generation
- Optimized HTML rendering

## Troubleshooting

### Puppeteer Installation Issues

If Puppeteer fails to install:

```bash
# Skip Chromium download during install
PUPPETEER_SKIP_DOWNLOAD=true npm install puppeteer

# Then install Chromium separately
npx puppeteer browsers install chrome
```

### Memory Issues

For large PDFs, you may need to increase Node.js memory:

```bash
node --max-old-space-size=4096 server/pdf-service.js
```

### Docker Deployment

When deploying with Docker, install required dependencies:

```dockerfile
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libgbm1
```

## Development

### Testing the Service

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test PDF generation
curl -X POST http://localhost:3001/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "author": "Test Author",
    "date": "2024-03-04",
    "content": "Test content",
    "tags": ["test"]
  }' \
  --output test.pdf
```

### Monitoring

Check logs for:
- Request processing
- Error messages
- Performance metrics
- Rate limit violations

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a process manager (PM2, systemd)
3. Set up reverse proxy (nginx)
4. Configure SSL/TLS
5. Set appropriate rate limits
6. Monitor memory usage
7. Set up logging

### PM2 Example

```bash
pm2 start server/pdf-service.js --name pdf-service
pm2 save
pm2 startup
```

## License

Part of the Reachout To All Ministry application.
