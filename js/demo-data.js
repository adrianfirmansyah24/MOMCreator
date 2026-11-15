export const WIB = value => new Date(`${value}:00+07:00`).getTime();
export const TEAM = ['Ayu', 'Eka', 'Rani'];
export const INITIAL_TIME = WIB('2026-11-07T10:00');
export function initialState() {
 const shared = WIB('2026-11-06T09:00');
 const make = (id,title,owner,due,status,reason='',progress=true) => ({id,title,description:'',owner,due:due?WIB(due):null,originalDue:due?WIB(due):null,status,reason,sharedAt:owner?shared:null,confirmedAt:owner?shared+3600000:null,progressAt:owner&&progress?shared+7200000:null,completedAt:null,requests:[],reminders:[],history:[]});
 return {version:1,role:'Ayu',now:INITIAL_TIME,logs:[],notifications:[],tasks:[
 make('T-001','Siapkan poster webinar','','','Draf'),
 make('T-002','Finalisasi materi pembicara','Eka','2026-11-07T16:00','Terhambat','Biodata pembicara belum lengkap.'),
 make('T-003','Susun panduan moderator','Rani','2026-11-10T12:00','Terhambat','Susunan acara belum dikonfirmasi.'),
 make('T-004','Periksa tautan pendaftaran','Eka','2026-11-07T09:00','Dikerjakan'),
 make('T-005','Siapkan formulir pendaftaran','Eka','2026-11-08T09:00','Belum dimulai','',false)
 ]};
}
