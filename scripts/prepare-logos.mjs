import sharp from 'sharp';
// Restored transparent masters retain the original wordmarks and brand colors.
for(const name of ['adamtop','sawa']){
 await sharp(`artwork/logos/${name}-restored.png`).trim().resize({width:800,withoutEnlargement:true}).webp({quality:92,alphaQuality:100,effort:6}).toFile(`src/assets/${name}-logo.webp`);
}
