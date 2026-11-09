// Genera la web de familias (index.html) a partir del HTML del planificador.
// Uso: node herramientas/generar.js <planificador.html> <salida.html>
process.env.TZ="Europe/Madrid";
const fs=require('fs');
const [,,src,out]=process.argv;
if(!src||!out){console.error("Uso: node generar.js planificador.html index.html");process.exit(2);}
const full=fs.readFileSync(src,'utf8');
const st=(full.match(/id="state">([\s\S]*?)<\/script>/)||[])[1];
const app=(full.match(/<script id="app-script">([\s\S]*?)<\/script>/)||[])[1];
const css=(full.match(/<style data-app>([\s\S]*?)<\/style>/)||[])[1];
if(!st||!app||!css){console.error("No encuentro el estado, el código o el estilo del planificador");process.exit(1);}
if(!/function buildFamilySite\(/.test(app)){console.error("Este planificador no tiene buildFamilySite");process.exit(1);}
const el={innerHTML:"",setAttribute(){},remove(){},addEventListener(){},textContent:"null",focus(){},classList:{add(){},remove(){},toggle(){}}};
global.location={hash:""};
global.window={scrollY:0,scrollTo(){},claude:null,addEventListener(){}};
global.localStorage={getItem(){return null},setItem(){},removeItem(){}};
global.navigator={};
global.document={getElementById(id){return id==="state"?{textContent:st}:el},addEventListener(){},
  querySelector(q){return q.includes("data-app")?{textContent:css}:null},querySelectorAll(){return[]},createElement(){return el},body:{appendChild(){}}};
const cut=app.lastIndexOf("})();");
(0,eval)(app.slice(0,cut)+"globalThis.__site=buildFamilySite;\n"+app.slice(cut));
const html=globalThis.__site();
if(!html.includes('data-k="alevin-a"')){console.error("La web generada no parece correcta");process.exit(1);}
fs.writeFileSync(out,html);
console.log("OK",out,html.length,"bytes");
