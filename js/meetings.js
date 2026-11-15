import {WIB} from './demo-data.js';
import {extractTodos} from './extract-todos.js';

export const BASE_MEETING = 'R-001';
export function migrateMeetings(s) {
  if (!Array.isArray(s.meetings)) s.meetings = [{id:BASE_MEETING,title:'Persiapan Webinar',createdAt:WIB('2026-11-06T09:00'),savedAt:WIB('2026-11-06T10:00'),source:'prepared',transcript:'',decisions:['Poster webinar memerlukan foto dan biodata pembicara yang sudah dikonfirmasi.','Tim memastikan formulir dan tautan pendaftaran siap sebelum pendaftaran dibuka.','Panduan moderator mengikuti susunan acara yang telah dikonfirmasi.'],drafts:[],convertedText:null}];
  for (const task of s.tasks) task.meetingId ||= BASE_MEETING;
  return s;
}
function assertCoordinator(s) {if(s.role!=='Ayu')throw Error('Hanya koordinator yang dapat mengelola rapat.');}
export function newMeeting(s,title) {
  assertCoordinator(s);
  if(!title.trim())throw Error('Isi judul rapat.');
  const m={id:`R-${String(Math.max(0,...s.meetings.map(m=>+m.id.slice(2)))+1).padStart(3,'0')}`,title:title.trim(),createdAt:s.now,savedAt:null,source:'',transcript:'',decisions:[],drafts:[],convertedText:null};
  s.meetings.unshift(m);return m;
}
export function convertMeeting(s,id,replace=false) {
  assertCoordinator(s);const m=s.meetings.find(m=>m.id===id);
  if(!m||!m.transcript.trim())throw Error('Isi transkrip sebelum membuat draf.');
  if(m.savedAt)throw Error('Notula ini sudah tersimpan.');
  if(m.convertedText===m.transcript)return {unchanged:true};
  if(m.convertedText!==null&&!replace)return {needsConfirmation:true};
  const result=extractTodos(m.transcript);
  m.decisions=result.decisions;m.drafts=result.tasks.map((task,i)=>({...task,draftId:`D-${i+1}`}));
  m.convertedText=m.transcript;return {ok:true};
}
export function saveMinutes(s,id) {
  assertCoordinator(s);const m=s.meetings.find(m=>m.id===id);
  if(!m)throw Error('Rapat tidak ditemukan.');
  if(m.savedAt)return {duplicate:true};
  if(m.convertedText===null)throw Error('Tinjau draf sebelum menyimpan notula.');
  const invalid=m.drafts.findIndex(t=>!t.title.trim());
  if(invalid>=0)return {invalid};
  let seq=Math.max(0,...s.tasks.map(t=>+t.id.slice(2)));
  for(const d of m.drafts) s.tasks.push({id:`T-${String(++seq).padStart(3,'0')}`,meetingId:m.id,title:d.title.trim(),description:d.description||'',sourceQuote:d.sourceQuote||'',owner:d.owner||'',due:d.due||null,originalDue:null,status:'Draf',reason:'',sharedAt:null,confirmedAt:null,progressAt:null,completedAt:null,requests:[],reminders:[],history:[]});
  m.savedAt=s.now;return {ok:true};
}
