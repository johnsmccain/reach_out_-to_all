# Supabase Setup Guide - Reachout To All

This guide will help you set up your new Supabase database for the Reachout To All application.

## 🚀 Quick Setup

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `xpklyizyeihcjlejgylu`
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Setup Script

1. Open the file `setup-supabase.sql` in this repository
2. Copy the entire contents
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl/Cmd + Enter)

The script will create all necessary tables, policies, and storage buckets.

### Step 3: Verify Setup

After running the script, verify that everything was created successfully:

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - ✅ events
   - ✅ prayer_requests
   - ✅ volunteers
   - ✅ soul_count
   - ✅ sermons
   - ✅ documents
   - ✅ statistics
   - ✅ articles
   - ✅ article_reactions
   - ✅ article_comments
   - ✅ daily_quotes

3. Go to **Storage** in Supabase
4. You should see these buckets:
   - ✅ quote-images (10MB limit, public)
   - ✅ documents (50MB limit, public)

## 📊 Database Schema Overview

### Core Tables

#### 1. Events
Stores church events (past, current, future)
- Fields: title, description, date, location, image_url, video_url, type

#### 2. Prayer Requests
Stores prayer requests from visitors
- Fields: name, email, request

#### 3. Volunteers
Stores volunteer applications
- Fields: name, email, phone, unit, message

#### 4. Soul Count
Tracks total souls won
- Fields: count, last_updated

#### 5. Sermons
Stores sermon videos and information
- Fields: title, speaker, date, duration, description, video_url, image_url

#### 6. Documents
Stores downloadable resources (PDFs, DOCX, TXT)
- Fields: title, description, file_url, file_type, file_size, image_url

#### 7. Statistics
Stores ministry statistics
- Fields: states_covered, outreaches_conducted, locals_reached, communities_reached, souls_won, rededication_commitments, medical_beneficiaries, welfare_beneficiaries

#### 8. Articles
Stores blog articles
- Fields: title, content, author, cover_image, tags, is_top, published

#### 9. Article Reactions
Stores reactions to articles (like, love, pray)
- Fields: article_id, user_id, type

#### 10. Article Comments
Stores comments on articles
- Fields: article_id, user_id, comment, author_name

#### 11. Daily Quotes
Stores daily inspirational quotes (text or image)
- Fields: quote, author, date, image_url, image_type

### Storage Buckets

#### 1. quote-images
- **Purpose**: Store daily quote images
- **Size Limit**: 10MB per file
- **Allowed Types**: PNG, JPEG, JPG, WEBP
- **Access**: Public read, authenticated write

#### 2. documents
- **Purpose**: Store resource documents
- **Size Limit**: 50MB per file
- **Allowed Types**: PDF, DOCX, DOC, TXT
- **Access**: Public read, authenticated write

## 🔒 Security Policies

All tables have Row Level Security (RLS) enabled with the following policies:

### Public Access (No Authentication Required)
- ✅ View events
- ✅ View sermons
- ✅ View documents
- ✅ View published articles
- ✅ View article reactions and comments
- ✅ View daily quotes
- ✅ View statistics
- ✅ View soul count
- ✅ Submit prayer requests
- ✅ Submit volunteer applications
- ✅ Add article reactions and comments

### Admin Access (Authentication Required)
- 🔐 Create/Update/Delete events
- 🔐 Create/Update/Delete sermons
- 🔐 Create/Update/Delete documents
- 🔐 Create/Update/Delete articles
- 🔐 Create/Update/Delete daily quotes
- 🔐 Update statistics
- 🔐 Update soul count
- 🔐 View prayer requests
- 🔐 View volunteer applications
- 🔐 Upload/Delete files in storage buckets

## 🧪 Testing the Setup

### Test Database Connection

Run this command in your terminal:

```bash
npm run dev
```

Then visit:
- http://localhost:5173 - Home page
- http://localhost:5173/articles - Articles page
- http://localhost:5173/resources - Resources page
- http://localhost:5173/events - Events page

### Test Admin Features

To test admin features, you'll need to:

1. Create an admin user in Supabase Authentication
2. Sign in through your application
3. Access the admin dashboard at `/admin`

## 📝 Sample Data

The setup script includes sample data:
- 2 sample articles
- 1 sample daily quote
- Initial statistics (15 states, 13 outreaches, etc.)
- Initial soul count (0)

## 🔧 Troubleshooting

### Issue: "relation already exists" errors
**Solution**: This is normal if you're re-running the script. The script uses `IF NOT EXISTS` and `ON CONFLICT` clauses to handle existing tables.

### Issue: Storage policies not working
**Solution**: 
1. Go to Storage → Settings in Supabase
2. Ensure both buckets are set to "Public"
3. Re-run the storage policy section of the script

### Issue: Can't upload files
**Solution**:
1. Check that you're authenticated
2. Verify the file size is within limits (10MB for images, 50MB for documents)
3. Verify the file type is allowed
4. Check browser console for specific errors

### Issue: RLS policies blocking access
**Solution**:
1. Go to Authentication → Policies in Supabase
2. Verify policies are created for each table
3. Check that public policies allow SELECT operations
4. For admin operations, ensure you're authenticated

## 🎯 Next Steps

After setup is complete:

1. ✅ Test the application locally
2. ✅ Create an admin user in Supabase Authentication
3. ✅ Upload some test content (quotes, documents, articles)
4. ✅ Test all features (upload, download, preview, etc.)
5. ✅ Deploy to production

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)
- [SQL Editor Guide](https://supabase.com/docs/guides/database/overview)

## 🆘 Need Help?

If you encounter any issues:

1. Check the Supabase logs in the Dashboard
2. Review the browser console for errors
3. Verify your `.env` file has the correct credentials
4. Ensure your Supabase project is active and not paused

---

**Setup Script Location**: `setup-supabase.sql`  
**Last Updated**: November 12, 2025  
**Database Version**: PostgreSQL 15.x (Supabase)
