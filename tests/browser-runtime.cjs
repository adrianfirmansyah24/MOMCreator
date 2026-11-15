const {existsSync}=require('node:fs');
let engine;
for(const name of [process.env.PLAYWRIGHT_MODULE,'playwright','playwright-core','/usr/local/lib/node_modules/openclaw/node_modules/playwright-core'].filter(Boolean)){
 try{engine=require(name);break;}catch{}
}
if(!engine)throw Error('Pasang playwright-core atau atur PLAYWRIGHT_MODULE untuk menjalankan uji browser.');
const macChrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
exports.chromium=engine.chromium;
exports.chromeOptions={headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:existsSync(macChrome)?{executablePath:macChrome}:{})};
