# Deploy Frontend to Cloudflare Pages

## Status
✅ Backend: Live at https://course-analytics.dbsproject.workers.dev  
✅ Database: D1 with 591 rows  
✅ Frontend: Built (dist/ folder ready)  
⏳ Deployment: Ready for Pages upload

## Quick Deploy (2 ways)

### Option 1: Cloudflare Dashboard (Easiest - 3 minutes)

1. **Log in** to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Pages**
3. Click **Create application** → **Upload assets**
4. Drag & drop the `frontend/dist` folder
5. Project name: `course-analytics`
6. Click **Deploy**

Your site will appear at: `https://course-analytics.pages.dev`

---

### Option 2: GitHub Integration (Automatic - Recommended)

1. Push your repo to GitHub: `https://github.com/yourusername/course-analytics-rebuilt`
2. In Cloudflare Dashboard: **Pages** → **Connect to Git**
3. Select repository: `course-analytics-rebuilt`
4. Build command: `npm install && npm run build`
5. Build output directory: `dist`
6. Click **Save and Deploy**

---

## Configure Environment Variable

After deployment, set the API endpoint:

1. Go to **Pages** → **course-analytics** → **Settings** → **Environment variables**
2. Click **Add variable**
3. Variable name: `VITE_API_URL`
4. Value: `https://course-analytics.dbsproject.workers.dev/api`
5. Click **Save**
6. Redeploy (or the next commit will use it)

---

## Verify Deployment

Once deployed:

```bash
# Test health check
curl https://course-analytics.pages.dev

# Should load React dashboard with 12 students, 6 courses, 68 attempts
```

Expected Results:
- Dashboard shows: 12 students, 6 courses, 64 attempts, 96.88% pass rate
- Students page: Lists all 12 students with filters
- Courses page: Shows 6 courses with stats
- Analytics page: Shows 4 analytics tabs with real data
- Query Explorer: Can query the API directly

---

## Troubleshooting

### Pages deployment failed?
- Ensure `dist/` folder exists: `ls frontend/dist/`
- Rebuild: `cd frontend && npm run build`
- Try uploading `dist/` directly in dashboard

### Frontend loads but API calls fail?
- Check VITE_API_URL is set correctly in Pages settings
- Verify backend is still running: [Test API](https://course-analytics.dbsproject.workers.dev/api/students)
- Check browser console for CORS errors

### "Cannot find module 'vite'"?
- Go to `frontend/` directory: `cd frontend`
- Install: `npm install`
- Build again: `npm run build`

---

## After Frontend is Live

You'll have:

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | https://course-analytics.pages.dev | Global CDN |
| Backend API | https://course-analytics.dbsproject.workers.dev/api | Edge Compute |
| Database | D1 (managed SQLite) | Global reads |

All three components served from Cloudflare's edge network with automatic scaling.

---

## Full-Stack Architecture

```
User Browser
    ↓
Cloudflare CDN (Pages)
├── React Frontend (223 KB)
├── CSS (5.7 KB)
├── JavaScript (223 KB)
    ↓
Cloudflare Workers (Hono API)
├── /api/students
├── /api/courses
├── /api/attempts
├── /api/analytics
    ↓
Cloudflare D1 (SQLite)
├── 12 students
├── 6 courses
├── 68 attempts
└── 591 total rows
```

**Result:** Full-stack application serving globally from Cloudflare's edge.

---

## Next Steps

1. Deploy frontend (Dashboard or GitHub)
2. Set VITE_API_URL environment variable
3. Visit https://course-analytics.pages.dev
4. Test all 5 pages work
5. Celebrate! 🎉
