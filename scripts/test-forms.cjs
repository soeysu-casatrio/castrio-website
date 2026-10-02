const fs=require('fs'),vm=require('vm'),assert=require('assert');
(async()=>{
let count=0;
for(const file of ['index.html','contact.html','selected-pieces.html','rfq.html']){
 const text=fs.readFileSync(file,'utf8');
 const start=text.indexOf("document.getElementById('"+(file==='rfq.html'?'rfqForm':'projForm')+"').addEventListener('submit'");
 const end=text.indexOf('\n});',start)+5; const code=text.slice(start,end);
 assert(start>=0&&end>start);
 for(const mode of ['success','false','http-error','network','invalid-json']){
  let callback,leads=0,success=false;
  const btn={disabled:false,textContent:'Submit'};
  const form={action:'mock',style:{},querySelector:s=>s.includes('file')?{files:[]}:btn,addEventListener:(n,f)=>callback=f,dispatchEvent:()=>leads++,reset:()=>{}};
  const context={document:{getElementById:id=>id==='projForm'||id==='rfqForm'?form:{textContent:'',classList:{add:()=>success=true},scrollIntoView:()=>{}}},FormData:function(){},CustomEvent:function(){},alert:()=>{},fetch:()=>mode==='network'?Promise.reject(Error('network')):Promise.resolve({ok:mode!=='http-error',json:()=>mode==='invalid-json'?Promise.reject(Error('json')):Promise.resolve({success:mode==='success'})})};
  vm.runInNewContext(code,context); callback.call(form,{preventDefault:()=>{}}); await new Promise(r=>setImmediate(r));
  assert.equal(leads,mode==='success'?1:0,file+' '+mode);assert.equal(success,mode==='success',file+' '+mode);if(mode!=='success')assert.equal(btn.disabled,false);
  count++;
 }
}
console.log('PASS: '+count+' form success/failure scenarios, using mocked service responses. No external submissions sent.');
})().catch(e=>{console.error(e);process.exit(1)});
