export class MeetingRecorder {
  constructor(onChange,onResult=()=>{}) {
    this.onChange=onChange;this.onResult=onResult;this.status='idle';this.message='';this.segments=[];this.elapsed=0;this.level=0;this.generation=0;
  }
  get busy(){return ['requesting','recording','stopping'].includes(this.status);}
  get supported(){return !!(navigator.mediaDevices?.getUserMedia&&window.MediaRecorder);}
  get speechSupported(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition);}
  async start(automatic=false) {
    if(this.busy)return;
    this.status='requesting';this.message='Menunggu izin mikrofon…';this.segments=[];this.elapsed=0;this.level=0;this.speech=null;this.speechEnded=null;this.recordingError='';this.speechMessage='';this.finalized=false;this.cancelled=false;this.unexpectedStop=false;
    const token=++this.generation;this.onChange();
    try {
      if(!this.supported)throw Error('Browser ini tidak mendukung perekaman. Gunakan HTTPS atau localhost, atau tempel transkrip.');
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      if(token!==this.generation){stream.getTracks().forEach(t=>t.stop());return;}
      this.stream=stream;this.chunks=[];
      const type=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t));
      this.recorder=new MediaRecorder(stream,type?{mimeType:type}:{});
      this.recorder.ondataavailable=e=>{if(e.data.size)this.chunks.push(e.data);};
      this.stopped=new Promise(resolve=>this.resolveStopped=resolve);
      this.recorder.onstop=()=>this.finalize();
      this.recorder.onerror=()=>{this.unexpectedStop=true;this.recordingError='Perekaman terganggu. Audio yang sudah diterima tetap disimpan.';this.stop();};
      this.recorder.start(250);this.startedAt=Date.now();this.status='recording';this.message='Sedang merekam';
      try {
        const AudioContext=window.AudioContext||window.webkitAudioContext;
        if(AudioContext){this.audioContext=new AudioContext();this.analyser=this.audioContext.createAnalyser();this.analyser.fftSize=256;this.audioContext.createMediaStreamSource(stream).connect(this.analyser);this.samples=new Uint8Array(this.analyser.fftSize);}
      }catch{this.analyser=null;}
      if(automatic&&this.speechSupported)this.startSpeech();
      this.timer=setInterval(()=>{this.elapsed=Date.now()-this.startedAt;if(this.analyser){this.analyser.getByteTimeDomainData(this.samples);this.level=Math.min(1,Math.sqrt(this.samples.reduce((sum,v)=>sum+(v-128)**2,0)/this.samples.length)/35);}this.onChange(true);},150);
      this.onChange();
    } catch(error) {
      if(token!==this.generation)return;
      this.cleanup();this.status='error';this.message=error.name==='NotAllowedError'?'Izin mikrofon ditolak. Izinkan mikrofon melalui browser atau gunakan transkrip.':error.name==='NotFoundError'?'Mikrofon tidak ditemukan. Sambungkan mikrofon atau gunakan transkrip.':error.message;
      this.onChange();
    }
  }
  startSpeech(){
    try{
      const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
      this.speech=new Recognition();this.speechEnded=new Promise(resolve=>this.resolveSpeechEnd=resolve);const token=this.generation;this.speech.lang='id-ID';this.speech.continuous=true;this.speech.interimResults=false;
      this.speech.onresult=e=>{if(token!==this.generation)return;for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal){const text=e.results[i][0].transcript.trim();if(text)this.segments.push(text);}this.onChange(true);};
      this.speech.onerror=e=>{this.speechMessage=`Transkripsi otomatis terhenti (${e.error}). Rekaman audio tetap berjalan; teks dapat dikoreksi.`;this.onChange(true);};
      this.speech.onend=()=>{this.resolveSpeechEnd?.();if(this.status==='recording'){this.speechMessage='Pengenalan suara berhenti. Teks yang diterima tetap disimpan; audio tetap direkam.';this.onChange(true);}};
      this.speechMessage='Transkripsi otomatis aktif.';this.speech.start();
    }catch{this.speechMessage='Transkripsi otomatis tidak dapat dimulai. Rekaman audio tetap berjalan.';}
  }
  async stop(){
    if(this.status==='requesting'){++this.generation;this.status='idle';this.message='Permintaan rekaman dibatalkan.';this.cleanup();this.onChange();return null;}
    if(this.status==='stopping')return this.stopped;
    if(this.status!=='recording')return null;
    this.status='stopping';this.elapsed=Date.now()-this.startedAt;
    try{this.speech?.stop();}catch{}
    if(this.recorder.state!=='inactive')this.recorder.stop();this.cleanup();this.onChange();return this.stopped;
  }
  async finalize(){
    if(this.finalized)return;this.finalized=true;const unexpected=this.status!=='stopping'||this.unexpectedStop;this.elapsed=Date.now()-this.startedAt;this.status='stopping';try{this.speech?.stop();}catch{}this.cleanup();
    if(this.speechEnded){let timeout;await Promise.race([this.speechEnded,new Promise(resolve=>timeout=setTimeout(resolve,700))]);clearTimeout(timeout);}
    const blob=new Blob(this.chunks,{type:this.recorder.mimeType||this.chunks[0]?.type||'audio/webm'});
    const result={blob,transcript:this.segments.join('\n'),duration:this.elapsed,error:this.recordingError||(unexpected?'Perekaman berhenti. Audio yang sudah diterima disimpan; periksa hasil sebelum melanjutkan.':''),unexpected};
    this.status='idle';if(this.cancelled){this.resolveStopped?.(null);return;}this.onResult(result);this.resolveStopped?.(result);this.onChange();
  }
  cleanup(){clearInterval(this.timer);this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;this.audioContext?.close().catch(()=>{});this.audioContext=null;this.analyser=null;}
  cancel(){this.cancelled=true;++this.generation;try{this.speech?.abort();if(this.recorder?.state==='recording')this.recorder.stop();}catch{}this.cleanup();this.status='idle';}
}
