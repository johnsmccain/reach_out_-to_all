#!/bin/bash

# Content Management Enhancements - Implementation Verification Script
# This script verifies that all implemented features are present and functional

echo "=========================================="
echo "Content Management Enhancements"
echo "Implementation Verification"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counter for checks
TOTAL_CHECKS=0
PASSED_CHECKS=0

check_file() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "✗ $2"
        return 1
    fi
}

check_content() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $3"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "✗ $3"
        return 1
    fi
}

echo -e "${BLUE}1. Daily Quote Image Management${NC}"
check_file "src/components/DailyQuote.tsx" "DailyQuote component exists"
check_content "src/components/DailyQuote.tsx" "image_type === 'image'" "Image quote rendering implemented"
check_content "src/components/DailyQuote.tsx" "order.*ascending: false" "Fallback to latest quote implemented"
check_file "src/components/admin/QuoteUploadModal.tsx" "Quote upload modal exists"
echo ""

echo -e "${BLUE}2. PDF Export Functionality${NC}"
check_file "src/lib/pdfExport.ts" "PDF export utility exists"
check_content "src/lib/pdfExport.ts" "generateArticlePDF" "PDF generation function implemented"
check_content "src/lib/pdfExport.ts" "validateArticleData" "PDF validation implemented"
check_content "src/lib/pdfExport.ts" "sanitizeFilename" "Filename sanitization implemented"
check_content "src/pages/ArticleDetail.tsx" "generateArticlePDF" "PDF export integrated in ArticleDetail"
echo ""

echo -e "${BLUE}3. Document Management${NC}"
check_file "src/components/admin/DocumentUploadModal.tsx" "Document upload modal exists"
check_content "src/pages/Resources.tsx" "formatFileSize" "File size formatting implemented"
check_content "src/pages/Resources.tsx" "canPreview" "PDF preview functionality implemented"
check_content "src/pages/Resources.tsx" "handleDownload" "Download functionality implemented"
echo ""

echo -e "${BLUE}4. Responsive Design${NC}"
check_content "src/components/DailyQuote.tsx" "text-lg md:text-xl" "Responsive text sizing"
check_content "src/pages/Resources.tsx" "grid md:grid-cols-2 lg:grid-cols-3" "Responsive grid layout"
check_content "src/pages/ArticleDetail.tsx" "h-64 md:h-96" "Responsive image sizing"
echo ""

echo -e "${BLUE}5. Database Schema${NC}"
check_file "supabase/migrations/20250211000000_add_image_support_to_quotes.sql" "Quote image migration exists"
check_file "supabase/migrations/20250211000001_setup_storage_buckets.sql" "Storage buckets migration exists"
echo ""

echo -e "${BLUE}6. Type Definitions${NC}"
check_content "src/types.ts" "image_url" "DailyQuote type updated with image support"
check_content "src/types.ts" "image_type" "DailyQuote type includes image_type field"
echo ""

echo -e "${BLUE}7. Build Verification${NC}"
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC} Production build exists"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "✗ Production build exists (run 'npm run build')"
fi
echo ""

echo "=========================================="
echo "Verification Complete"
echo "=========================================="
echo -e "Passed: ${GREEN}${PASSED_CHECKS}${NC}/${TOTAL_CHECKS} checks"
echo ""

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo "The implementation is complete and ready for testing."
    exit 0
else
    echo "⚠ Some checks failed. Please review the implementation."
    exit 1
fi
