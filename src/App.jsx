import {avatarSrc,avatarSrcSet,avatarSizes,brandAvatar} from './hero-image';
import {lazy,Suspense} from 'react';
const Works=lazy(()=>import('./Sections').then(m=>({default:m.Works})));
const About=lazy(()=>import('./Sections').then(m=>({default:m.About})));
const Clients=lazy(()=>import('./Sections').then(m=>({default:m.Clients})));
const Stats=lazy(()=>import('./Sections').then(m=>({default:m.Stats})));
const Lightbox=lazy(()=>import('./Sections').then(m=>({default:m.Lightbox})));
import React,{useState,useEffect,useLayoutEffect,useRef} from 'react';import{m,LazyMotion,AnimatePresence,MotionConfig,useReducedMotion,usePresence}from'framer-motion';import{ArrowLeft,Menu,X,ArrowUpLeft}from'lucide-react';import{content as c}from'./content';
// Keep layout/gesture features off the initial network path. Every input mode
// activates the same full feature set before subsequent scene animations.
const loadMotionFeatures=()=>new Promise(resolve=>{
 const events=['pointerdown','pointermove','keydown','wheel','touchstart'];
 const activate=()=>{events.forEach(e=>window.removeEventListener(e,activate,true));import('./motion-features').then(m=>resolve(m.default));};
 events.forEach(e=>window.addEventListener(e,activate,{once:true,capture:true,passive:true}));
});
const ease=[.22,1,.36,1];
function App(){const[scene,setScene]=useState(0),[menu,setMenu]=useState(false),[light,setLight]=useState(null);const reduce=useReducedMotion();const sceneRef=useRef(null);const menuButton=useRef(null);const hadMenu=useRef(false);const shouldFocus=useRef(false);const navigation=useRef(0);const go=async i=>{
 const next=(i+5)%5,token=++navigation.current;
 setMenu(false);
 if(next===scene){shouldFocus.current=false;return;}
 shouldFocus.current=true;
 // Prepare the destination's code and CSS while the current scene is still
 // visible, so its entrance animation doesn't finish over a loading fallback.
 if(next!==0)await import('./Sections');
 if(token===navigation.current)setScene(next);
};

useEffect(()=>{if(menu){hadMenu.current=true;document.querySelector('#compact-menu button')?.focus()}else if(hadMenu.current){hadMenu.current=false;if(!shouldFocus.current)menuButton.current?.focus()}},[menu]);
useEffect(()=>{const f=e=>{if(e.key==='Escape'){setMenu(false);setLight(null)}if(e.target.closest('button,[role=dialog]'))return;if(scene!==1&&!light){if(e.key==='ArrowLeft')go(scene+1);if(e.key==='ArrowRight')go(scene-1)}};window.addEventListener('keydown',f);return()=>window.removeEventListener('keydown',f)},[scene,light]);
// Treat vertical scrolling as discrete scene navigation, with a gesture cooldown.
const scrollGesture=useRef({sum:0,last:0,lockedUntil:0,touch:null});
useEffect(()=>{
 const g=scrollGesture.current;
 const advance=direction=>{
  const now=performance.now();
  if(light||now<g.lockedUntil)return;
  const next=Math.max(0,Math.min(c.nav.length-1,scene+direction));
  g.sum=0;g.lockedUntil=now+(reduce?400:1150);
  if(next!==scene)go(next);
 };
 const wheel=e=>{
  if(document.querySelector('[data-dragging="true"]')||Array.from(document.querySelectorAll('[data-gesture-until]')).some(el=>Number(el.dataset.gestureUntil)>Date.now()))return;
  if(e.ctrlKey||e.metaKey||light||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
  e.preventDefault();
  const now=performance.now();
  if(now<g.lockedUntil){g.sum=0;g.last=now;return;}
  const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1);
  if(now-g.last>200||Math.sign(delta)!==Math.sign(g.sum))g.sum=0;
  g.sum+=delta;g.last=now;
  if(Math.abs(g.sum)>=55)advance(Math.sign(g.sum));
 };
 const start=e=>{if(e.target.closest('.lanyard-panel')){g.touch=null;return;}g.touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;};
 const move=e=>{
  if(!g.touch||light||e.touches.length!==1)return;
  const dx=e.touches[0].clientX-g.touch.x,dy=e.touches[0].clientY-g.touch.y;
  if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)*1.3)e.preventDefault();
 };
 const end=e=>{
  if(e.target.closest('.lanyard-panel')||document.querySelector('[data-dragging="true"]')||Array.from(document.querySelectorAll('[data-gesture-until]')).some(el=>Number(el.dataset.gestureUntil)>Date.now())){g.touch=null;return;}
  if(!g.touch||!e.changedTouches.length)return;
  const dx=e.changedTouches[0].clientX-g.touch.x,dy=e.changedTouches[0].clientY-g.touch.y;
  g.touch=null;
  if(Math.abs(dy)>=55&&Math.abs(dy)>Math.abs(dx)*1.3)advance(dy<0?1:-1);
 };
 const cancel=()=>{g.touch=null;};
 window.addEventListener('wheel',wheel,{passive:false});
 window.addEventListener('touchstart',start,{passive:true});
 window.addEventListener('touchmove',move,{passive:false});
 window.addEventListener('touchend',end,{passive:true});
 window.addEventListener('touchcancel',cancel,{passive:true});
 return()=>{window.removeEventListener('wheel',wheel);window.removeEventListener('touchstart',start);window.removeEventListener('touchmove',move);window.removeEventListener('touchend',end);window.removeEventListener('touchcancel',cancel);};
},[scene,menu,light,reduce]);
return <LazyMotion features={loadMotionFeatures}><MotionConfig reducedMotion="user"><div className="app"><m.div className="glow" animate={{x:scene*35,y:scene*-14}} transition={{duration:1.4}}/><div className="ripples"/><header inert={light?true:undefined} aria-hidden={light?true:undefined}><m.div className="navbar" initial={false} animate={{y:0,opacity:1}} transition={{duration:.8,ease}}><button className="brand glass" onClick={()=>go(0)}><img src={brandAvatar} width="64" height="64" alt=""/>{c.name}<span className="brand-dot"/></button><nav className="glass navlinks" aria-label="التنقل الرئيسي">{c.nav.map((n,i)=><button key={n} onClick={()=>go(i)} aria-current={scene===i?'page':undefined}>{scene===i&&<m.span className="active-pill" layoutId="nav" transition={{type:'spring',stiffness:300,damping:30}}/>}<span>{n}</span></button>)}</nav><button ref={menuButton} className="glass menu-btn" aria-label={c.ui.menu} aria-expanded={menu} aria-controls="compact-menu" onClick={()=>setMenu(!menu)}>{menu?<X size={20}/>:<Menu size={20}/>}</button></m.div></header>
<AnimatePresence mode="wait" initial={false}><SceneFrame sceneRef={sceneRef} focusPending={shouldFocus} covered={Boolean(light)} scene={scene} reduce={reduce} key={scene}>
{scene===0&&<Home go={go} reduce={reduce}/>}<Suspense fallback={<div role="status">جارٍ التحميل</div>}>{scene===1&&<Works setLight={setLight} reduce={reduce} blocked={Boolean(light)||menu}/>} {scene===2&&<About/>}{scene===3&&<Clients/>}{scene===4&&<Stats reduce={reduce}/>}</Suspense></SceneFrame></AnimatePresence>
<footer inert={light?true:undefined} aria-hidden={light?true:undefined}><div className="scene-dots">{c.nav.map((n,i)=><button onClick={()=>go(i)} key={n} aria-label={n} aria-current={scene===i?'page':undefined} className={scene===i?'selected':''}/>)}</div></footer>
<AnimatePresence>{menu&&<React.Fragment><m.button className="menu-dismiss" aria-label={c.ui.close} onClick={()=>setMenu(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/><m.nav id="compact-menu" aria-label="قائمة التنقل" className="mobile-menu glass" initial={{opacity:0,y:-8,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-5,scale:.97}} transition={{duration:reduce?.1:.22,ease}}>{c.nav.map((n,i)=><button aria-current={scene===i?'page':undefined} className={scene===i?'chosen':''} onClick={()=>go(i)} key={n}><span>{n}</span><ArrowUpLeft/></button>)}</m.nav></React.Fragment>}</AnimatePresence>
<AnimatePresence>{light&&<Suspense fallback={null}><Lightbox light={light} close={()=>setLight(null)}/></Suspense>}</AnimatePresence></div></MotionConfig></LazyMotion>}
function SceneFrame({sceneRef,focusPending,covered,scene,reduce,children}){
 const [present,safeToRemove]=usePresence();
 useLayoutEffect(()=>{
  const element=sceneRef.current;
  if(!element||(present&&!focusPending.current))return;
  let active=true;
  const finish=()=>{if(!active)return;if(!present)safeToRemove?.();else if(focusPending.current){element.focus({preventScroll:true});focusPending.current=false;}};
  if(reduce||typeof element.animate!=='function'){finish();return;}
  // Native compositor animation works from the very first scroll, independently
  // of the gesture/layout feature bundle that is loaded on that same input.
  const frames=present
   ?[{opacity:0,transform:'translateY(16px) scale(1.02)'},{opacity:1,transform:'translateY(0) scale(1)'}]
   :[{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(-16px) scale(.985)'}];
  const animation=element.animate(frames,{duration:420,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
  animation.finished.then(finish,()=>{});
  return()=>{active=false;animation.cancel();};
 },[present,scene,reduce]);
 return <main ref={sceneRef} tabIndex={-1} className={'scene scene-'+scene} aria-label={c.nav[scene]} aria-hidden={present&&!covered?undefined:true} inert={present&&!covered?undefined:true}>{children}</main>;
}
function Home({go,reduce}){return <div className="home"><m.div className="eyebrow" initial={false} animate={{opacity:1}} ><span/>{c.eyebrow}</m.div><h1>{c.headline.map((line,i)=><m.span key={line} className={i?'gradient-text':''} initial={false} animate={{opacity:1,y:0}} >{line}</m.span>)}</h1><div className="hero-bottom"><m.div className="identity" initial={false} animate={{opacity:1,y:0}} ><div><h2>{c.name}</h2><p>{c.role}</p></div><m.div className="avatar" animate={reduce?{}:{y:[0,-6,0]}} transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}><img src={avatarSrc} srcSet={avatarSrcSet} sizes={avatarSizes} width="1254" height="1254" fetchPriority="high" loading="eager" alt="محمد مطراش"/></m.div></m.div><m.button className="cta" whileHover={{y:-2}} whileTap={{scale:.97}} onClick={()=>go(1)} initial={false} animate={{opacity:1,y:0}} >{c.cta}<ArrowLeft size={24}/></m.button></div></div>}
export default App;
