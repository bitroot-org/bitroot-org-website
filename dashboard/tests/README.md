# Dashboard E2E Tests

This directory contains end-to-end tests for the student dashboard using Playwright.

## Test Accounts

### BKC Student (Full Access)
- **Email:** `yash@bkc.met.edu`
- **Password:** `Yash@cc2025`
- **Access:** All 6 sections (Dashboard, Projects, Timeline, Analytics, Resources, Settings)

### Non-BKC Student (Limited Access)
- **Email:** `test@gmail.com`
- **Password:** `Test@2025`
- **Access:** Only 3 base sections (Dashboard, Projects, Timeline)

## Running Tests

### Prerequisites
Before running tests, make sure:
1. You have created both test accounts in Clerk Dashboard
2. Password authentication is enabled in Clerk
3. The dev server is running or will be auto-started by Playwright

### Run All Tests
```bash
npm test
```

### Run BKC Student Tests Only
```bash
npm run test:bkc
```

### Run Non-BKC Student Tests Only
```bash
npm run test:non-bkc
```

### Run Tests with UI (Interactive Mode)
```bash
npm run test:ui
```

## Test Coverage

### BKC Student Tests (`tests/bkc-student-login.spec.ts`)
- ✅ Login with BKC credentials
- ✅ Verify BKC badge in sidebar
- ✅ Verify all 6 navigation items visible
- ✅ Access BKC-only pages (Analytics, Resources, Settings)
- ✅ Verify BKC-specific welcome message
- ✅ Verify stats cards display

### Non-BKC Student Tests (`tests/non-bkc-student.spec.ts`)
- ✅ Login with non-BKC credentials
- ✅ Verify BKC badge NOT visible
- ✅ Verify only 3 base navigation items visible
- ✅ Verify redirect when accessing BKC-only pages
- ✅ Verify generic welcome message (not BKC-specific)
- ✅ Verify access to base features (Projects, Timeline)

## Setting Up Test Accounts in Clerk

### Method 1: Via Dashboard (Recommended for Development)
1. Go to https://dashboard.clerk.com/
2. Navigate to **Users**
3. Click **Create user**
4. Add user with:
   - Email: `yash@bkc.met.edu`
   - Password: `Yash@cc2025`
5. Repeat for non-BKC user:
   - Email: `test@gmail.com`
   - Password: `Test@2025`

### Method 2: Enable Password Authentication
1. Go to https://dashboard.clerk.com/
2. Navigate to **User & Authentication** → **Email, Phone, Username**
3. Enable **Password** authentication
4. Set email verification to **Optional** (for testing)
5. Now you can sign up with these credentials via the app

## Troubleshooting

### Tests Fail at Login
- Ensure test accounts exist in Clerk
- Verify password authentication is enabled
- Check that dev server is running on port 3000

### Tests Timeout
- Increase timeout in playwright.config.ts
- Check network connection
- Verify Clerk is accessible

### Wrong Sidebar Sections Displayed
- Clear browser storage
- Sign out and sign in again
- Verify email domain logic in code

## CI/CD Integration

To run tests in CI:
```bash
CI=true npm test
```

This will:
- Run tests headlessly
- Enable retries
- Generate HTML report