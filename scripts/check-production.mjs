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
