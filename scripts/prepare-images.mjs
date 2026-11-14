import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
await mkdir('src/assets',{recursive:true});
for(const width of [64,160,240,320,360,480,640,960]){
 await sharp('artwork/avatar.png').resize(width).webp({quality:84,alphaQuality:95,effort:6}).toFile(`src/assets/avatar-${width}.webp`);
}
