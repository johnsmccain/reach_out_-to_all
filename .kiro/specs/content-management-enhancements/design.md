# Design Document

## Overview

This design document outlines the technical approach for implementing content management enhancements to the Reachout To All website. The solution builds upon the existing React + TypeScript + Supabase architecture to add three key features: daily quote image management, article PDF export, and enhanced resource document management. The design maintains consistency with existing patterns while introducing new capabilities for content delivery and user engagement.

## Architecture

### System Context

The application follows a client-server architecture:
- **Frontend**: React 18 with TypeScript, using Vite as the build tool
- **Backend**: Supabase (PostgreSQL database + Storage + Real-time subscriptions)
- **File Storage**: Supabase Storage for images and documents
- **PDF Generation**: Client-side using jsPDF and html2canvas libraries (already installed)
- **State Management**: React hooks (useState, useEffect)
- **Routing**: React Router v6
- **UI Components**: Shadcn/ui components with Tailwind CSS

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Home Page  │  │ Article Page │  │Resource Page │      │
│  │              │  │              │  │              │      │
│  │ DailyQuote   │  │ PDF Export   │  │ Doc Download │      │
│  │ Component    │  │ Comments     │  │ Doc Preview  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          Admin Dashboard                             │    │
│  │  - Quote Image Upload                                │    │
│  │  - Article Management                                │    │
│  │  - Document Upload                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │   Storage    │  │  Real-time   │      │
│  │              │  │              │  │              │      │
│  │ daily_quotes │  │ quote-images │  │ Subscriptions│      │
│  │ articles     │  │ documents    │  │              │      │
│  │ documents    │  │              │  │              │      │
│  │ comments     │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Daily Quote Image Management

#### Database Schema Changes

Update the `daily_quotes` table:
```sql
ALTER TABLE daily_quotes 
ADD COLUMN image_url TEXT,
ADD COLUMN image_type VARCHAR(10) DEFAULT 'text' CHECK (image_type IN ('text', 'image'));
```

#### Component: DailyQuote.tsx (Enhanced)

**Current State**: Displays text-based quotes
**Enhanced State**: Displays either text quotes or image quotes

```typescript
interface DailyQuote {
  id: string;
  quote?: string;
  author?: string;
  image_url?: string;
  image_type: 'text' | 'image';
  date: string;
  created_at: string;
}
```

**Key Changes**:
- Add conditional rendering for image vs text quotes
- Fetch quote based on current date
- Display image with proper aspect ratio and responsive sizing
- Fallback to latest quote if no quote exists for today

#### Component: QuoteUploadModal (New)

**Purpose**: Admin interface for uploading quote images

**Features**:
- File input accepting PNG files only
- Date picker for scheduling quotes
- Image preview before upload
- Upload to Supabase Storage
- Store metadata in daily_quotes table

**Upload Flow**:
1. Admin selects PNG file
2. Preview displays in modal
3. Admin selects date
4. File uploads to Supabase Storage bucket `quote-images`
5. URL stored in database with date
6. Success notification displayed

### 2. Article PDF Export

#### Component: ArticleDetail.tsx (Enhanced)

**Current State**: Has non-functional "Download PDF" button
**Enhanced State**: Fully functional PDF export

#### PDF Generation Service

**File**: `src/lib/pdfExport.ts` (New)

```typescript
interface ArticlePDFOptions {
  title: string;
  author: string;
  date: string;
  content: string;
  coverImage?: string;
  tags: string[];
}

export async function generateArticlePDF(options: ArticlePDFOptions): Promise<void>
```

**Implementation Approach**:
- Use jsPDF for PDF generation
- Use html2canvas for cover image rendering (if present)
- Format content with proper typography
- Add header with title and metadata
- Add footer with tags and page numbers
- Handle multi-page content with proper page breaks
- Sanitize filename from article title

**PDF Layout**:
```
┌─────────────────────────────────┐
│  Cover Image (if available)     │
├─────────────────────────────────┤
│  Article Title (Large, Bold)    │
│  By Author Name                  │
│  Date                            │
├─────────────────────────────────┤
│                                  │
│  Article Content                 │
│  (Formatted paragraphs)          │
│                                  │
│  ...                             │
│                                  │
├─────────────────────────────────┤
│  Tags: #tag1 #tag2 #tag3        │
│  Page 1 of N                     │
└─────────────────────────────────┘
```

### 3. Enhanced Resource Document Management

#### Database Schema (Already Exists)

The `documents` table already has the necessary structure:
- id, title, description
- file_url, file_type, file_size
- image_url (thumbnail)
- created_at

#### Component: Resources.tsx (Enhanced)

**Current State**: Displays documents with download links
**Enhanced State**: Improved UI with better document cards

**Enhancements**:
- Better visual hierarchy for document cards
- Larger thumbnails
- Clear file type badges
- Prominent download buttons
- File size display
- Optional preview functionality (for PDFs)

#### Component: DocumentUploadModal (New)

**Purpose**: Admin interface for uploading documents

**Features**:
- File input for document upload (PDF, DOCX, TXT)
- Optional thumbnail image upload
- Title and description fields
- Automatic file size calculation
- Upload to Supabase Storage bucket `documents`
- Store metadata in documents table

**Upload Flow**:
1. Admin fills in title and description
2. Admin selects document file
3. Admin optionally uploads thumbnail
4. System calculates file size and type
5. File uploads to Supabase Storage
6. Metadata stored in database
7. Success notification displayed

### 4. Article Comment System (Enhancement)

#### Current State
The comment system is already implemented with:
- Real-time subscriptions
- Comment form with name and text
- Display of existing comments

#### Enhancements

**Component**: ArticleDetail.tsx

**Improvements**:
- Better comment validation
- Character limit display
- Comment count badge
- Improved error handling
- Loading states during submission
- Empty state when no comments exist

### 5. Admin Dashboard Enhancements

#### Component: AdminDashboard.tsx (Enhanced)

**Current State**: Has tabs for events, articles, sermons, documents, quotes, statistics

**Enhancements**:

**Quotes Tab**:
- Add "Upload Quote Image" button
- Display quote images as thumbnails in table
- Show quote type (text/image) indicator
- Edit functionality for text quotes
- Delete functionality for all quotes

**Documents Tab** (New Implementation):
- Add "Upload Document" button
- Display documents in table with thumbnails
- Show file type, size, and download count
- Edit and delete functionality
- Preview button for PDFs

**Articles Tab** (Existing):
- Maintain current functionality
- Ensure "Featured" toggle works correctly

## Data Models

### Updated DailyQuote Type

```typescript
export interface DailyQuote {
  id: string;
  quote?: string;
  author?: string;
  image_url?: string;
  image_type: 'text' | 'image';
  date: string;
  created_at: string;
}
```

### Document Type (Existing)

```typescript
export interface Document {
  id: string;
  title: string;
  description: string;
  file_url: string;
  fileUrl: string;
  file_type: string;
  fileType: string;
  file_size: string;
  fileSize: string;
  image_url?: string;
  imageUrl?: string;
  created_at: string;
}
```

### PDF Export Options

```typescript
export interface ArticlePDFOptions {
  title: string;
  author: string;
  date: string;
  content: string;
  coverImage?: string;
  tags: string[];
}
```

## Error Handling

### File Upload Errors

**Scenarios**:
- File too large (> 10MB for images, > 50MB for documents)
- Invalid file type
- Network failure during upload
- Storage quota exceeded

**Handling**:
- Display user-friendly error messages via toast notifications
- Log errors to console for debugging
- Provide retry mechanism
- Clear form state on error

### PDF Generation Errors

**Scenarios**:
- Content too large to render
- Missing required fields
- Browser compatibility issues

**Handling**:
- Validate article data before generation
- Show loading indicator during generation
- Display error toast if generation fails
- Fallback to browser print dialog

### Database Errors

**Scenarios**:
- Connection timeout
- Constraint violations (duplicate dates for quotes)
- Permission errors

**Handling**:
- Retry logic for transient failures
- Validation before database operations
- Clear error messages to admin
- Maintain data consistency

## Testing Strategy

### Unit Testing

**Components to Test**:
- PDF generation utility functions
- File upload validation logic
- Date comparison for quote selection
- File size formatting utilities

**Approach**:
- Test pure functions in isolation
- Mock Supabase client
- Test edge cases (empty data, invalid inputs)

### Integration Testing

**Scenarios**:
- Upload quote image and verify display on home page
- Generate PDF and verify content accuracy
- Upload document and verify download functionality
- Submit comment and verify real-time update

**Approach**:
- Test complete user flows
- Use test database
- Verify database state changes
- Test error scenarios

### Manual Testing

**Test Cases**:
1. Admin uploads quote image for today → Verify immediate display
2. Admin uploads quote image for future date → Verify scheduled display
3. User downloads article as PDF → Verify formatting and content
4. User downloads document → Verify file integrity
5. User submits comment → Verify real-time appearance
6. Admin deletes quote → Verify removal from display
7. Test responsive design on mobile devices
8. Test with slow network conditions

### Browser Compatibility

**Target Browsers**:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Specific Tests**:
- PDF generation across browsers
- File upload functionality
- Image rendering
- Real-time subscriptions

## Security Considerations

### File Upload Security

**Measures**:
- Validate file types on client and server
- Limit file sizes
- Sanitize filenames
- Use Supabase Storage security policies
- Scan uploaded files for malware (Supabase feature)

### Storage Policies

**Supabase Storage Buckets**:

```sql
-- quote-images bucket
CREATE POLICY "Admins can upload quote images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'quote-images' AND auth.role() = 'admin');

CREATE POLICY "Anyone can view quote images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'quote-images');

-- documents bucket
CREATE POLICY "Admins can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.role() = 'admin');

CREATE POLICY "Anyone can download documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'documents');
```

### Database Security

**Row Level Security (RLS)**:
- Maintain existing RLS policies
- Ensure only admins can insert/update/delete quotes and documents
- Allow public read access to published content
- Protect comment system from spam (rate limiting)

### Content Security

**Measures**:
- Sanitize user input in comments
- Validate URLs before storing
- Prevent XSS attacks in rendered content
- Use Content Security Policy headers

## Performance Optimization

### Image Optimization

**Strategies**:
- Compress uploaded images before storage
- Use responsive image sizes
- Lazy load images below the fold
- Cache images with appropriate headers

### PDF Generation

**Optimizations**:
- Generate PDFs asynchronously
- Show progress indicator
- Limit content size for PDF export
- Cache generated PDFs (future enhancement)

### Database Queries

**Optimizations**:
- Index date column in daily_quotes table
- Limit query results with pagination
- Use Supabase query caching
- Optimize real-time subscription filters

### Bundle Size

**Considerations**:
- jsPDF and html2canvas add ~200KB to bundle
- Consider code splitting for admin features
- Lazy load PDF generation module
- Monitor bundle size with build tools

## Deployment Considerations

### Database Migration

**Steps**:
1. Create migration file for daily_quotes schema changes
2. Test migration on staging database
3. Run migration on production
4. Verify data integrity

### Storage Bucket Setup

**Steps**:
1. Create `quote-images` bucket in Supabase
2. Create `documents` bucket (if not exists)
3. Configure bucket policies
4. Set up CORS for file access
5. Configure file size limits

### Environment Variables

**Required**:
- VITE_SUPABASE_URL (existing)
- VITE_SUPABASE_ANON_KEY (existing)

**No new environment variables needed**

### Rollback Plan

**If issues occur**:
1. Revert database migration
2. Remove new storage buckets
3. Deploy previous frontend version
4. Restore from database backup if needed

## Future Enhancements

### Phase 2 Features

1. **Quote Scheduling**:
   - Bulk upload multiple quotes
   - Calendar view for scheduled quotes
   - Automatic quote rotation

2. **Advanced PDF Features**:
   - Custom PDF templates
   - Include comments in PDF
   - Email PDF to user

3. **Document Management**:
   - Document categories/folders
   - Search and filter documents
   - Document versioning
   - View count tracking

4. **Comment Moderation**:
   - Admin approval for comments
   - Report inappropriate comments
   - Comment editing by author
   - Threaded replies

5. **Analytics**:
   - Track PDF downloads
   - Monitor document downloads
   - Quote engagement metrics
   - Popular articles dashboard
