import { initialAccount } from './data.js';

const SESSION = 'growmate.session.v1';
const PREFIX = 'growmate.account.v1.';
export const MAX_MEDIA_BYTES = 850 * 1024;

function safelyParse(value) { try { return JSON.parse(value); } catch { return null; } }
function keyFor(email) { return PREFIX + encodeURIComponent(email.trim().toLowerCase()); }

export function getSession() {
  try {
    const session = safelyParse(localStorage.getItem(SESSION));
    return session && typeof session.email === 'string' && session.email.includes('@') ? session : null;
  } catch { return null; }
}
export function loadAccount(session) {
  try {
    const value = safelyParse(localStorage.getItem(keyFor(session.email)));
    if (value && Array.isArray(value.posts) && Array.isArray(value.modules) && value.me?.email === session.email) return value;
  } catch { /* Storage may be blocked by browser settings. */ }
  return initialAccount(session);
}
export function saveAccount(data) {
  try { localStorage.setItem(keyFor(data.me.email), JSON.stringify(data)); return true; }
  catch { return false; }
}
export function startSession(email,name) {
  const session = {email:email.trim().toLowerCase(),name:name.trim()};
  try { localStorage.setItem(SESSION,JSON.stringify(session)); } catch { /* In-memory mode still works. */ }
  return session;
}
export function endSession() { try {localStorage.removeItem(SESSION);} catch {} }
export function createId(prefix) {
  const random = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return prefix+'-'+random;
}
export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
