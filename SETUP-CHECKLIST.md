# Supabase Setup Checklist ✅

Follow these steps to set up your new Supabase database for Reachout To All.

## 📋 Pre-Setup Verification

- [x] ✅ New Supabase project created
- [x] ✅ Environment variables configured in `.env`
  - `VITE_SUPABASE_URL`: https://xpklyizyeihcjlejgylu.supabase.co
  - `VITE_SUPABASE_ANON_KEY`: Configured

## 🚀 Setup Steps

### Step 1: Run the Database Setup Script

1. [ ] Open your Supabase Dashboard
   - URL: https://supabase.com/dashboard/project/xpklyizyeihcjlejgylu

2. [ ] Navigate to SQL Editor
   - Click **SQL Editor** in the left sidebar

3. [ ] Copy and run the setup script
   - Open `setup-supabase.sql` in this repository
   - Copy the entire contents (Ctrl/Cmd + A, then Ctrl/Cmd + C)
   - Paste into Supabase SQL Editor
   - Click **Run** or press Ctrl/Cmd + Enter

4. [ ] Wait for completion
   - Should take 5-10 seconds
   - Look for "Success" message

### Step 2: Verify Tables Created

Go to **Table Editor** and verify these tables exist:

- [ ] events
- [ ] prayer_requests
- [ ] volunteers
- [ ] soul_count
- [ ] sermons
- [ ] documents
- [ ] statistics
- [ ] articles
- [ ] article_reactions
- [ ] article_comments
- [ ] daily_quotes

### Step 3: Verify Storage Buckets

Go to **Storage** and verify these buckets exist:

- [ ] quote-images (10MB limit, public)
- [ ] documents (50MB limit, public)

### Step 4: Check Sample Data

1. [ ] Go to Table Editor → articles
   - Should see 2 sample articles

2. [ ] Go to Table Editor → daily_quotes
   - Should see 1 sample quote

3. [ ] Go to Table Editor → statistics
   - Should see 1 row with initial statistics

### Step 5: Test the Application

1. [ ] Start the development server
   ```bash
   npm run dev
   ```

2. [ ] Test public pages (no authentication needed)
   - [ ] Home page: http://localhost:5173
   - [ ] Articles page: http://localhost:5173/articles
   - [ ] Resources page: http://localhost:5173/resources
   - [ ] Events page: http://localhost:5173/events
   - [ ] About page: http://localhost:5173/about
   - [ ] Contact page: http://localhost:5173/contact

3. [ ] Test daily quote display
   - [ ] Quote appears on home page
   - [ ] Quote text is readable
   - [ ] Author name displays

4. [ ] Test articles
   - [ ] Articles list displays
   - [ ] Can click to view article detail
   - [ ] Can add reactions (like, love, pray)
   - [ ] Can add comments
   - [ ] Can download PDF

5. [ ] Test resources
   - [ ] Sermons display (if any)
   - [ ] Documents display (if any)

### Step 6: Set Up Admin Access

1. [ ] Create admin user in Supabase
   - Go to Authentication → Users
   - Click **Add User**
   - Enter email and password
   - Click **Create User**

2. [ ] Test admin login
   - Go to http://localhost:5173/admin
   - Sign in with admin credentials

3. [ ] Test admin features
   - [ ] Can access admin dashboard
   - [ ] Can create/edit events
   - [ ] Can create/edit articles
   - [ ] Can upload daily quotes (text and image)
   - [ ] Can upload documents
   - [ ] Can view prayer requests
   - [ ] Can view volunteer applications

### Step 7: Test File Uploads

1. [ ] Test quote image upload
   - [ ] Go to Admin → Daily Quotes
   - [ ] Click "Upload Quote"
   - [ ] Select image type
   - [ ] Upload an image (PNG, JPG, JPEG)
   - [ ] Verify image displays on home page

2. [ ] Test document upload
   - [ ] Go to Admin → Documents
   - [ ] Click "Upload Document"
   - [ ] Upload a PDF file
   - [ ] Verify document appears in Resources page
   - [ ] Test download functionality
   - [ ] Test preview functionality (for PDFs)

## 🔧 Troubleshooting

### Issue: Tables not created
**Solution**: 
- Check for error messages in SQL Editor
- Ensure you copied the entire script
- Try running the script again (it's safe to re-run)

### Issue: Storage buckets not created
**Solution**:
- Go to Storage in Supabase
- Manually create buckets:
  - Name: `quote-images`, Public: Yes, Size: 10MB
  - Name: `documents`, Public: Yes, Size: 50MB
- Re-run the storage policy section of the script

### Issue: Can't upload files
**Solution**:
- Verify you're signed in as admin
- Check file size (10MB for images, 50MB for documents)
- Check file type is allowed
- Check browser console for errors

### Issue: RLS policies blocking access
**Solution**:
- Go to Authentication → Policies
- Verify policies exist for each table
- Check that public policies allow SELECT
- For admin operations, ensure you're authenticated

## ✅ Setup Complete!

Once all items are checked:

- [ ] All tables created and verified
- [ ] All storage buckets created and verified
- [ ] Sample data loaded
- [ ] Application running locally
- [ ] Admin user created
- [ ] File uploads working
- [ ] All features tested

## 📚 Next Steps

After completing setup:

1. **Customize Content**
   - Add your own articles
   - Upload daily quotes
   - Add events
   - Upload documents/sermons

2. **Configure Admin Users**
   - Create additional admin accounts if needed
   - Set up proper authentication flow

3. **Deploy to Production**
   - Build the application: `npm run build`
   - Deploy to your hosting platform
   - Update environment variables for production

4. **Monitor and Maintain**
   - Check Supabase logs regularly
   - Monitor storage usage
   - Update content regularly

## 🆘 Need Help?

If you encounter issues:

1. Check `SUPABASE-SETUP-GUIDE.md` for detailed instructions
2. Review Supabase logs in the Dashboard
3. Check browser console for errors
4. Verify `.env` file has correct credentials

---

**Setup Files**:
- `setup-supabase.sql` - Main setup script
- `SUPABASE-SETUP-GUIDE.md` - Detailed guide
- `test-connection.sh` - Connection test script

**Last Updated**: November 12, 2025
