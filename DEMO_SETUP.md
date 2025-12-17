# Demo Accounts Setup Guide

## Quick Login Feature

The login page now has a "Quick Login (Demo)" section with 3 buttons that will automatically log you in as Admin, Vendor, or User.

## First Time Setup

**IMPORTANT:** You need to register these demo accounts ONCE before the Quick Login buttons will work.

### Step 1: Register Demo Accounts

Go to the Register page (`http://localhost:5173/register`) and create these three accounts:

#### 1. Admin Account
- **Name:** Admin User
- **Email:** `admin@ticketbari.com`
- **Password:** `Admin@123`
- **Role:** Select **"Admin (Manage System)"**
- Click **Create Account**

#### 2. Vendor Account
- **Name:** Vendor User
- **Email:** `vendor@ticketbari.com`
- **Password:** `Vendor@123`
- **Role:** Select **"Vendor (Provide Transport Services)"**
- Click **Create Account**

#### 3. User Account
- **Name:** Normal User
- **Email:** `user@ticketbari.com`
- **Password:** `User@123`
- **Role:** Select **"User (Book Tickets)"**
- Click **Create Account**

### Step 2: Test Quick Login

After registering all three accounts, go to the Login page and click any of the Quick Login buttons:
- **Admin** button - Logs in as admin
- **Vendor** button - Logs in as vendor
- **User** button - Logs in as regular user

## Features Fixed

✅ Email input is now visible in light mode (white background, dark text)
✅ Removed stray CSS text that was showing on the page
✅ Quick Login buttons now perform actual login (not just fill credentials)
✅ Proper error handling if accounts don't exist yet

## Backend Connection

The system is fully connected to the backend:
- Firebase Authentication handles user authentication
- MongoDB stores user data with roles (admin/vendor/user)
- Role-based routing shows different dashboards for each user type
