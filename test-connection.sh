#!/bin/bash

# Simple Supabase Connection Test
# This script tests if your .env file is configured correctly

echo "=========================================="
echo "Supabase Configuration Check"
echo "=========================================="
echo ""

# Load .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ .env file found"
else
    echo "❌ .env file not found"
    exit 1
fi

# Check SUPABASE_URL
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ VITE_SUPABASE_URL is not set"
    exit 1
else
    echo "✅ VITE_SUPABASE_URL: $VITE_SUPABASE_URL"
fi

# Check SUPABASE_ANON_KEY
if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ VITE_SUPABASE_ANON_KEY is not set"
    exit 1
else
    echo "✅ VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY:0:20}..."
fi

echo ""
echo "=========================================="
echo "Configuration looks good!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Open Supabase SQL Editor at:"
echo "   https://supabase.com/dashboard/project/xpklyizyeihcjlejgylu/sql"
echo ""
echo "2. Copy the contents of setup-supabase.sql"
echo ""
echo "3. Paste and run in the SQL Editor"
echo ""
echo "4. Run 'npm run dev' to start the application"
echo ""
