# Portfolio URL Management Documentation

## Overview

This document explains how to manage the "Visit Main Portfolio" button URL that appears on the home page of the Gaurav Workspace site.

## Current Implementation

The portfolio URL is stored in Firebase Database at the path: `sections/otherPortfolio/url`

### Database Structure
```json
{
  "sections": {
    "otherPortfolio": {
      "title": "Main Portfolio",
      "url": "https://www.gauravpatil.online"
    }
  }
}
```

## Methods to Update the Portfolio URL

### Method 1: Using Admin Interface (Recommended)

1. **Access Admin Panel**
   - Navigate to `/admin/login`
   - Login with admin credentials (gaurav@admin.kop)

2. **Go to Settings**
   - In the admin panel, click on the "Settings" tab
   - You'll see the Portfolio Settings section

3. **Update URL**
   - Modify the "Portfolio URL" field
   - Click "Save Settings"
   - The change will be immediately reflected on the home page

### Method 2: Using Update Script (For Developers)

If you need to update via script (requires admin authentication):

1. **Run the update script**:
   ```bash
   node update-portfolio-url.js
   ```

   Note: This method requires proper Firebase authentication and may fail due to security rules.

### Method 3: Direct Database Update (Emergency)

If admin interface is unavailable:

1. **Update firebase-database-structure.json**:
   ```json
   {
     "sections": {
       "otherPortfolio": {
         "title": "Main Portfolio",
         "url": "YOUR_NEW_URL_HERE"
       }
     }
   }
   ```

2. **Manually sync to Firebase Database** using Firebase Console

## Components Affected

### HeroSection Component
- **File**: `src/components/home/HeroSection.tsx`
- **Lines**: 30-32, 51-55
- **Function**: Fetches the URL from database and opens it when button is clicked

### SettingsManager Component  
- **File**: `src/components/admin/SettingsManager.tsx`
- **Purpose**: Provides admin interface to update the URL

### Database Functions
- **File**: `src/lib/database.ts`
- **Function**: `updateSection()` - handles database updates
- **Function**: `getSections()` - retrieves current settings

## Database Security Rules

The portfolio URL can only be updated by authenticated admin users:

```json
{
  "rules": {
    ".write": "auth != null && auth.token.email == 'gaurav@admin.kop'"
  }
}
```

## Testing the Update

After updating the URL:

1. **Visit the home page**
2. **Click "Visit Main Portfolio" button**  
3. **Verify it opens the correct URL in a new tab**

## Troubleshooting

### Button Not Working
- Check browser console for JavaScript errors
- Verify the URL format is correct (includes https://)

### Admin Interface Shows Loading
- Check Firebase connection
- Verify user authentication status

### Permission Denied Errors  
- Ensure you're logged in as admin user
- Check Firebase security rules

## Historical URLs

- **Previous**: https://gauravpatil.dev
- **Current**: https://www.gauravpatil.online

---

*Last Updated: September 2025*
*Author: Kilo Code Assistant*