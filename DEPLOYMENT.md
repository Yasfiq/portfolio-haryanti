# 🚀 Panduan Deployment Gratis - Portofolio Haryanti

> Panduan lengkap untuk deploy project ke production secara **gratis**.

## 📋 Arsitektur Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                      PRODUCTION                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│   │   Vercel    │    │   Vercel    │    │  Railway    │    │
│   │  apps/web   │    │  apps/cms   │    │  apps/api   │    │
│   │  (Frontend) │    │   (Admin)   │    │  (Backend)  │    │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    │
│          │                  │                  │            │
│          └──────────────────┼──────────────────┘            │
│                             │                               │
│                    ┌────────┴────────┐                      │
│                    │    Supabase     │                      │
│                    │  (Auth + DB +   │                      │
│                    │    Storage)     │                      │
│                    └─────────────────┘                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

| Service | Platform | URL |
|---------|----------|-----|
| Portfolio Frontend | Vercel | portfolio.vercel.app |
| CMS Admin | Vercel | portfolio-cms.vercel.app |
| Backend API | Railway | portfolio-api.up.railway.app |
| Database + Auth | Supabase | (sudah ada) |

---

## 🔧 Persiapan Awal

### 1. Pastikan Semua Code Sudah di GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Konfigurasi yang Sudah Ada

✅ Supabase Project (Auth + Database)  
✅ Environment variables lokal  
⬜ Railway account  
⬜ Vercel account  

---

## 1️⃣ Deploy Backend API ke Railway

### Step 1: Buat Akun Railway

1. Pergi ke [railway.app](https://railway.app)
2. Klik **"Start a New Project"**
3. Login dengan **GitHub**

### Step 2: Buat Project Baru

1. Klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository `portofolio-haryanti`
4. Railway akan mendeteksi monorepo

### Step 3: Konfigurasi Service

Karena ini monorepo, kita perlu set root directory:

1. Klik pada service yang baru dibuat
2. Pergi ke **Settings** tab
3. Set konfigurasi:

| Setting | Value |
|---------|-------|
| **Root Directory** | `apps/api` |
| **Build Command** | `npm install -g pnpm && pnpm install && pnpm build` |
| **Start Command** | `node dist/main` |
| **Watch Paths** | `apps/api/**`, `packages/**` |

### Step 4: Set Environment Variables

Di tab **Variables**, tambahkan:

```env
# Database (dari Supabase)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# Supabase
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Storage (ganti AWS S3)
SUPABASE_STORAGE_BUCKET=portfolio-uploads

# Email (opsional, bisa pakai Resend free tier)
RESEND_API_KEY=re_xxxxx

# CORS URLs (update setelah deploy frontend)
WEB_URL=https://your-portfolio.vercel.app
CMS_URL=https://your-cms.vercel.app

# Node environment
NODE_ENV=production
PORT=3000
```

### Step 5: Deploy

1. Klik **"Deploy"**
2. Tunggu build selesai (~2-3 menit)
3. Catat URL yang diberikan Railway: `https://[project-name].up.railway.app`

### Step 6: Verifikasi

Buka browser dan cek:
```
https://[your-app].up.railway.app/api/health
```

Jika berhasil, akan menampilkan response health check.

---

## 2️⃣ Deploy Frontend Portfolio ke Vercel

### Step 1: Buat Akun Vercel

1. Pergi ke [vercel.com](https://vercel.com)
2. Klik **"Sign Up"**
3. Login dengan **GitHub**

### Step 2: Import Project

1. Klik **"Add New..."** → **"Project"**
2. Pilih repository `portofolio-haryanti`
3. Klik **"Import"**

### Step 3: Konfigurasi Build

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `apps/web` |
| **Build Command** | `cd ../.. && pnpm install && pnpm --filter web build` |
| **Output Directory** | `dist` |
| **Install Command** | `cd ../.. && pnpm install` |

### Step 4: Environment Variables

Tambahkan di Vercel dashboard:

```env
VITE_API_URL=https://[your-railway-app].up.railway.app/api
```

### Step 5: Deploy

1. Klik **"Deploy"**
2. Tunggu build selesai (~1-2 menit)
3. Catat URL: `https://[project-name].vercel.app`

---

## 3️⃣ Deploy CMS Admin ke Vercel

### Step 1: Buat Project Baru

1. Di Vercel dashboard, klik **"Add New..."** → **"Project"**
2. Pilih repository yang sama `portofolio-haryanti`
3. Klik **"Import"**

### Step 2: Konfigurasi Build (Berbeda dari web)

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `apps/cms` |
| **Build Command** | `cd ../.. && pnpm install && pnpm --filter cms build` |
| **Output Directory** | `dist` |
| **Install Command** | `cd ../.. && pnpm install` |

### Step 3: Environment Variables

```env
VITE_API_URL=https://[your-railway-app].up.railway.app/api
VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Deploy

Klik **"Deploy"** dan tunggu selesai.

---

## 4️⃣ Update CORS di Railway

Setelah kedua frontend deployed, update environment variables di Railway:

```env
WEB_URL=https://your-portfolio.vercel.app
CMS_URL=https://your-cms.vercel.app
```

Kemudian **Redeploy** service di Railway.

---

## 5️⃣ Setup Supabase Storage (Ganti AWS S3)

Jika ingin menggunakan Supabase Storage (gratis) daripada AWS S3:

### Step 1: Buat Bucket di Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Pergi ke **Storage** → **New Bucket**
4. Nama: `portfolio-uploads`
5. Set **Public bucket**: ✅ (untuk akses gambar publik)

### Step 2: Set Bucket Policies

Di tab **Policies**, tambahkan:

**Untuk SELECT (baca gambar):**
```sql
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-uploads');
```

**Untuk INSERT (upload dari API):**
```sql
CREATE POLICY "Service Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio-uploads');
```

### Step 3: Update Backend Code

Perlu update `apps/api/src/modules/upload` untuk menggunakan Supabase Storage. Beri tahu saya jika butuh bantuan untuk ini.

---

## 6️⃣ Setup Custom Domain (Opsional)

### Untuk Vercel (Frontend):

1. Di project settings, pergi ke **Domains**
2. Tambahkan domain: `portfolio.yourdomain.com`
3. Update DNS di registrar Anda:
   - **Type**: CNAME
   - **Name**: portfolio
   - **Value**: cname.vercel-dns.com

### Untuk Railway (Backend):

1. Di project settings, pergi ke **Settings** → **Domains**
2. Tambahkan domain: `api.yourdomain.com`
3. Update DNS sesuai instruksi Railway

---

## 📊 Monitoring & Logs

### Railway
- Dashboard menampilkan logs real-time
- Metrics: CPU, Memory, Network

### Vercel
- **Functions** tab untuk logs
- **Analytics** untuk traffic (gratis)

### Supabase
- **Database** → **Reports** untuk query analytics
- **Auth** → **Users** untuk user management

---

## 🔄 Auto-Deploy

Kedua platform mendukung auto-deploy:

| Platform | Trigger |
|----------|---------|
| Vercel | Push ke `main` branch |
| Railway | Push ke `main` branch |

Setiap kali Anda push code, deployment akan otomatis berjalan.

---

## 💰 Estimasi Biaya

| Service | Free Tier | Estimasi untuk Portfolio |
|---------|-----------|--------------------------|
| **Vercel** | 100GB bandwidth/bulan | ✅ Cukup |
| **Railway** | $5 credit/bulan | ✅ ~500 jam uptime |
| **Supabase** | 500MB DB, 1GB Storage | ✅ Cukup |

**Total: $0/bulan** untuk traffic normal portfolio.

---

## 🆘 Troubleshooting

### Error: Build failed di Vercel
```
Pastikan Install Command: cd ../.. && pnpm install
```

### Error: Cannot find module di Railway
```
Pastikan Build Command include pnpm install
```

### Error: CORS blocked
```
Update WEB_URL dan CMS_URL di Railway environment variables
```

### Error: Database connection failed
```
Gunakan connection string dengan ?pgbouncer=true untuk pooling
```

---

## ✅ Checklist Deploy

- [ ] Push code ke GitHub
- [ ] Deploy API ke Railway
- [ ] Set environment variables di Railway
- [ ] Deploy Web ke Vercel
- [ ] Deploy CMS ke Vercel
- [ ] Update CORS URLs di Railway
- [ ] Test semua endpoints
- [ ] Setup custom domain (opsional)

---

## 📞 Butuh Bantuan?

Jika mengalami masalah saat deployment, cek:

1. **Logs** di Railway/Vercel dashboard
2. **Environment variables** sudah benar
3. **Build commands** sesuai dengan monorepo structure

Atau hubungi developer untuk assistance.
