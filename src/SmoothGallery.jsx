import React,{forwardRef,useEffect,useImperativeHandle,useRef} from 'react';
import {animate,motion,useMotionValue,useTransform} from 'framer-motion';
import {gestureAxis,releasedPosition,nearestPosition,wrapIndex} from './gallery-gesture';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

export default forwardRef(function SmoothGallery({items,brochures,reduce,blocked=false,onActiveChange,onOpen,renderItem},ref){
 const position=useMotionValue(0),root=useRef(null),engine=useRef(null),settings=useRef({});
 settings.current={onActiveChange,onOpen,blocked};
 useImperativeHandle(ref,()=>({focus:index=>engine.current?.focus(index)}),[]);
 useEffect(()=>{
  const element=root.current,count=items.length;
  const state={drag:null,hover:false,lastInput:performance.now(),last:0,active:-1,suppress:false,spacing:brochures?330:250};
  let raf=0,animation=null,animationToken=0,wheelTimer=0,alive=true;
  const announce=()=>{const index=wrapIndex(Math.round(position.get()),count);if(index!==state.active){state.active=index;settings.current.onActiveChange(index);}};
  const unsubscribe=position.on('change',announce);
  const stop=()=>{animationToken++;animation?.stop();animation=null;};
  const settle=target=>{
   stop();state.lastInput=performance.now();
   if(reduce){position.set(target);return;}
   const token=animationToken;
   animation=animate(position,target,{type:'spring',stiffness:220,damping:32,mass:.8,onComplete:()=>{if(token===animationToken)animation=null;}});
  };
  const focus=index=>settle(nearestPosition(position.get(),index,count));
  const lockScene=()=>{element.dataset.gestureUntil=String(Date.now()+700);};
  const frame=now=>{
   const dt=state.last?Math.min((now-state.last)/1000,.05):1/60;state.last=now;
   if(!document.hidden&&!reduce&&!settings.current.blocked&&!state.drag&&!state.hover&&!animation&&now-state.lastInput>5000){position.set(position.get()+.16*dt);}
   if(!state.drag&&!animation&&Math.abs(position.get())>count*4)position.set(wrapIndex(position.get(),count));
   if(alive)raf=requestAnimationFrame(frame);
  };
  const down=e=>{
   if(settings.current.blocked||!e.isPrimary||e.button!==0||state.drag)return;
   stop();state.suppress=false;state.lastInput=performance.now();
   state.drag={id:e.pointerId,x:e.clientX,y:e.clientY,start:position.get(),axis:null,pointerType:e.pointerType,samples:[{x:e.clientX,t:performance.now()}]};
  };
  const move=e=>{
   const d=state.drag;if(!d||d.id!==e.pointerId)return;
   const dx=e.clientX-d.x,dy=e.clientY-d.y;
   if(!d.axis){
    const axis=gestureAxis(dx,dy,d.pointerType);
    if(!axis)return;
    if(axis==='vertical'){state.drag=null;settle(Math.round(position.get()));return;}
    d.axis=axis;state.suppress=true;element.dataset.dragging='true';
    element.setPointerCapture?.(e.pointerId);
   }
   e.preventDefault();
   // Direct tracking while held; smoothing only starts after release.
   position.set(d.start-dx/state.spacing);
   const now=performance.now();d.samples.push({x:e.clientX,t:now});d.samples=d.samples.filter(sample=>now-sample.t<120).slice(-8);state.lastInput=now;
  };
  const finish=(e,cancel=false)=>{
   const d=state.drag;if(!d||d.id!==e.pointerId)return;
   state.drag=null;element.dataset.dragging='false';state.lastInput=performance.now();
   if(d.axis==='horizontal'){
    state.suppress=true;lockScene();
    const target=cancel?Math.round(position.get()):releasedPosition(position.get(),d.samples,performance.now(),state.spacing,reduce);
    settle(target);
   }
   if(element.hasPointerCapture?.(e.pointerId))element.releasePointerCapture(e.pointerId);
  };
  const up=e=>finish(e),cancel=e=>finish(e,true);
  const enter=e=>{if(e.pointerType==='mouse'){state.hover=true;if(!state.drag)settle(Math.round(position.get()));}};
  const leave=e=>{if(e.pointerType==='mouse'){state.hover=false;state.lastInput=performance.now();}};
  const captureClick=e=>{if(state.suppress){e.preventDefault();e.stopPropagation();}};
  const dragStart=e=>e.preventDefault();
  const wheel=e=>{
   if(settings.current.blocked||e.ctrlKey||Math.abs(e.deltaX)<=Math.abs(e.deltaY)||!e.deltaX)return;
   e.preventDefault();e.stopPropagation();stop();state.lastInput=performance.now();lockScene();
   position.set(position.get()+e.deltaX*(e.deltaMode===1?16:1)/state.spacing);
   clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>settle(Math.round(position.get())),140);
  };
  const key=e=>{
   if(settings.current.blocked||e.altKey||e.metaKey||e.ctrlKey)return;
   if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();settle(Math.round(position.get())+(e.key==='ArrowLeft'?1:-1));}
  };
  const select=(i,item)=>{
   if(state.suppress||settings.current.blocked)return;
   const distance=nearestPosition(position.get(),i,count)-position.get();
   if(Math.abs(distance)<.2){settle(Math.round(position.get()));settings.current.onOpen(item);}
   else focus(i);
  };
  const measure=()=>{const card=element.querySelector('.work-card');const width=card?.offsetWidth;if(width&&!brochures)state.spacing=width*.94;element.style.setProperty('--gallery-step',`${state.spacing}px`);};
  // Keep spacing reactive across device rotation without rebuilding the input handlers.
  const spacingObserver=new ResizeObserver(measure);spacingObserver.observe(element);measure();
  engine.current={focus,select};announce();
  element.addEventListener('pointerdown',down);
  window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cancel);
  element.addEventListener('lostpointercapture',cancel);element.addEventListener('pointerenter',enter);element.addEventListener('pointerleave',leave);element.addEventListener('click',captureClick,true);element.addEventListener('dragstart',dragStart);element.addEventListener('wheel',wheel,{passive:false});window.addEventListener('keydown',key);
  raf=requestAnimationFrame(frame);
  return()=>{alive=false;cancelAnimationFrame(raf);clearTimeout(wheelTimer);stop();unsubscribe();spacingObserver.disconnect();engine.current=null;element.removeEventListener('pointerdown',down);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancel);element.removeEventListener('lostpointercapture',cancel);element.removeEventListener('pointerenter',enter);element.removeEventListener('pointerleave',leave);element.removeEventListener('click',captureClick,true);element.removeEventListener('dragstart',dragStart);element.removeEventListener('wheel',wheel);window.removeEventListener('keydown',key);};
 },[items,brochures,reduce,position]);
 return <motion.div ref={root} className={'carousel smooth-gallery '+(brochures?'brochures':'')} role="region" aria-roledescription="carousel" aria-label="معرض الأعمال" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduce?.1:.3}}>{items.map((item,i)=><GalleryCard key={item.title} item={item} i={i} count={items.length} position={position} brochures={brochures} onClick={()=>engine.current?.select(i,item)} onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))engine.current?.focus(i)}}>{renderItem(item)}</GalleryCard>)}</motion.div>;
});
function GalleryCard({item,i,count,position,brochures,onClick,onFocus,children}){
 const d=useTransform(position,p=>wrapIndex(i-p+count/2,count)-count/2);
 // CSS calculates pixel spacing so ResizeObserver can update it without stale closures.
 const transform=useTransform(d,v=>`translateX(calc(${v} * var(--gallery-step,250px))) scale(${1-Math.min(Math.abs(v),1)*.14}) perspective(1200px) rotateY(${-clamp(v,-1,1)*14}deg) rotateZ(${brochures?-5+clamp(v,-1,1)*6:0}deg)`);
 const opacity=useTransform(d,v=>{const a=Math.abs(v);return (1-Math.min(a,1)*.52)*(brochures?clamp((1.48-a)/.28,0,1):clamp((2.65-a)/.5,0,1));});
 const filter=useTransform(d,v=>`blur(${brochures?Math.min(Math.abs(v),1)*5:0}px)`);
 const zIndex=useTransform(d,v=>Math.round(100-Math.abs(v)*20));
 const pointerEvents=useTransform(opacity,v=>v>.1?'auto':'none');
 return <motion.button type="button" className={'work-card '+(brochures?'book':'poster')} style={{'--card-color':item.color,transform,opacity,filter,zIndex,pointerEvents}} onClick={onClick} onFocus={onFocus} aria-label={item.title}>{children}</motion.button>;
}
