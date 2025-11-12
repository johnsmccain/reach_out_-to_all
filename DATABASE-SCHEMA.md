# Database Schema - Reachout To All

## 📊 Complete Database Structure

### Table Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                     REACHOUT TO ALL                         │
│                    Database Schema                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   EVENTS     │     │   SERMONS    │     │  DOCUMENTS   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │     │ id           │     │ id           │
│ title        │     │ title        │     │ title        │
│ description  │     │ speaker      │     │ description  │
│ date         │     │ date         │     │ file_url     │
│ location     │     │ duration     │     │ file_type    │
│ image_url    │     │ description  │     │ file_size    │
│ video_url    │     │ video_url    │     │ image_url    │
│ type         │     │ image_url    │     │ created_at   │
│ created_at   │     │ created_at   │     └──────────────┘
└──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  ARTICLES    │────>│  REACTIONS   │     │   COMMENTS   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │     │ id           │     │ id           │
│ title        │     │ article_id   │     │ article_id   │
│ content      │     │ user_id      │     │ user_id      │
│ author       │     │ type         │     │ comment      │
│ cover_image  │     │ created_at   │     │ author_name  │
│ tags[]       │     └──────────────┘     │ created_at   │
│ is_top       │                          └──────────────┘
│ published    │
│ created_at   │
│ updated_at   │
└──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ DAILY_QUOTES │     │ STATISTICS   │     │  SOUL_COUNT  │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │     │ id           │     │ id           │
│ quote        │     │ states_cov.  │     │ count        │
│ author       │     │ outreaches   │     │ last_updated │
│ date         │     │ locals_reach │     └──────────────┘
│ image_url    │     │ communities  │
│ image_type   │     │ souls_won    │
│ created_at   │     │ rededication │
└──────────────┘     │ medical_ben. │
                     │ welfare_ben. │
                     │ updated_at   │
                     └──────────────┘

┌──────────────┐     ┌──────────────┐
│PRAYER_REQS   │     │ VOLUNTEERS   │
├──────────────┤     ├──────────────┤
│ id           │     │ id           │
│ name         │     │ name         │
│ email        │     │ email        │
│ request      │     │ phone        │
│ created_at   │     │ unit         │
└──────────────┘     │ message      │
                     │ created_at   │
                     └──────────────┘
```

---

## 🗄️ Storage Buckets

```
┌─────────────────────────────────────────┐
│         STORAGE BUCKETS                 │
└─────────────────────────────────────────┘

📁 quote-images/
   ├── Size Limit: 10MB
   ├── Types: PNG, JPEG, JPG, WEBP
   ├── Access: Public Read, Admin Write
   └── Purpose: Daily quote images

📁 documents/
   ├── Size Limit: 50MB
   ├── Types: PDF, DOCX, DOC, TXT
   ├── Access: Public Read, Admin Write
   └── Purpose: Resource documents
```

---

## 🔒 Security Model

### Row Level Security (RLS)

```
PUBLIC ACCESS (No Auth Required)
├── ✅ View all published content
├── ✅ Submit prayer requests
├── ✅ Submit volunteer applications
├── ✅ Add article reactions
└── ✅ Add article comments

ADMIN ACCESS (Auth Required)
├── 🔐 Create/Edit/Delete events
├── 🔐 Create/Edit/Delete sermons
├── 🔐 Create/Edit/Delete documents
├── 🔐 Create/Edit/Delete articles
├── 🔐 Create/Edit/Delete quotes
├── 🔐 Update statistics
├── 🔐 View prayer requests
├── 🔐 View volunteer applications
└── 🔐 Manage storage files
```

---

## 📋 Table Details

### 1. Events
**Purpose**: Store church events (past, current, future)

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Event title |
| description | text | Event description |
| date | timestamptz | Event date/time |
| location | text | Event location |
| image_url | text | Event image (optional) |
| video_url | text | Event video (optional) |
| type | text | past/current/future |
| created_at | timestamptz | Creation timestamp |

**Indexes**: None (small table)  
**RLS**: Public read, Admin write

---

### 2. Prayer Requests
**Purpose**: Store prayer requests from visitors

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Requester name |
| email | text | Requester email |
| request | text | Prayer request |
| created_at | timestamptz | Submission time |

**Indexes**: created_at (for sorting)  
**RLS**: Public insert, Admin read

---

### 3. Volunteers
**Purpose**: Store volunteer applications

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Volunteer name |
| email | text | Volunteer email |
| phone | text | Phone number |
| unit | text | Ministry unit |
| message | text | Additional message |
| created_at | timestamptz | Application time |

**Indexes**: created_at (for sorting)  
**RLS**: Public insert, Admin read

---

### 4. Soul Count
**Purpose**: Track total souls won

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| count | integer | Total souls won |
| last_updated | timestamptz | Last update time |

**Indexes**: None (single row)  
**RLS**: Public read, Admin write

---

### 5. Sermons
**Purpose**: Store sermon videos and information

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Sermon title |
| speaker | text | Speaker name |
| date | timestamptz | Sermon date |
| duration | text | Duration (e.g., "45 min") |
| description | text | Sermon description |
| video_url | text | Video URL |
| image_url | text | Thumbnail image |
| created_at | timestamptz | Creation time |

**Indexes**: date (for sorting)  
**RLS**: Public read, Admin write

---

### 6. Documents
**Purpose**: Store downloadable resources

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Document title |
| description | text | Document description |
| file_url | text | File URL (Supabase storage) |
| file_type | text | MIME type |
| file_size | text | File size (formatted) |
| image_url | text | Thumbnail image |
| created_at | timestamptz | Upload time |

**Indexes**: created_at (for sorting)  
**RLS**: Public read, Admin write

---

### 7. Statistics
**Purpose**: Store ministry statistics

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| states_covered | integer | Number of states |
| outreaches_conducted | integer | Number of outreaches |
| locals_reached | integer | People reached |
| communities_reached | integer | Communities reached |
| souls_won | integer | Souls won |
| rededication_commitments | integer | Rededications |
| medical_beneficiaries | integer | Medical beneficiaries |
| welfare_beneficiaries | integer | Welfare beneficiaries |
| updated_at | timestamptz | Last update |

**Indexes**: None (single row)  
**RLS**: Public read, Admin write

---

### 8. Articles
**Purpose**: Store blog articles

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Article title |
| content | text | Article content |
| author | text | Author name |
| cover_image | text | Cover image URL |
| tags | text[] | Article tags |
| is_top | boolean | Featured article |
| published | boolean | Published status |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update |

**Indexes**: created_at, is_top, published  
**RLS**: Public read (published only), Admin write

---

### 9. Article Reactions
**Purpose**: Store reactions to articles

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| article_id | uuid | Foreign key to articles |
| user_id | uuid | User identifier |
| type | text | like/love/pray |
| created_at | timestamptz | Reaction time |

**Constraints**: UNIQUE(article_id, user_id, type)  
**Indexes**: article_id (for counting)  
**RLS**: Public read/insert

---

### 10. Article Comments
**Purpose**: Store comments on articles

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| article_id | uuid | Foreign key to articles |
| user_id | uuid | User identifier |
| comment | text | Comment text |
| author_name | text | Commenter name |
| created_at | timestamptz | Comment time |

**Indexes**: article_id, created_at  
**RLS**: Public read/insert

---

### 11. Daily Quotes
**Purpose**: Store daily inspirational quotes

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| quote | text | Quote text (nullable) |
| author | text | Quote author (nullable) |
| date | date | Quote date (unique) |
| image_url | text | Image URL (for image quotes) |
| image_type | varchar(10) | text/image |
| created_at | timestamptz | Creation time |

**Constraints**: UNIQUE(date), CHECK(image_type IN ('text', 'image'))  
**Indexes**: date (for daily lookup)  
**RLS**: Public read, Admin write

---

## 📊 Data Flow

### Public User Journey
```
1. Visit Website
   ↓
2. View Content (Articles, Events, Resources)
   ↓
3. Interact (React, Comment, Download)
   ↓
4. Submit Forms (Prayer Requests, Volunteer)
```

### Admin User Journey
```
1. Sign In
   ↓
2. Access Admin Dashboard
   ↓
3. Manage Content (Create, Edit, Delete)
   ↓
4. Upload Files (Images, Documents)
   ↓
5. View Submissions (Prayers, Volunteers)
```

---

## 🔄 Maintenance

### Regular Tasks
- Monitor storage usage
- Review prayer requests
- Process volunteer applications
- Update statistics
- Upload daily quotes
- Publish new articles

### Backup Strategy
- Supabase automatic backups (daily)
- Export important data regularly
- Keep local copies of uploaded files

---

**Database Version**: PostgreSQL 15.x (Supabase)  
**Last Updated**: November 12, 2025  
**Total Tables**: 11  
**Total Storage Buckets**: 2
