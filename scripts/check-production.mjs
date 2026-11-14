import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const html=await fs.readFile('dist/index.html','utf8');
const preload=html.match(/<link rel="preload"[^>]+>/)?.[0];
assert.ok(preload?.includes('imagesrcset=')&&preload.includes('imagesizes='));
assert.ok(!html.includes('fonts.googleapis.com'));
const imageSource=await fs.readFile('src/hero-image.js','utf8');
const sizes=imageSource.match(/export const avatarSizes='([^']+)'/)[1];
assert.ok(preload.includes('imagesizes="'+sizes+'"'));
// Vite rewrites the entire responsive preload to fingerprinted production paths.
for(const [,url] of preload.matchAll(/\.\/assets\/([^\s",]+\.webp)/g))await fs.access('dist/assets/'+url);
const files=await fs.readdir('dist/assets');
for(const file of files.filter(f=>f.endsWith('.js')))assert.ok(!(await fs.readFile('dist/assets/'+file,'utf8')).includes('avatar.png'));
assert.ok(!(await fs.readdir('dist')).includes('avatar.png'));
console.log('Production: responsive image preload paths, deferred raw avatar, and local fonts passed.');

assert.ok(html.includes('<h1>')&&html.includes('محمد مطراش'));
assert.ok(!html.includes('src="/assets/'));
assert.ok(!/<link rel="stylesheet"/.test(html));
assert.equal((html.match(/rel="preload" as="image"/g)||[]).length,1);
const rootMarkup=html.split('<div id="root">')[1];
assert.ok(rootMarkup.includes('fetchPriority="high"')||rootMarkup.includes('fetchpriority="high"'));
assert.ok(!rootMarkup.includes('opacity:0'));
console.log('Production: prerendered visible first view, one responsive preload, inline critical CSS, relative Pages URLs passed.');

assert.equal((html.match(/data:font\/woff2;base64,/g)||[]).length,3);
console.log('Production: three first-view font subsets available in critical HTML.');
