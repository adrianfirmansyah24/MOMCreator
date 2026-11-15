// Local demo identities. This is a prototype entry flow, not server authentication.
export const SESSION_KEY = 'mom-creator-session-v1';
export const DEMO_ACCOUNTS = [
  {name:'Ayu',role:'Koordinator',email:'ayu@mom.test',password:'MomDemo2026!'},
  {name:'Eka',role:'PIC',email:'eka@mom.test',password:'MomDemo2026!'}
];
export function validateLogin(email,password) {
  const errors={};
  const normalized=String(email||'').trim().toLowerCase();
  if(!normalized)errors.email='Isi alamat email akun demo.';
  else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized))errors.email='Gunakan format email yang benar.';
  if(!password)errors.password='Isi kata sandi akun demo.';
  if(Object.keys(errors).length)return {errors};
  const account=DEMO_ACCOUNTS.find(a=>a.email===normalized&&a.password===password);
  if(!account)return {errors:{password:'Email atau kata sandi belum cocok. Pilih akun demo di bawah untuk mencoba.'}};
  return {user:account.name};
}
export function readSession(storage) {
  try{const value=JSON.parse(storage.getItem(SESSION_KEY));return value?.version===1&&DEMO_ACCOUNTS.some(a=>a.name===value.user)?{version:1,user:value.user}:null;}catch{return null;}
}
export function writeSession(storage,user){
  if(!DEMO_ACCOUNTS.some(a=>a.name===user))return false;
  try{storage.setItem(SESSION_KEY,JSON.stringify({version:1,user}));return true;}catch{return false;}
}
export function clearSession(storage){try{storage.removeItem(SESSION_KEY);}catch{}}
