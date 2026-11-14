# 🚀 دليل رفع المشروع على GitHub Pages

## 📋 الخطوات المطلوبة:

### **1. إنشاء Repository على GitHub**

1. اذهبي إلى [GitHub](https://github.com)
2. اضغطي على `New Repository` أو `+` → `New repository`
3. املئي التفاصيل:
   - **Repository name**: مثلاً `production-management-system`
   - **Description**: "نظام إدارة الإنتاج"
   - **Public** (عشان تشتغل GitHub Pages مجاناً)
   - **لا تضيفي** README أو .gitignore (عندك بالفعل)
4. اضغطي `Create repository`

---

### **2. رفع المشروع على GitHub**

افتحي PowerShell في مجلد المشروع واكتبي:

```powershell
# Initialize Git (لو مش initialized)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Production Management System"

# Add remote (استبدلي YOUR_USERNAME باسمك على GitHub)
git remote add origin https://github.com/YOUR_USERNAME/production-management-system.git

# Push to GitHub
git push -u origin main
```

⚠️ **ملحوظة:** لو طلب منك username & password:
- Username: اسم GitHub بتاعك
- Password: استخدمي **Personal Access Token** (مش الـ password العادي)

#### **كيفية إنشاء Personal Access Token:**
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. اختاري `repo` scope
5. انسخي الـ Token واحتفظي بيه

---

### **3. تفعيل GitHub Pages**

1. اذهبي لـ Repository على GitHub
2. **Settings** → **Pages**
3. في **Source**: اختاري `GitHub Actions`
4. احفظي

---

### **4. Deploy المشروع**

الآن كل ما تعملي Push للـ main branch، GitHub Actions هيعمل Deploy تلقائياً!

```powershell
# Build and deploy
npm run deploy
```

أو:

```powershell
# Regular push (GitHub Actions will handle deployment)
git add .
git commit -m "Update project"
git push
```

---

### **5. الوصول للمشروع**

بعد الـ Deploy، المشروع هيكون متاح على:

```
https://YOUR_USERNAME.github.io/production-management-system/
```

⏱️ **الانتظار:** أول مرة ممكن ياخد 2-5 دقايق

---

## 🔧 تحديث الـ API Configuration

### **للاستخدام المحلي (Development):**
المشروع هيستخدم JSON Server تلقائياً على `localhost:3001`

```powershell
# Start both dev server and JSON server
npm run dev:all
```

---

### **للاستخدام على GitHub Pages (Production):**

#### **الطريقة الأولى: استخدام GitHub كـ Database (محدودة)**

1. افتحي `src/services/api.ts`
2. حدّثي السطر:
   ```typescript
   const GITHUB_API_URL = 'https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/db.json';
   ```
3. استبدلي `YOUR_USERNAME` و `YOUR_REPO` بالقيم الصحيحة

⚠️ **محدودية:**
- 60 request/hour بدون authentication
- للقراءة فقط (لا يمكن الكتابة بدون token)
- مناسب للـ Demo فقط

---

#### **الطريقة الثانية: استخدام Backend منفصل (موصى بها)**

##### **Option A: Firebase (الأسهل)**

1. اذهبي لـ [Firebase Console](https://console.firebase.google.com/)
2. Create Project
3. Add Web App
4. Enable Firestore Database
5. Enable Authentication
6. انسخي الـ Configuration
7. ثبتي Firebase:
   ```powershell
   npm install firebase
   ```
8. أنشئي `src/services/firebase.ts` بالـ config

##### **Option B: Supabase**

1. اذهبي لـ [Supabase](https://supabase.com/)
2. Create Project
3. انسخي API URL & API Key
4. ثبتي Supabase:
   ```powershell
   npm install @supabase/supabase-js
   ```
5. أنشئي `src/services/supabase.ts`

##### **Option C: Vercel Serverless**

1. Deploy API على Vercel
2. أنشئي folder `api/`
3. اضيفي `api/users.ts`, `api/orders.ts`
4. Deploy:
   ```powershell
   vercel
   ```

---

## 📊 هيكل المشروع

```
production-ui/
├── db.json                 # قاعدة البيانات (JSON Server)
├── src/
│   ├── services/
│   │   └── api.ts          # API Service
│   ├── contexts/
│   │   ├── AuthContext.tsx # Authentication
│   │   └── I18nContext.tsx # i18n Support
│   ├── pages/
│   │   └── LoginPage.tsx   # صفحة تسجيل الدخول
│   └── ...
├── .github/
│   └── workflows/
│       └── deploy.yml      # Auto deployment
├── DATABASE_SETUP.md       # دليل قاعدة البيانات
└── package.json
```

---

## 🔐 المستخدمين الافتراضيين

| Username | Password | الدور |
|----------|----------|-------|
| po_manager | Manager@2024 | مدير الأوردرات |
| planner | Planner@2024 | المخطط |
| cutting | Cutting@2024 | مشرف القص |
| sewing | Sewing@2024 | مشرف الخياطة |
| ironing | Ironing@2024 | مشرف المكوى |
| packing | Packing@2024 | مشرف التعبئة |
| admin | Admin@2024#Secure | مدير النظام |

---

## 🆘 حل المشاكل الشائعة

### **المشروع مش ظاهر على GitHub Pages**
1. تأكدي إن Settings → Pages مفعّل
2. انتظري 5 دقايق
3. افحصي Actions tab للتأكد من نجاح الـ Deploy

### **404 Error**
1. تأكدي إن `base` في `vite.config.ts` صحيح:
   ```typescript
   base: '/production-management-system/'
   ```

### **API لا يعمل**
1. في Development: تأكدي إن JSON Server شغال (`npm run json-server`)
2. في Production: استخدمي Firebase أو Supabase

---

## 📚 موارد إضافية

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] GitHub Actions workflow running
- [ ] Database configured (JSON Server / Firebase / Supabase)
- [ ] Production URL accessible
- [ ] Login working
- [ ] Data saving/loading working

---

🎉 **تم! مشروعك الآن على GitHub Pages!**
