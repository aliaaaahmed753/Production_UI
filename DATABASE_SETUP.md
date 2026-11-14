# 🗄️ Database Setup Guide

## 📋 Overview

This project uses **JSON Server** for local development and can be deployed to **GitHub Pages** with the database hosted on GitHub.

---

## 🚀 Local Development Setup

### 1. Start JSON Server

```bash
npm run json-server
```

This will start JSON Server on `http://localhost:3001`

### 2. Start Development Server

In a new terminal:

```bash
npm run dev
```

This will start Vite on `http://localhost:5173`

### 3. Start Both Together (Recommended)

```bash
npm install -D npm-run-all
npm run dev:all
```

---

## 📁 Database Structure

The `db.json` file contains:

- **users** - User accounts and authentication
- **productionOrders** - All production orders
- **workOrders** - Work orders for each production stage
- **activityLog** - Activity tracking and audit trail

---

## 🌐 GitHub Pages Deployment

### Option 1: Using GitHub as Database (Simple but Limited)

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Update API Configuration**
   
   In `src/services/api.ts`, update:
   ```typescript
   const GITHUB_API_URL = 'https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/db.json';
   ```

3. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

⚠️ **Limitations:**
- GitHub API has rate limits (60 requests/hour for unauthenticated)
- Write operations require authentication token
- Not suitable for production with multiple users

---

### Option 2: Using External Backend (Recommended for Production)

For a real production app, consider these free backend options:

#### **A. Supabase** (Recommended)
- Free tier: 500MB database, 2GB bandwidth
- Real-time updates
- Built-in authentication
- [Setup Guide](https://supabase.com/docs)

#### **B. Firebase**
- Free tier: 1GB storage, 10GB/month transfer
- Real-time database
- Built-in authentication
- [Setup Guide](https://firebase.google.com/docs)

#### **C. Vercel + Serverless Functions**
- Deploy your own API
- Free tier available
- [Setup Guide](https://vercel.com/docs)

---

## 🔧 API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users?username=admin` - Get user by username
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Production Orders
- `GET /productionOrders` - Get all orders
- `GET /productionOrders/:id` - Get order by ID
- `GET /productionOrders?status=in_progress` - Get orders by status
- `POST /productionOrders` - Create new order
- `PATCH /productionOrders/:id` - Update order
- `DELETE /productionOrders/:id` - Delete order

### Work Orders
- `GET /workOrders` - Get all work orders
- `GET /workOrders?orderId=PO-2024-001` - Get work orders by order ID
- `POST /workOrders` - Create new work order
- `PATCH /workOrders/:id` - Update work order

### Activity Log
- `GET /activityLog` - Get all activity logs
- `GET /activityLog?orderId=PO-2024-001` - Get logs by order ID
- `POST /activityLog` - Create new log entry

---

## 🔐 Default Users

| Username | Password | Role |
|----------|----------|------|
| po_manager | Manager@2024 | PO Manager |
| planner | Planner@2024 | Planner |
| cutting | Cutting@2024 | Cutting Supervisor |
| sewing | Sewing@2024 | Sewing Supervisor |
| ironing | Ironing@2024 | Ironing Supervisor |
| packing | Packing@2024 | Packing Supervisor |
| admin | Admin@2024#Secure | System Admin |

---

## 📝 Notes

- Database changes are saved automatically to `db.json`
- Backup `db.json` regularly
- For production, migrate to a real backend service
- JSON Server is for development only

---

## 🆘 Troubleshooting

### JSON Server won't start
```bash
# Try different port
json-server --watch db.json --port 3002
```

### CORS Issues
```bash
# JSON Server has CORS enabled by default
# If issues persist, check browser console
```

### Database not updating
```bash
# Check if db.json file has write permissions
# Restart JSON Server
```

---

## 📚 Resources

- [JSON Server Documentation](https://github.com/typicode/json-server)
- [GitHub Pages Guide](https://pages.github.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
