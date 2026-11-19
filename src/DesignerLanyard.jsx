import React, {lazy,Suspense,useCallback,useEffect,useState} from 'react';
import LanyardPreview from './LanyardPreview';
const Lanyard=lazy(()=>import('./Lanyard'));
let cachedFaces=null;
import {content as c} from './content';

export default function DesignerLanyard(){
 const [faces,setFaces]=useState(cachedFaces);const [status,setStatus]=useState('loading');
 const ready=useCallback(()=>setStatus('ready'),[]);const failed=useCallback(()=>setStatus('error'),[]);
 useEffect(()=>{if(cachedFaces)return;let active=true;const img=new Image();
 img.onload=async()=>{await Promise.all([document.fonts.load(`800 56px Cairo`,c.name),document.fonts.load(`30px "IBM Plex Sans Arabic"`,c.role)]).catch(()=>{});if(!active)return;
 const make=back=>{const canvas=document.createElement('canvas');canvas.width=800;canvas.height=1125;const ctx=canvas.getContext('2d');
 const bg=ctx.createLinearGradient(0,0,800,1125);bg.addColorStop(0,'#ba7a50');bg.addColorStop(1,'#161616');ctx.fillStyle=bg;ctx.fillRect(0,0,800,1125);
 ctx.strokeStyle='#e99e6b';ctx.lineWidth=3;ctx.strokeRect(35,35,730,1055);
 ctx.fillStyle='#fcba8d';ctx.fillRect(350,130,100,5);
 ctx.textAlign='center';ctx.direction='rtl';
 if(!back){
 const scale=Math.min(690/img.width,900/img.height);const w=img.width*scale,h=img.height*scale;
 ctx.save();ctx.beginPath();ctx.roundRect(48,155,704,920,18);ctx.clip();
 ctx.drawImage(img,(800-w)/2,1075-h,w,h);ctx.restore();
 ctx.strokeStyle='#e99e6b';ctx.lineWidth=3;ctx.strokeRect(35,35,730,1055);
}
 else{ctx.fillStyle='#fcad78';ctx.font='900 280px Cairo';ctx.fillText(c.name[0],400,630);ctx.fillStyle='#ffffff';ctx.font='800 56px Cairo';ctx.fillText(c.name,400,820);ctx.fillStyle='#e5c9b6';ctx.font='30px "IBM Plex Sans Arabic"';ctx.fillText(c.role,400,885);}
 return canvas;};cachedFaces={front:make(false),back:make(true)};setFaces(cachedFaces);
 };img.onerror=()=>{if(active)setStatus('error');};img.src=c.lanyardPhoto;return()=>{active=false;};},[]);
 return <div className="lanyard-panel" role="group" aria-label={`${c.name} — بطاقة تعريف تفاعلية قابلة للسحب والتقليب`}>
 {status!=='ready'&&<LanyardPreview/>}
 {faces&&status!=='error'&&<div className="lanyard-live" data-ready={status==='ready'}><Suspense fallback={null}><Lanyard onReady={ready} onError={failed} frontImage={faces.front} backImage={faces.back} cardColor="#212121" strapColor="#c0794a" metal="silver" finish="matte" size={.68} strapLength={.18} damping={.95} elasticity={.2} breeze={0} intro={false} /></Suspense></div>}
 </div>;
}
