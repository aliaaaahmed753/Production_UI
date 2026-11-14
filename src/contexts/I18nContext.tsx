/**
 * Lightweight i18n context.
 * Supports 'ar' (Arabic RTL) and 'en' (English LTR).
 */
import React, { createContext, useContext, useState, useLayoutEffect } from 'react';

export type Locale = 'ar' | 'en';

// ─── All UI strings ───────────────────────────────────────────────────────────
export const translations = {
  ar: {
    appName: 'نظام متابعة الإنتاج',
    appSubtitle: 'Production Management System',
    language: 'English',
    logout: 'تسجيل الخروج',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    confirm: 'تأكيد',
    back: 'رجوع',
    search: 'بحث...',
    filter: 'تصفية',
    export: 'تصدير',
    loading: 'جارٍ التحميل...',
    noData: 'لا توجد بيانات',
    required: 'هذا الحقل مطلوب',
    success: 'تم بنجاح',
    error: 'حدث خطأ',
    login: 'تسجيل الدخول',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    loginBtn: 'دخول',
    invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة',
    welcomeBack: 'مرحباً بعودتك',
    loginSubtitle: 'سجّل دخولك للمتابعة',
    quickAccess: 'دخول سريع',
    passwordHint: 'كلمة المرور: 1234',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    resetPassword: 'استعادة كلمة المرور',
    resetPasswordSubtitle: 'أدخل اسم المستخدم الخاص بك',
    resetEmailSent: 'تم إرسال رابط الاستعادة!',
    resetEmailMessage: 'تم إرسال رابط استعادة كلمة المرور إلى البريد الإلكتروني المرتبط بحسابك',
    resetEmailNote: 'سنرسل رابط استعادة كلمة المرور إلى بريدك الإلكتروني المسجل',
    userNotFound: 'اسم المستخدم غير موجود',
    send: 'إرسال',
    close: 'إغلاق',
    passwordWeak: 'ضعيفة',
    passwordMedium: 'متوسطة',
    passwordStrong: 'قوية',
    passwordTooShort: 'كلمة المرور قصيرة جداً (8 أحرف على الأقل)',
    passwordNoUppercase: 'يجب أن تحتوي على حرف كبير',
    passwordNoLowercase: 'يجب أن تحتوي على حرف صغير',
    passwordNoNumber: 'يجب أن تحتوي على رقم',
    passwordNoSpecial: 'يجب أن تحتوي على رمز خاص',
    dashboard: 'الرئيسية',
    totalOrders: 'إجمالي الأوردرات',
    inProduction: 'في الإنتاج',
    completed: 'منتهية',
    delayed: 'متأخرة',
    orders: 'الأوردرات',
    poNumber: 'رقم PO',
    customerStyle: 'ستايل العميل',
    factoryStyle: 'ستايل المصنع',
    client: 'العميل',
    category: 'نوع المنتج',
    fabric: 'نوع القماش',
    season: 'الموسم',
    destination: 'بلد الشحن',
    deliveryDate: 'موعد التسليم',
    orderDate: 'تاريخ الأوردر',
    colors: 'الألوان',
    sizes: 'المقاسات',
    quantity: 'الكمية',
    totalQty: 'الإجمالي',
    stages: 'المراحل',
    marker: 'الماركر',
    consumption: 'الاستهلاك',
    planning: 'التخطيط',
    cutting: 'القص',
    quality: 'الجودة / الفرز',
    sewing: 'الخياطة',
    ironing: 'المكوى',
    packing: 'التعبئة',
    shipping: 'الشحن',
    grade1: 'درجة أولى',
    grade2: 'درجة ثانية',
    defective: 'هالك',
    status: 'الحالة',
    pending: 'في الانتظار',
    inProgress: 'جارٍ التنفيذ',
    done: 'منتهي',
    newOrder: 'أوردر جديد',
    allOrders: 'كل الأوردرات',
    reports: 'التقارير',
    settings: 'الإعدادات',
    po_manager: 'مدير الأوردرات',
    planner: 'المخطط',
    cuttingSupervisor: 'مشرف القص',
    sewingSupervisor: 'مشرف الخياطة',
    ironingSupervisor: 'مشرف المكوى',
    packingSupervisor: 'مشرف التعبئة',
    dailyProduction: 'الإنتاج اليومي',
    qualityReport: 'تقرير الجودة',
    delayReport: 'تقرير التأخيرات',
    orderStatus: 'حالة الأوردر',
    exportExcel: 'تصدير Excel',
    exportPdf: 'تصدير PDF',
  },
  en: {
    appName: 'Production Management System',
    appSubtitle: 'نظام متابعة الإنتاج',
    language: 'عربي',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    search: 'Search...',
    filter: 'Filter',
    export: 'Export',
    loading: 'Loading...',
    noData: 'No data available',
    required: 'This field is required',
    success: 'Success',
    error: 'Error',
    login: 'Login',
    username: 'Username',
    password: 'Password',
    loginBtn: 'Sign In',
    invalidCredentials: 'Invalid username or password',
    welcomeBack: 'Welcome Back',
    loginSubtitle: 'Sign in to continue',
    quickAccess: 'Quick Access',
    passwordHint: 'Password: 1234',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    resetPassword: 'Reset Password',
    resetPasswordSubtitle: 'Enter your username',
    resetEmailSent: 'Reset Link Sent!',
    resetEmailMessage: 'A password reset link has been sent to your registered email',
    resetEmailNote: "We'll send a password reset link to your registered email",
    userNotFound: 'Username not found',
    send: 'Send',
    close: 'Close',
    passwordWeak: 'Weak',
    passwordMedium: 'Medium',
    passwordStrong: 'Strong',
    passwordTooShort: 'Password too short (min 8 characters)',
    passwordNoUppercase: 'Must contain uppercase letter',
    passwordNoLowercase: 'Must contain lowercase letter',
    passwordNoNumber: 'Must contain number',
    passwordNoSpecial: 'Must contain special character',
    dashboard: 'Dashboard',
    totalOrders: 'Total Orders',
    inProduction: 'In Production',
    completed: 'Completed',
    delayed: 'Delayed',
    orders: 'Orders',
    poNumber: 'PO Number',
    customerStyle: 'Customer Style',
    factoryStyle: 'Factory Style',
    client: 'Client',
    category: 'Category',
    fabric: 'Fabric Type',
    season: 'Season',
    destination: 'Destination',
    deliveryDate: 'Delivery Date',
    orderDate: 'Order Date',
    colors: 'Colors',
    sizes: 'Sizes',
    quantity: 'Quantity',
    totalQty: 'Total Qty',
    stages: 'Stages',
    marker: 'Marker',
    consumption: 'Consumption',
    planning: 'Planning',
    cutting: 'Cutting',
    quality: 'Quality / Sorting',
    sewing: 'Sewing',
    ironing: 'Ironing',
    packing: 'Packing',
    shipping: 'Shipping',
    grade1: 'Grade 1',
    grade2: 'Grade 2',
    defective: 'Defective',
    status: 'Status',
    pending: 'Pending',
    inProgress: 'In Progress',
    done: 'Done',
    newOrder: 'New Order',
    allOrders: 'All Orders',
    reports: 'Reports',
    settings: 'Settings',
    po_manager: 'PO Manager',
    planner: 'Planner',
    cuttingSupervisor: 'Cutting Supervisor',
    sewingSupervisor: 'Sewing Supervisor',
    ironingSupervisor: 'Ironing Supervisor',
    packingSupervisor: 'Packing Supervisor',
    dailyProduction: 'Daily Production',
    qualityReport: 'Quality Report',
    delayReport: 'Delay Report',
    orderStatus: 'Order Status',
    exportExcel: 'Export Excel',
    exportPdf: 'Export PDF',
  },
} as const;

export type TranslationKey = keyof typeof translations.ar;

// ─── Context ──────────────────────────────────────────────────────────────────
interface I18nContextValue {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  t: (key: TranslationKey) => string;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const LOCALE_KEY = 'pms_locale';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem(LOCALE_KEY);
    return saved === 'en' ? 'en' : 'ar';
  });

  // Layout effect so the page direction is set before the first paint (no left-to-right flash).
  useLayoutEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale);
    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  // t is NOT memoised with useCallback — it reads locale directly from closure
  // so it always returns the right string after re-render.
  const t = (key: TranslationKey): string =>
    (translations[locale] as Record<string, string>)[key] ?? key;

  const toggleLocale = () => setLocale((l) => (l === 'ar' ? 'en' : 'ar'));

  return (
    <I18nContext.Provider
      value={{ locale, dir: locale === 'ar' ? 'rtl' : 'ltr', t, toggleLocale }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>');
  return ctx;
}
