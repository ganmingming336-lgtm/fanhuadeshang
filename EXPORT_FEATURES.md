# Export Features Documentation

## Overview

The Lottery Analyzer now supports exporting analysis results in multiple formats with a user-friendly interface.

## Supported Formats

### 1. CSV Export
- **Format**: Comma-separated values
- **Contents**:
  - Export metadata (date and time)
  - Summary metrics section (total numbers, unique numbers, most/least common)
  - Detailed frequency table with numbers, frequencies, and percentages
- **Filename**: `lottery_analysis_YYYY-MM-DDTHH-MM-SS.csv`
- **Use Case**: Import into spreadsheet applications (Excel, Google Sheets, etc.)

### 2. JSON Export
- **Format**: JavaScript Object Notation
- **Contents**:
  - Metadata (export date, version)
  - Summary object with key metrics
  - Complete frequency table
- **Filename**: `lottery_analysis_YYYY-MM-DDTHH-MM-SS.json`
- **Use Case**: Integration with other applications, programmatic access

### 3. Copy to Clipboard
- **Format**: JSON
- **Contents**: Same as JSON export
- **Use Case**: Quick sharing without downloading, pasting into documents or messaging apps

## Features

### Timestamped Filenames
All exported files include an ISO timestamp in the filename for easy organization:
- Format: `lottery_analysis_YYYY-MM-DDTHH-MM-SS.extension`
- Prevents filename conflicts when exporting multiple times

### Offline Capability
- All export operations are performed client-side using browser APIs
- No server communication required
- Works completely offline
- Uses standard browser Blob API for file downloads

### Browser Compatibility
- Modern Clipboard API with fallback to legacy `document.execCommand`
- Works in secure contexts (HTTPS) and development environments
- Compatible with all modern browsers (Chrome, Firefox, Safari, Edge)

### Mobile-Friendly Design
- Export buttons are responsive and touch-friendly
- Active state with scale animation for tactile feedback
- Copy-to-clipboard option works well on mobile devices
- Long-press compatible (browsers handle long-press natively)

## Feedback System

### Toast Notifications
- Success messages when export completes
- Error messages if something goes wrong
- Auto-dismiss after 3 seconds
- Manual dismiss button available
- Fixed position in bottom-right corner
- Color-coded by type (green for success, red for error)

### Message Types
- ✓ **Success**: "CSV file downloaded successfully"
- ✓ **Success**: "JSON file downloaded successfully"
- ✓ **Success**: "Results copied to clipboard"
- ✗ **Error**: "Failed to export CSV file"
- ✗ **Error**: "Failed to export JSON file"
- ✗ **Error**: "Failed to copy to clipboard"

## Technical Details

### Export Utilities (`exportUtils.ts`)
- `exportAsCSV()`: Downloads CSV file
- `exportAsJSON()`: Downloads JSON file
- `copyResultsToClipboard()`: Copies JSON to clipboard
- `generateCSV()`: Generates CSV string
- `generateJSON()`: Generates JSON string
- `downloadBlob()`: Creates and triggers browser download
- `copyToClipboard()`: Handles clipboard operations with fallback

### Toast Component (`Toast.tsx`)
- Reusable toast notification system
- Supports success, error, and info types
- Auto-dismiss with customizable duration
- Manual dismiss button
- Accessible with ARIA labels

### Integration
- Located in results section, always visible when results are available
- Three-button layout: CSV, JSON, Copy
- Consistent styling with the rest of the application
- Dark mode support

## Data Included in Exports

### Summary Metrics
- Total Numbers: Total count of numbers analyzed
- Unique Numbers: Count of distinct numbers
- Most Common: Number(s) with highest frequency
- Least Common: Number(s) with lowest frequency

### Frequency Table
Complete breakdown of each number (1-49) with:
- Frequency count
- Percentage of total

## Usage

1. **Analyze numbers** in the input section
2. **View results** in the results panel
3. **Export data** using one of the three buttons:
   - **CSV**: Download as spreadsheet
   - **JSON**: Download as structured data
   - **Copy**: Copy JSON to clipboard for sharing

## Code Architecture

### Files Modified/Created
- `app/page.tsx`: Main application, export handlers, toast state management
- `app/exportUtils.ts`: Export utility functions (NEW)
- `app/Toast.tsx`: Toast notification component (NEW)

### State Management
- `toasts`: Array of active toast messages
- `addToast()`: Show new notification
- `removeToast()`: Hide notification

### Error Handling
- Try-catch blocks around export operations
- Graceful error messages for users
- Console logging for debugging
- Fallback clipboard API for older browsers
