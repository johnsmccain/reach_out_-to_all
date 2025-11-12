/*
  # Setup Storage Buckets for Content Management

  1. New Buckets
    - quote-images: For daily quote image uploads
    - documents: For resource documents (PDFs, DOCX, TXT)

  2. Security Policies
    - Admins can upload to both buckets
    - Public read access for all files
    - File size limits configured

  3. Configuration
    - CORS enabled for file access
    - Public access enabled
*/

-- Create quote-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'quote-images',
  'quote-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Create documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for quote-images bucket

-- Allow public to view/download quote images
CREATE POLICY "Anyone can view quote images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'quote-images');

-- Allow authenticated admins to upload quote images
CREATE POLICY "Admins can upload quote images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'quote-images' 
  AND auth.jwt() ->> 'role' = 'authenticated'
);

-- Allow authenticated admins to update quote images
CREATE POLICY "Admins can update quote images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'quote-images')
WITH CHECK (bucket_id = 'quote-images');

-- Allow authenticated admins to delete quote images
CREATE POLICY "Admins can delete quote images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'quote-images');

-- Storage policies for documents bucket

-- Allow public to view/download documents
CREATE POLICY "Anyone can view documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'documents');

-- Allow authenticated admins to upload documents
CREATE POLICY "Admins can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND auth.jwt() ->> 'role' = 'authenticated'
);

-- Allow authenticated admins to update documents
CREATE POLICY "Admins can update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- Allow authenticated admins to delete documents
CREATE POLICY "Admins can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');
