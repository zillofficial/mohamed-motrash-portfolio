import './sections.css';
import React,{lazy,Suspense,useState,useEffect,useRef,useMemo} from 'react';
import {motion,animate} from 'framer-motion';
import {X,Users,BriefcaseBusiness,Award,Play} from 'lucide-react';
import SmoothGallery from './SmoothGallery';
import {portfolio} from './portfolio';
import {content as c} from './content';
import LanyardPreview from './LanyardPreview';
const DesignerLanyard=lazy(()=>import('./DesignerLanyard'));
function Heading({title,sub}){return <div className="heading"><h2>{title}</h2><p>{sub}</p></div>}
export function Works({setLight,reduce,blocked}){
 const[index,setIndex]=useState(0),[category,setCategory]=useState('image');const gallery=useRef(null);
 const items=useMemo(()=>portfolio.filter(item=>item.type===category),[category]);
 const filters=[['image','تصميمات'],['video','مقاطع الفيديو']];
 return <div className="works"><div className="section-top"><Heading title={c.nav[1]} sub={c.categories[0]}/><div className="work-filters" role="group" aria-label="نوع الأعمال">{filters.map(([value,label])=><button key={value} aria-pressed={category===value} onClick={()=>{setCategory(value);setIndex(0)}}>{label}</button>)}</div></div>
 <SmoothGallery key={category} ref={gallery} items={items} brochures={false} reduce={reduce} blocked={blocked} onActiveChange={setIndex} onOpen={item=>setLight({...item,trigger:document.activeElement})} renderItem={item=>(<div className="portfolio-piece"><div className="portfolio-art"><img draggable="false" loading="lazy" decoding="async" src={item.thumb} alt=""/>{item.type==='video'&&<span className="video-mark"><Play size={19} fill="currentColor" aria-hidden="true"/><span>{Math.floor(item.duration/60)}:{String(item.duration%60).padStart(2,'0')}</span></span>}</div><div className="portfolio-caption"><small>{item.type==='video'?'مونتاج فيديو':'تصميم جرافيكي'}</small><strong>{item.title}</strong>{item.type==='video'&&<span className="portfolio-play"><Play size={14} fill="currentColor" aria-hidden="true"/>{item.aspect<1?'تشغيل المقطع':'تشغيل الفيديو'}</span>}</div></div>)}/>
 <div className="carousel-controls"><span>{c.ui.worksHint}</span><div className="progress">{items.map((item,i)=><button key={item.id} aria-label={`عرض العمل: ${item.title}`} aria-current={index===i?'true':undefined} className={index===i?'on':''} onClick={()=>gallery.current?.focus(i)}/>)}</div></div></div>;
}

export function About(){return <div className="about"><div className="about-copy"><span className="purple-label">{c.ui.aboutLabel}</span><h2>{c.name}</h2><motion.i initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:.2,duration:.5}}/>{c.about.map((p,i)=><motion.p key={p} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.3+i*.12}}>{p}</motion.p>)}</div><Suspense fallback={<div className="lanyard-panel"><LanyardPreview/></div>}><DesignerLanyard/></Suspense></div>}
export function Clients() {
  return (
    <div className="clients">
      <Heading title={c.nav[3]} sub={c.ui.clientSub} />
      <svg className="logo-filters" width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="client-paper-key" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 1 0" result="red" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 1 0 0 0  0 1 0 0 0  0 1 0 0 0  0 0 0 1 0" result="green" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 1 0 0  0 0 1 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
            <feBlend in="red" in2="green" mode="darken" result="red-green-min" />
            <feBlend in="red-green-min" in2="blue" mode="darken" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.15 0 0 0 1.14" result="logo-alpha" />
            <feFlood floodColor="white" result="background" />
            <feComposite in="background" in2="logo-alpha" operator="out" result="matte" />
            <feComposite in="SourceGraphic" in2="matte" operator="arithmetic" k2="1" k3="-1" />
          </filter>
          <filter id="client-navy-key" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -.61" result="logo-alpha" />
            <feFlood floodColor="#19192f" result="background" />
            <feComposite in="background" in2="logo-alpha" operator="out" result="matte" />
            <feComposite in="SourceGraphic" in2="matte" operator="arithmetic" k2="1" k3="-1" />
          </filter>
        </defs>
      </svg>
      <div className="client-grid client-logos">
        {c.clientRows.map((row, rowIndex) => (
          <div className="client-logo-row" key={row[0].name}>
            {row.map((client, index) => (
              <motion.div
                className="client client-logo"
                key={client.name}
                initial={{opacity:0,scale:.95,y:20}}
                animate={{opacity:1,scale:1,y:0}}
                transition={{delay:(rowIndex+index)*.08}}
                whileHover={{y:-5}}
              >
                <img className={client.shape} src={client.logo} alt={client.name} loading="lazy" decoding="async" />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Counter({value,reduce}){const ref=useRef();useEffect(()=>{if(reduce){ref.current.textContent='+'+value;return}const control=animate(0,value,{duration:2,ease:'easeOut',onUpdate:v=>{if(ref.current)ref.current.textContent='+'+Math.round(v)}});return()=>control.stop()},[value,reduce]);return <strong ref={ref} dir="ltr">+0</strong>}
export function Stats({reduce}){return <div className="stats"><Heading title={c.nav[4]} sub={c.ui.statSub}/><div className="stat-grid">{c.stats.map((s,i)=>{const Icon=[Users,BriefcaseBusiness,Award][i];return <motion.div key={s.label} className="stat glass" style={{height:245+i*48}} initial={{opacity:0,y:80}} animate={{opacity:1,y:0}} transition={{delay:i*.14,duration:.7}}><motion.div className="stat-inner" animate={reduce?{}:{y:[0,-5,0]}} transition={{duration:5,repeat:Infinity,delay:i*.6}}><span className="stat-icon"><Icon size={28}/></span><Counter value={s.value} reduce={reduce}/><p>{s.label}</p><span className="stat-line"/></motion.div></motion.div>})}</div></div>}
export function Lightbox({light,close}){
 const ref=useRef(null),dialog=useRef(null);
 useEffect(()=>{const before=light.trigger;ref.current?.focus();return()=>{requestAnimationFrame(()=>{if(before?.isConnected)before.focus({preventScroll:true})})}},[light]);
 const trap=e=>{if(e.key!=='Tab')return;const controls=[...dialog.current.querySelectorAll('button,video')];const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}};
 return <motion.div ref={dialog} className="lightbox" role="dialog" aria-modal="true" aria-labelledby="work-dialog-title" aria-describedby="work-dialog-description" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={close} onKeyDown={trap}><button ref={ref} className="close-light glass" aria-label={c.ui.close} onClick={close}><X/></button><motion.div className="light-content portfolio-detail" initial={{scale:.95}} animate={{scale:1}} onClick={e=>e.stopPropagation()}>{light.type==='video'?<video key={light.id} src={light.video} poster={light.thumb} controls playsInline autoPlay={Boolean(light.autoplay)} preload="none" tabIndex={0} aria-label={light.title}/>:<img src={light.full} alt={light.title}/>}<h2 id="work-dialog-title">{light.title}</h2><p id="work-dialog-description">{light.description}</p></motion.div></motion.div>;
}
