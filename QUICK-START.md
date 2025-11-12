# 🚀 Quick Start - Supabase Setup

## 3-Step Setup

### 1️⃣ Open Supabase SQL Editor
```
https://supabase.com/dashboard/project/xpklyizyeihcjlejgylu/sql
```

### 2️⃣ Copy & Run Setup Script
- Open `setup-supabase.sql`
- Copy all contents
- Paste in SQL Editor
- Click **Run**

### 3️⃣ Start Development
```bash
npm run dev
```

Visit: http://localhost:5173

---

## ✅ What Gets Created

### 📊 Tables (11)
- events, prayer_requests, volunteers, soul_count
- sermons, documents, statistics
- articles, article_reactions, article_comments
- daily_quotes

### 🗄️ Storage Buckets (2)
- quote-images (10MB, public)
- documents (50MB, public)

### 🔒 Security
- Row Level Security enabled
- Public read access
- Admin write access

### 📝 Sample Data
- 2 sample articles
- 1 sample quote
- Initial statistics

---

## 🎯 Quick Test

After setup, test these URLs:

- **Home**: http://localhost:5173
- **Articles**: http://localhost:5173/articles
- **Resources**: http://localhost:5173/resources
- **Admin**: http://localhost:5173/admin

---

## 🔑 Admin Setup

1. Go to Supabase → Authentication → Users
2. Click **Add User**
3. Enter email/password
4. Sign in at `/admin`

---

## 📚 Full Documentation

- `SUPABASE-SETUP-GUIDE.md` - Complete guide
- `SETUP-CHECKLIST.md` - Step-by-step checklist
- `setup-supabase.sql` - Database setup script

---

## 🆘 Issues?

**Tables not created?**
→ Re-run the setup script (safe to run multiple times)

**Can't upload files?**
→ Check you're signed in as admin

**RLS blocking access?**
→ Verify policies in Authentication → Policies

---

**Your Supabase Project**: xpklyizyeihcjlejgylu  
**Dashboard**: https://supabase.com/dashboard/project/xpklyizyeihcjlejgylu
