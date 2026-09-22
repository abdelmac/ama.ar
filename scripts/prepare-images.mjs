import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
await mkdir('public/images', { recursive: true });
const images = [
  ['img28.jpeg','hero',900,1050], ['img40.jpg','pita',750,650],
  ['img31.jpeg','bread-basket',750,650], ['img22.jpeg','maamoul',750,650],
  ['img15.jpeg','hands',750,880], ['img12.jpeg','oven',750,850],
  ['img44.jpg','mezze',1200,800], ['logo.png','logo',150,150],
];
for (const [source,name,width,height] of images) {
  await sharp(`img/${source}`).rotate().resize(width,height,{fit:name==='logo'?'contain':'cover',withoutEnlargement:true,background:{r:0,g:0,b:0,alpha:0}}).webp({quality:85}).toFile(`public/images/${name}.webp`);
}
await sharp('img/logo.png').resize(48,48).png().toFile('public/images/favicon.png');
await sharp('img/logo.png').resize(180,180).png().toFile('public/images/apple-touch-icon.png');
console.log('Prepared local Amareine images.');
