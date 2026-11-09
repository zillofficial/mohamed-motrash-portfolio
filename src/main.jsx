import SmoothGallery from './SmoothGallery';
import {lazy,Suspense} from 'react';
const DesignerLanyard=lazy(()=>import('./DesignerLanyard'));
import React,{useState,useEffect,useRef} from 'react';import{createRoot}from'react-dom/client';import{motion,AnimatePresence,MotionConfig,useReducedMotion,useMotionValue,animate}from'framer-motion';import{ArrowLeft,ArrowRight,Menu,X,Users,BriefcaseBusiness,Award,Heart,MessageCircle,Pause,Play,Sparkles,ArrowUpLeft}from'lucide-react';import{content as c}from'./content';import './style.css';
const ease=[.22,1,.36,1];
function App(){const[scene,setScene]=useState(0),[menu,setMenu]=useState(false),[light,setLight]=useState(null);const reduce=useReducedMotion();const go=i=>{setScene((i+5)%5);setMenu(false)};
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
return <MotionConfig reducedMotion="user"><div className="app"><motion.div className="glow" animate={{x:scene*35,y:scene*-14}} transition={{duration:1.4}}/><div className="ripples"/><header><motion.div className="navbar" initial={{y:-35,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.8,ease}}><button className="brand glass" onClick={()=>go(0)}><img src={c.avatar} alt=""/>{c.name}<span className="brand-dot"/></button><nav className="glass navlinks" aria-label="التنقل الرئيسي">{c.nav.map((n,i)=><button key={n} onClick={()=>go(i)} aria-current={scene===i?'page':undefined}>{scene===i&&<motion.span className="active-pill" layoutId="nav" transition={{type:'spring',stiffness:300,damping:30}}/>}<span>{n}</span></button>)}</nav><button className="glass menu-btn" aria-label={c.ui.menu} aria-expanded={menu} aria-controls="compact-menu" onClick={()=>setMenu(!menu)}>{menu?<X size={20}/>:<Menu size={20}/>}</button></motion.div></header>
<AnimatePresence mode="wait"><motion.main className={'scene scene-'+scene} key={scene} initial={{opacity:0,scale:reduce?1:1.04,filter:reduce?'none':'blur(14px)',y:reduce?0:15}} animate={{opacity:1,scale:1,filter:'blur(0px)',y:0}} exit={{opacity:0,scale:reduce?1:.96,filter:reduce?'none':'blur(16px)',y:reduce?0:-12}} transition={{duration:reduce?.15:.5,ease}}>
{scene===0&&<Home go={go} reduce={reduce}/>}{scene===1&&<Works setLight={setLight} reduce={reduce}/>} {scene===2&&<About/>}{scene===3&&<Clients/>}{scene===4&&<Stats reduce={reduce}/>}</motion.main></AnimatePresence>
<footer><div className="scene-dots">{c.nav.map((n,i)=><button onClick={()=>go(i)} key={n} aria-label={n} className={scene===i?'selected':''}/>)}</div></footer>
<AnimatePresence>{menu&&<React.Fragment><motion.button className="menu-dismiss" aria-label={c.ui.close} onClick={()=>setMenu(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/><motion.nav id="compact-menu" aria-label="قائمة التنقل" className="mobile-menu glass" initial={{opacity:0,y:-8,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-5,scale:.97}} transition={{duration:reduce?.1:.22,ease}}>{c.nav.map((n,i)=><button aria-current={scene===i?'page':undefined} className={scene===i?'chosen':''} onClick={()=>go(i)} key={n}><span>{n}</span><ArrowUpLeft/></button>)}</motion.nav></React.Fragment>}</AnimatePresence>
<AnimatePresence>{light&&<Lightbox light={light} close={()=>setLight(null)}/>}</AnimatePresence></div></MotionConfig>}
function Home({go,reduce}){return <div className="home"><motion.div className="eyebrow" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}}><span/>{c.eyebrow}</motion.div><h1>{c.headline.map((line,i)=><motion.span key={line} className={i?'gradient-text':''} initial={{opacity:0,y:40,filter:'blur(12px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{duration:.8,delay:.15+i*.15,ease}}>{line}</motion.span>)}</h1><div className="hero-bottom"><motion.div className="identity" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.7}}><div><h2>{c.name}</h2><p>{c.role}</p></div><motion.div className="avatar" animate={reduce?{}:{y:[0,-6,0]}} transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}><img src={c.avatar} alt="صورة رمزية مؤقتة لمحمد مطراش"/></motion.div></motion.div><motion.button className="cta" whileHover={{y:-2}} whileTap={{scale:.97}} onClick={()=>go(1)} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.85}}>{c.cta}<ArrowLeft size={24}/></motion.button></div></div>}
function Heading({title,sub}){return <div className="heading"><h2>{title}</h2><p>{sub}</p></div>}
function Works({setLight,reduce}){
 const[index,setIndex]=useState(0);const gallery=useRef(null);const items=c.posters;
 return <div className="works"><div className="section-top"><Heading title={c.nav[1]} sub={c.categories[0]}/></div>
 <SmoothGallery ref={gallery} items={items} brochures={false} reduce={reduce} onActiveChange={setIndex} onOpen={item=>setLight(item)} renderItem={item=>(<><img draggable="false" src={`https://images.unsplash.com/${item.image}?w=650&auto=format&fit=crop`} alt=""/><div className="poster-shade"/><div className="poster-copy"><small>{item.tag}</small><strong>{item.title}</strong><span>✳</span><p>{c.name} / DESIGN STUDIO</p></div></>)}/>
 <div className="carousel-controls"><span>{c.ui.worksHint}</span><div className="progress">{items.map((_,i)=><button key={i} aria-label={`${i+1}`} aria-current={index===i?'true':undefined} className={index===i?'on':''} onClick={()=>gallery.current?.focus(i)}/>)}</div></div></div>;
}
function About(){return <div className="about"><div className="about-copy"><span className="purple-label">{c.ui.aboutLabel}</span><h2>{c.name}</h2><motion.i initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:.2,duration:.5}}/>{c.about.map((p,i)=><motion.p key={p} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.3+i*.12}}>{p}</motion.p>)}</div><Suspense fallback={<div className="lanyard-panel"/>}><DesignerLanyard/></Suspense></div>}
function Clients(){return <div className="clients"><Heading title={c.nav[3]} sub={c.ui.clientSub}/><div className="client-grid">{c.clients.map((n,i)=><motion.div className="client glass" key={n} initial={{opacity:0,scale:.9,y:24,filter:'blur(8px)'}} animate={{opacity:1,scale:1,y:0,filter:'blur(0px)'}} transition={{delay:((i*7)%15)*.035}} whileHover={{y:-6,borderColor:'#8b5cf6'}}><span className="client-symbol">{['◈','✳','⌘','◇','LE'][i%5]}</span><strong>{n}</strong></motion.div>)}</div><p className="sample-note">{c.ui.sample}</p></div>}
function Counter({value,reduce}){const ref=useRef();useEffect(()=>{if(reduce){ref.current.textContent='+'+value;return}const control=animate(0,value,{duration:2,ease:'easeOut',onUpdate:v=>{if(ref.current)ref.current.textContent='+'+Math.round(v)}});return()=>control.stop()},[value,reduce]);return <strong ref={ref} dir="ltr">+0</strong>}
function Stats({reduce}){return <div className="stats"><Heading title={c.nav[4]} sub={c.ui.statSub}/><div className="stat-grid">{c.stats.map((s,i)=>{const Icon=[Users,BriefcaseBusiness,Award][i];return <motion.div key={s.label} className="stat glass" style={{height:245+i*48}} initial={{opacity:0,y:80}} animate={{opacity:1,y:0}} transition={{delay:i*.14,duration:.7}}><motion.div className="stat-inner" animate={reduce?{}:{y:[0,-5,0]}} transition={{duration:5,repeat:Infinity,delay:i*.6}}><span className="stat-icon"><Icon size={28}/></span><Counter value={s.value} reduce={reduce}/><p>{s.label}</p><span className="stat-line"/></motion.div></motion.div>})}</div></div>}
function Lightbox({light,close}){const ref=useRef();useEffect(()=>{const before=document.activeElement;ref.current?.focus();return()=>before?.focus()},[]);return <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={light.title} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={close} onKeyDown={e=>{if(e.key==='Tab'){e.preventDefault();ref.current?.focus()}}}><button ref={ref} className="close-light glass" aria-label={c.ui.close} onClick={close}><X/></button><motion.div className="light-content" initial={{scale:.85}} animate={{scale:1}} onClick={e=>e.stopPropagation()}>{light.image?<img src={`https://images.unsplash.com/${light.image}?w=1600&auto=format&fit=crop`} alt={light.title}/>:<div className="light-book" style={{background:light.color}}><span>◇</span><h2>{light.title}</h2><p>{light.en}</p></div>}<p>{light.title}</p></motion.div></motion.div>}
createRoot(document.getElementById('root')).render(<App/>);
