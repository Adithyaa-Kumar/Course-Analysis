# 🚀 CLOUDFLARE DEPLOYMENT - 30-MINUTE QUICK START

## Prerequisites
```bash
npm install -g wrangler              # Cloudflare CLI
npm install -g node@18               # Node.js 18+
git clone YOUR_REPO                  # Or extract project
```

---

## STEP 1: Authenticate (2 min)
```bash
wrangler login
# Click "Allow" in browser that opens
```

---

## STEP 2: Create D1 Database (2 min)
```bash
cd c:\course-dbs\course-analytics-rebuilt

wrangler d1 create course-analytics

# Copy the database_id from output
```

**Update `wrangler.toml` line with database_id:**
```toml
[[d1_databases]]
binding = "DB"
database_name = "course-analytics"
database_id = "PASTE_ID_HERE"    # <- Replace this
```

---

## STEP 3: Load Database (3 min)
```bash
wrangler d1 execute course-analytics --file migrations/schema.sql
wrangler d1 execute course-analytics --file migrations/seed.sql

# Verify:
wrangler d1 execute course-analytics --command "SELECT COUNT(*) FROM students;"
# Should return: 12
```

---

## STEP 4: Deploy Backend (3 min)
```bash
cd backend
npm install
npm run deploy

# Copy the URL shown: https://course-analytics.SUBDOMAIN.workers.dev
```

**Test it:**
```bash
curl https://course-analytics.SUBDOMAIN.workers.dev/health
# Should return: {"status":"healthy"...}
```

---

## STEP 5: Deploy Frontend (5 min)

### Option A: Wrangler CLI
```bash
cd ../frontend
npm install
npm run build
wrangler pages deploy dist --project-name course-analytics
```

**Get URL from output:** `https://course-analytics.pages.dev`

### Option B: GitHub + Cloudflare (Better)
1. Push project to GitHub
2. Cloudflare Dashboard → Pages → "Create a project"
3. Select GitHub repo
4. Build command: `cd frontend && npm install && npm run build`
5. Output dir: `frontend/dist`
6. Env vars: `VITE_API_URL = YOUR_WORKERS_URL/api`
7. Deploy

---

## STEP 6: Configure Frontend (2 min)

In Cloudflare Pages Dashboard:

1. Select "course-analytics" project
2. Settings → Environment variables
3. Add: `VITE_API_URL` = `https://course-analytics.SUBDOMAIN.workers.dev/api`
4. Redeploy if needed

---

## STEP 7: Test (5 min)

### Test Backend
```bash
curl https://course-analytics.SUBDOMAIN.workers.dev/api/students
# Should return list of 12 students

curl https://course-analytics.SUBDOMAIN.workers.dev/api/analytics/dashboard
# Should return dashboard metrics
```

### Test Frontend
Visit: `https://course-analytics.pages.dev`

Should see:
- ✅ Dashboard loads
- ✅ Shows: 12 students, 6 courses, 68 attempts
- ✅ All 5 pages work
- ✅ No console errors

---

## Your Live URLs
```
Frontend: https://course-analytics.pages.dev
API:      https://course-analytics.SUBDOMAIN.workers.dev/api
```

---

## If Something Fails

**Backend won't deploy:**
```bash
wrangler publish src/index.js --name course-analytics
# Check wrangler.toml syntax
```

**Database queries fail:**
```bash
# Verify tables exist
wrangler d1 execute course-analytics --command "SELECT name FROM sqlite_master WHERE type='table';"
# Should list: students, courses, attempts, etc.
```

**Frontend can't reach API:**
- Check `VITE_API_URL` in Cloudflare Pages environment vars
- No trailing slash
- Redeploy Pages after changing

**Still stuck?**
Read: [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md) for detailed guide

---

## 🎉 Done!

Your full-stack system is live on Cloudflare!
