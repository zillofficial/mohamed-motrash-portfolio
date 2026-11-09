import React,{forwardRef,useEffect,useImperativeHandle,useRef} from 'react';
import {motion,useMotionValue,useTransform} from 'framer-motion';
const wrap=(n,length)=>((n%length)+length)%length;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

// CircularGallery input model: frame-rate independent .05 follow, sampled inertia,
// nearest-item settling, and continuous drift. Existing DOM artwork stays intact.
export default forwardRef(function SmoothGallery({items,brochures,reduce,onActiveChange,onOpen,renderItem},ref){
 const position=useMotionValue(0),root=useRef(null),engine=useRef(null),callbacks=useRef({onActiveChange,onOpen});
 callbacks.current={onActiveChange,onOpen};
 useImperativeHandle(ref,()=>({focus:index=>engine.current?.focus(index)}),[]);
 useEffect(()=>{
  const element=root.current,count=items.length,spacing=brochures?330:250;
  const state={target:0,current:0,drag:null,hover:false,lastInput:performance.now(),last:0,active:-1,suppress:false};
  let raf=0;
  const announce=()=>{const index=wrap(Math.round(state.current),count);if(index!==state.active){state.active=index;callbacks.current.onActiveChange(index);}};
  const focus=index=>{const base=state.target;state.target=base+(wrap(index-base+count/2,count)-count/2);state.lastInput=performance.now();};
  engine.current={focus};
  const frame=now=>{
   const dt=state.last?Math.min((now-state.last)/1000,.05):1/60;state.last=now;
   if(!document.hidden){
    const auto=!reduce&&!state.drag&&!state.hover&&!document.querySelector('[role="dialog"]')&&now-state.lastInput>1800;
    if(auto)state.target+=.20*dt;
    const follow=reduce?1:1-Math.pow(1-.05,dt*60);
    state.current+=(state.target-state.current)*follow;
    if(Math.abs(state.target-state.current)<.0002)state.current=state.target;
    // Rebase invisibly so looping never builds up large transform values.
    if(state.current>count*2||state.current<-count){const shift=Math.floor(state.current/count)*count;state.current-=shift;state.target-=shift;if(state.drag)state.drag.start-=shift;}
    position.set(state.current);announce();
   }
   raf=requestAnimationFrame(frame);
  };
  const down=e=>{
   if(!e.isPrimary||e.button!==0)return;
   state.suppress=false;state.lastInput=performance.now();
   state.target=state.current;
   state.drag={id:e.pointerId,x:e.clientX,y:e.clientY,start:state.target,moved:false,samples:[{x:e.clientX,t:performance.now()}]};
  };
  const move=e=>{
   const d=state.drag;if(!d||d.id!==e.pointerId)return;
   const dx=e.clientX-d.x,dy=e.clientY-d.y;
   if(!d.moved){
    if(Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)&&e.pointerType!=='mouse'){state.drag=null;return;}
    if(Math.abs(dx)<6)return;
    d.moved=true;state.suppress=true;element.setPointerCapture(e.pointerId);element.dataset.dragging='true';
   }
   e.preventDefault();state.target=d.start-dx/spacing;
   const now=performance.now();d.samples.push({x:e.clientX,t:now});d.samples=d.samples.filter(s=>now-s.t<100).slice(-6);state.lastInput=now;
  };
  const finish=(e,cancel=false)=>{
   const d=state.drag;if(!d||d.id!==e.pointerId)return;
   state.drag=null;element.dataset.dragging='false';
   if(element.hasPointerCapture(e.pointerId))element.releasePointerCapture(e.pointerId);
   state.lastInput=performance.now();
   if(d.moved){
    element.dataset.gestureUntil=String(Date.now()+650);
    if(!cancel&&d.samples.length>1){const a=d.samples[0],b=d.samples.at(-1);const speed=(b.x-a.x)/Math.max(b.t-a.t,16)*1000;state.target-=clamp(speed*.18/spacing,-1.5,1.5);}
    state.target=Math.round(state.target);
   }
  };
  const up=e=>finish(e),cancel=e=>finish(e,true);
  const enter=()=>{state.hover=true;},leave=()=>{state.hover=false;state.lastInput=performance.now();};
  const click=e=>{if(state.suppress){e.preventDefault();e.stopPropagation();state.suppress=false;}};
  const wheel=e=>{
   // Horizontal trackpad movement belongs to the gallery; vertical scroll keeps scene navigation.
   if(e.ctrlKey||Math.abs(e.deltaX)<=Math.abs(e.deltaY)||!e.deltaX)return;
   e.preventDefault();e.stopPropagation();state.lastInput=performance.now();
   state.target+=e.deltaX*(e.deltaMode===1?16:1)/spacing;
   clearTimeout(wheel.timer);wheel.timer=setTimeout(()=>{state.target=Math.round(state.target);},140);
  };
  const key=e=>{
   if(document.querySelector('[role="dialog"]'))return;
   if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();state.lastInput=performance.now();state.target=Math.round(state.target)+(e.key==='ArrowLeft'?1:-1);}
  };
  const select=(i,item)=>{
   if(state.suppress)return;
   const distance=wrap(i-state.current+count/2,count)-count/2;
   state.lastInput=performance.now();
   if(Math.abs(distance)<.18){state.target=Math.round(state.current);callbacks.current.onOpen(item);}
   else focus(i);
  };
  engine.current.select=select;
  element.addEventListener('pointerdown',down);element.addEventListener('pointermove',move);element.addEventListener('pointerup',up);element.addEventListener('pointercancel',cancel);element.addEventListener('lostpointercapture',cancel);element.addEventListener('pointerenter',enter);element.addEventListener('pointerleave',leave);element.addEventListener('click',click,true);element.addEventListener('wheel',wheel,{passive:false});window.addEventListener('keydown',key);
  raf=requestAnimationFrame(frame);
  return()=>{cancelAnimationFrame(raf);clearTimeout(wheel.timer);engine.current=null;element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',move);element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',cancel);element.removeEventListener('lostpointercapture',cancel);element.removeEventListener('pointerenter',enter);element.removeEventListener('pointerleave',leave);element.removeEventListener('click',click,true);element.removeEventListener('wheel',wheel);window.removeEventListener('keydown',key);};
 },[items,brochures,reduce,position]);
 return <motion.div ref={root} className={'carousel smooth-gallery '+(brochures?'brochures':'')} role="region" aria-label="معرض الأعمال" initial={{opacity:0,x:reduce?0:80,filter:reduce?'none':'blur(10px)'}} animate={{opacity:1,x:0,filter:'blur(0px)'}} exit={{opacity:0,filter:reduce?'none':'blur(10px)'}} transition={{duration:reduce?.1:.6,ease:[.22,1,.36,1]}}>{items.map((item,i)=><GalleryCard key={item.title} item={item} i={i} count={items.length} position={position} brochures={brochures} onClick={()=>engine.current?.select(i,item)} onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))engine.current?.focus(i)}}>{renderItem(item)}</GalleryCard>)}</motion.div>;
});
function GalleryCard({item,i,count,position,brochures,onClick,onFocus,children}){
 const d=useTransform(position,p=>wrap(i-p+count/2,count)-count/2);
 const x=useTransform(d,v=>v*(brochures?330:250));
 const scale=useTransform(d,v=>1-Math.min(Math.abs(v),1)*.14);
 const opacity=useTransform(d,v=>{const a=Math.abs(v);const base=1-Math.min(a,1)*.52;const fade=brochures?clamp((1.48-a)/.28,0,1):clamp((2.65-a)/.5,0,1);return base*fade;});
 const rotateY=useTransform(d,v=>-clamp(v,-1,1)*14);
 const rotateZ=useTransform(d,v=>brochures?-5+clamp(v,-1,1)*6:0);
 const filter=useTransform(d,v=>`blur(${brochures?Math.min(Math.abs(v),1)*5:0}px)`);
 const zIndex=useTransform(d,v=>Math.round(100-Math.abs(v)*20));
 const pointerEvents=useTransform(opacity,v=>v>.1?'auto':'none');
 return <motion.button className={'work-card '+(brochures?'book':'poster')} style={{'--card-color':item.color,x,scale,opacity,rotateY,rotateZ,filter,zIndex,pointerEvents}} onClick={onClick} onFocus={onFocus} aria-label={item.title}>{children}</motion.button>;
}
