import {TEAM, WIB} from './demo-data.js';

export const EXAMPLE_TRANSCRIPT = `Keputusan: Poster webinar perlu memuat foto pembicara.
Eka, tolong siapkan poster webinar paling lambat 8 November 2026 pukul 17.00 WIB.
Rani perlu menyusun panduan moderator.
Pendaftaran sempat dibahas dalam rapat.`;

const MONTHS = ['januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember'];
export function explicitDeadline(text) {
  const match = text.match(/\b(\d{1,2})\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+(\d{4})\s+(?:pukul|jam)\s+(\d{1,2})[.:](\d{2})\s+WIB\b/i);
  if (!match) return null;
  const [,day,month,year,hour,minute] = match;
  if (+hour>23 || +minute>59 || +day<1 || +day>31) return null;
  const value = WIB(`${year}-${String(MONTHS.indexOf(month.toLowerCase())+1).padStart(2,'0')}-${day.padStart(2,'0')}T${hour.padStart(2,'0')}:${minute}`);
  const local = new Date(value+7*3600000);
  return Number.isFinite(value) && local.getUTCDate()===+day && local.getUTCHours()===+hour ? value : null;
}

export function extractTodos(text) {
  const decisions = [], tasks = [];
  // Sentence boundaries exclude clock separators such as 17.00.
  const sentences = text.split(/\r?\n|(?<=[.!?])\s+(?=[A-ZÀ-Ž])/u).map(line=>line.trim()).filter(Boolean);
  for (const source of sentences) {
    if (/^keputusan\s*:/i.test(source)) {
      const decision = source.replace(/^keputusan\s*:\s*/i,'').trim();
      if (decision) decisions.push(decision);
      continue;
    }
    const member = TEAM.find(name=>new RegExp(`\\b${name}\\b`,'i').test(source)) || '';
    const named = source.match(/^(Ayu|Eka|Rani)\s*,?\s+(?:tolong\s+|perlu\s+|harus\s+)(.+)/i);
    const tagged = source.match(/^tugas\s*:\s*(.+)/i);
    if (!named && !tagged) continue;
    let title = (named?.[2] || tagged[1]).replace(/^(Ayu|Eka|Rani)\s*[,៖:]?\s*(?:tolong\s+|perlu\s+|harus\s+)?/i,'');
    title = title.replace(/\s+(?:paling lambat|tenggat|sebelum|pada tanggal|tanggal)\b.*$/i,'').replace(/\s+(?:besok|nanti|habis itu)\b.*$/i,'').replace(/[.!?]+$/,'').trim();
    const verbs = {menyusun:'Susun',menyiapkan:'Siapkan',memeriksa:'Periksa',membuat:'Buat',mengirim:'Kirim',memfinalisasi:'Finalisasi'};
    title = title.replace(/^\S+/,word=>verbs[word.toLowerCase()] || word.charAt(0).toUpperCase()+word.slice(1));
    if (title) tasks.push({title,owner:member,due:explicitDeadline(source),sourceQuote:source,description:''});
  }
  return {decisions:[...new Set(decisions)],tasks:tasks.filter((t,i,a)=>a.findIndex(x=>x.sourceQuote===t.sourceQuote)===i)};
}
