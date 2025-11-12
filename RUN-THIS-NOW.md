# ⚠️ FIX THE ERRORS - Run This Now!

## The Problem
Your application is showing "Error loading events/documents/sermons..." because the database tables don't exist yet in your new Supabase project.

## The Solution (2 Minutes)

### Step 1: Open Supabase SQL Editor
Click this link (it will open in your browser):
```
https://supabase.com/dashboard/project/xpklyizyeihcjlejgylu/sql/new
```

### Step 2: Copy the Setup Script
1. Open the file `setup-supabase.sql` in your code editor
2. Press `Ctrl+A` (Windows/Linux) or `Cmd+A` (Mac) to select all
3. Press `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac) to copy

### Step 3: Paste and Run
1. In the Supabase SQL Editor (from Step 1), paste the script
2. Click the **RUN** button (or press `Ctrl+Enter` / `Cmd+Enter`)
3. Wait 5-10 seconds for it to complete
4. You should see "Success. No rows returned"

### Step 4: Refresh Your App
1. Go back to your application (http://localhost:5173)
2. Refresh the page (`F5` or `Ctrl+R` / `Cmd+R`)
3. The errors should be gone!

---

## Quick Verification

After running the script, you can verify it worked:

1. In Supabase, click **Table Editor** (left sidebar)
2. You should see these tables:
   - events
   - prayer_requests
   - volunteers
   - soul_count
   - sermons
   - documents
   - statistics
   - articles
   - article_reactions
   - article_comments
   - daily_quotes

If you see these tables, you're all set! ✅

---

## Still Having Issues?

If you still see errors after running the script:

1. Check the browser console (F12) for specific error messages
2. Verify your `.env` file has the correct Supabase URL and key
3. Make sure the SQL script ran without errors in Supabase

---

**Direct Link to SQL Editor**: https://supabase.com/dashboard/project/xpklyizyeihcjlejgylu/sql/new
