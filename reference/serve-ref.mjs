import http from 'node:http'; import fs from 'node:fs';
const order=['core','world','match','season','train','market','events','sprites','netcore'];
const rd=f=>fs.readFileSync(new URL(f,import.meta.url),'utf8');
function page(){
  let h=rd('body.html').replace('<link rel="manifest" href="manifest.webmanifest">','');
  h=h.replace('</head>','<link rel="stylesheet" href="/style.css"></head>');
  const js=`<script type="application/json" id="data">${rd('players-data.json')}</script>\n`+order.map(n=>`<script src="/${n}.js"></script>`).join('\n');
  return h.replace('<div id="modal-root"></div>','<div id="modal-root"></div>\n'+js);
}
http.createServer((q,s)=>{
  const u=q.url.split('?')[0];
  if(u==='/'){s.setHeader('content-type','text/html;charset=utf-8');return s.end(page());}
  if(u==='/style.css'||/^\/[a-z]+\.js$/.test(u)){ try{ s.setHeader('content-type',u.endsWith('css')?'text/css':'text/javascript'); return s.end(rd('.'+u)); }catch{} }
  s.statusCode=404;s.end('');
}).listen(5180,()=>console.log('http://localhost:5180'));
