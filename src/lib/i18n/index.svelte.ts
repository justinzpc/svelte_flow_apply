import zh from './messages/zh';
import en from './messages/en';

export type Locale = 'zh' | 'en';

const messages: Record<Locale, Record<string, string>> = {zh, en};

let locale = $state<Locale>('en');

const CHINESE_TIMEZONES = ['Asia/Shanghai', 'Asia/Chongqing', 'Asia/Harbin', 'Asia/Urumqi'];

const STORAGE_KEY = 'app-locale';

function detectLocale(): Locale {
 if (typeof window === 'undefined') return 'en';
 
 // 优先读取用户缓存的语言选择
 const cached = localStorage.getItem(STORAGE_KEY) as Locale | null;
 if (cached && (cached === 'zh' || cached === 'en')) return cached;
 
 // 通过时区判断
 const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
 if (tz && CHINESE_TIMEZONES.includes(tz)) return 'zh';
 
 // 回退到浏览器语言
 const lang = navigator.language;
 if (lang.startsWith('zh')) return 'zh';
 return 'en';
}

export function initLocale() {
 locale = detectLocale();
}

export function setLocale(l: Locale) {
 locale = l;
 if (typeof window !== 'undefined') {
  localStorage.setItem(STORAGE_KEY, l);
 }
}

export function getLocale(): Locale {
 return locale;
}

export function t(key: string, params?: Record<string, string | number>): string {
 let msg = messages[locale]?.[key] ?? key;
 if (params) {
  for (const [k, v] of Object.entries(params)) {
   msg = msg.replace(`{${k}}`, String(v));
  }
 }
 return msg;
}

export function formatDate(date: string | Date): string {
 const d = typeof date === 'string' ? new Date(date) : date;
 return d.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US');
}

export function formatDateTime(date: string | Date): string {
 const d = typeof date === 'string' ? new Date(date) : date;
 return d.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US');
}

