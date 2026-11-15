import { migrateMeetings } from './meetings.js';
import { initialState, TEAM } from './demo-data.js';
export const KEY='mom-creator-demo-v1';
export function load(storage){try{const raw=storage.getItem(KEY);const s=raw?JSON.parse(raw):initialState();if(s.version!==1||!Array.isArray(s.tasks))throw Error();return {state:migrateMeetings(s),persistent:true};}catch{return {state:migrateMeetings(initialState()),persistent:false};}}
export function save(s,storage){try{storage.setItem(KEY,JSON.stringify(s));return true;}catch{return false;}}
const active=t=>!!t.sharedAt&&t.status!=='Selesai';
export function priority(t,now){if(!active(t))return 0;const near=t.due-now<=86400000;return t.status==='Terhambat'&&near?1:t.due<now?2:t.status==='Terhambat'||near?3:0;}
export function attention(s){return s.tasks.filter(t=>priority(t,s.now)).sort((a,b)=>priority(a,s.now)-priority(b,s.now)||a.due-b.due||a.sharedAt-b.sharedAt);}
export function validateAssignment(t,now){const e={};if(!t.title.trim())e.title='Isi judul tugas.';if(!TEAM.includes(t.owner))e.owner='Pilih satu penanggung jawab.';if(!Number.isFinite(t.due)||t.due<=now)e.due='Pilih tanggal dan jam setelah waktu demo.';return e;}
export function canView(t,role){return role==='Ayu'||t.owner===role&&!!t.sharedAt;}
function log(s,type,t,extra={}){s.logs.push({type,taskId:t?.id??null,at:s.now,...extra});}
function notify(s,t,type,message){s.notifications.unshift({id:`N-${s.notifications.length+1}`,taskId:t.id,owner:t.owner,type,message,at:s.now,read:false});}
export function reminders(s,previousNow=null){for(const t of s.tasks){if(!active(t)||!t.confirmedAt||(s.now>t.due&&!(previousNow!==null&&previousNow<t.due-86400000&&t.confirmedAt<=t.due)))continue;const marker=String(t.due);if(s.now>=t.due-86400000&&!t.reminders.includes(marker)){t.reminders.push(marker);notify(s,t,'reminder',`Tenggat dekat: ${t.title}`);}}}
export function transition(s,id,action,payload={}){
 const t=s.tasks.find(x=>x.id===id);if(!t||!canView(t,s.role))throw Error('Tugas tidak tersedia untuk peran ini.');
 if(['draft','share'].includes(action)){
 if(s.role!=='Ayu'||t.sharedAt)throw Error('Tugas ini sudah dibagikan atau tidak dapat diubah.');
 const candidate={...t,...payload,title:String(payload.title??t.title).trim(),description:String(payload.description??t.description).trim()};
 if(action==='share'){const errors=validateAssignment(candidate,s.now);if(Object.keys(errors).length)return {errors};}
 Object.assign(t,{title:candidate.title,description:candidate.description,owner:candidate.owner,due:candidate.due});
 if(action==='share'){t.sharedAt=s.now;t.originalDue=t.due;t.status='Menunggu konfirmasi';log(s,'task_shared',t,{originalDue:t.originalDue});notify(s,t,'assignment',`Tugas baru: ${t.title}`);}return {ok:true};
 }
 if(action==='request'){
 if(s.role!=='Ayu'||!active(t))throw Error('Permintaan hanya tersedia untuk tugas aktif.');
 if(t.requests.some(r=>!r.respondedAt))return {duplicate:true};
 t.requests.push({sentAt:s.now,respondedAt:null});log(s,'update_requested',t);notify(s,t,'request',`Ayu meminta update: ${t.title}`);return {ok:true};
 }
 if(t.owner!==s.role||!t.sharedAt)throw Error('Hanya penanggung jawab yang dapat mengubah progres.');
 if(action==='accept'){
 if(!['Menunggu konfirmasi','Perlu penyesuaian'].includes(t.status))return {duplicate:true};
 t.confirmedAt=s.now;t.status='Belum dimulai';log(s,'task_accepted',t);t.history.push({at:s.now,text:'Kesanggupan dikonfirmasi.'});reminders(s);return {ok:true};
 }
 if(action==='adjust'){
 if(!['Menunggu konfirmasi','Perlu penyesuaian'].includes(t.status))throw Error('Tugas sudah diterima.');
 if(!payload.reason?.trim())return {errors:{reason:'Tuliskan alasan penyesuaian.'}};
 t.adjustmentReason=payload.reason.trim();t.adjustmentAt=s.now;t.status='Perlu penyesuaian';t.history.push({at:s.now,text:`Meminta penyesuaian: ${t.adjustmentReason}`});return {ok:true};
 }
 if(!t.confirmedAt||t.status==='Selesai')throw Error('Konfirmasi kesanggupan sebelum memperbarui progres.');
 const next={start:'Dikerjakan',resume:'Dikerjakan',block:'Terhambat',complete:'Selesai'}[action];
 if(!next)throw Error('Tindakan tidak tersedia.');
 if(action==='start'&&t.status!=='Belum dimulai'||action==='resume'&&t.status!=='Terhambat')throw Error('Tindakan tidak sesuai status tugas.');
 if(action==='block'&&!payload.reason?.trim())return {errors:{reason:'Tuliskan hambatan yang dihadapi.'}};
 const before=t.status;t.status=next;t.progressAt=s.now;t.reason=next==='Terhambat'?payload.reason.trim():'';
 log(s,'progress_updated',t,{before,after:next});t.history.push({at:s.now,text:`${before} → ${next}${t.reason?`: ${t.reason}`:''}`});
 const pending=t.requests.find(r=>!r.respondedAt);if(pending){pending.respondedAt=s.now;log(s,'update_responded',t);}
 if(next==='Selesai'){t.completedAt=s.now;log(s,'task_completed',t,{originalDue:t.originalDue});}
 return {ok:true};
}
export function logAttention(s){log(s,'attention_opened',null,{meeting:'Semua rapat',meetingIds:[...new Set(attention(s).map(t=>t.meetingId))],count:attention(s).length});}
