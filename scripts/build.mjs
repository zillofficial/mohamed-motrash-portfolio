import {build} from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
await build({build:{manifest:true}});
await build({build:{ssr:'src/entry-server.jsx',outDir:'.prerender',emptyOutDir:true}});
const {render}=await import(pathToFileURL(path.resolve('.prerender/entry-server.js')));
let markup=render().replace(/<link\b[^>]*rel="preload"[^>]*>/g,'');
markup=markup.replaceAll('="/assets/','="./assets/').replaceAll(' /assets/',' ./assets/');
let html=await fs.readFile('dist/index.html','utf8');
html=html.replace('<div id="root"></div>',`<div id="root">${markup}</div>`);
// Inline only the first-view stylesheet. Section styles remain lazy CSS chunks.
for(const match of [...html.matchAll(/<link rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g)]){
 const file=match[1].replace(/^\.\//,'');
 let css=await fs.readFile('dist/'+file,'utf8');
 css=css.replace(/url\(\.\/([^)]*)\)/g,'url(./assets/$1)');
 html=html.replace(match[0],`<style data-critical>${css}</style>`);
}
await fs.writeFile('dist/index.html',html);
await fs.rm('.prerender',{recursive:true,force:true});
console.log('Prerendered first view with critical CSS; no runtime server required.');
