import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
function crc32(bytes){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return(crc^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type),size=Buffer.alloc(4),crc=Buffer.alloc(4);size.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([name,data])));return Buffer.concat([size,name,data,crc]);}
// Identical monogram geometry to the popup, supersampled for small toolbar sizes.
const curve=[];
for(let i=0;i<=24;i++){const t=i/24,a=1-t;curve.push([a*a*a*13.5+3*a*a*t*11.5+3*a*t*t*10.5+t*t*t*10.1,a*a*a*4+3*a*a*t*4+3*a*t*t*5.2+t*t*t*7.3]);}
const strokes=[[[16,4],[13.5,4]],...curve.slice(1).map((p,i)=>[curve[i],p]),[[10.1,7.3],[7.5,20]],[[7,10],[16,10]]];
function distance(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
fs.mkdirSync('extension/icons',{recursive:true});
for(const size of [16,32,48,128]){
 const scan=Buffer.alloc((size*4+1)*size),samples=4;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  let r=0,g=0,b=0,alpha=0;
  for(let sy=0;sy<samples;sy++)for(let sx=0;sx<samples;sx++){
   const u=(x+(sx+.5)/samples)/size,v=(y+(sy+.5)/samples)/size;
   const qx=Math.max(.25-u,0,u-.75),qy=Math.max(.25-v,0,v-.75);
   if(Math.hypot(qx,qy)>.22)continue;
   const t=(u+v)/2;
   let color=[146-33*t,122-38*t,238-32*t];
   const px=(u-.17)/.66*24+.5,py=(v-.17)/.66*24;
   if(strokes.some(([a,b])=>distance(px,py,a,b)<=1.4))color=[255,255,255];
   r+=color[0];g+=color[1];b+=color[2];alpha++;
  }
  const off=y*(size*4+1)+1+x*4;
  if(alpha)scan.set([Math.round(r/alpha),Math.round(g/alpha),Math.round(b/alpha),Math.round(alpha/(samples*samples)*255)],off);
 }
 const header=Buffer.alloc(13);header.writeUInt32BE(size,0);header.writeUInt32BE(size,4);header[8]=8;header[9]=6;
 fs.writeFileSync(path.join('extension/icons',`${size}.png`),Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',zlib.deflateSync(scan)),chunk('IEND',Buffer.alloc(0))]));
}
console.log('Lavender flowix icons generated at 16, 32, 48 and 128 px.');
