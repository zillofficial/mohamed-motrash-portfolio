import React from 'react';
import {content as c} from './content';

// Match the resting 3D card's framing while its renderer is being prepared.
export default function LanyardPreview(){return <div className="lanyard-preview" aria-hidden="true"><svg viewBox="0 -290 800 1654" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
 <defs><linearGradient id="card-preview-bg" x2="1" y2="1"><stop stopColor="#ba7a50"/><stop offset="1" stopColor="#161616"/></linearGradient><clipPath id="card-preview-clip"><rect x="48" y="155" width="704" height="920" rx="18"/></clipPath></defs>
 <rect x="350" y="-290" width="100" height="270" fill="#c0794a"/><rect x="346" y="-30" width="108" height="28" rx="5" fill="#bdbdbd"/>
 <rect width="800" height="1125" rx="36" fill="url(#card-preview-bg)" stroke="#39332f" strokeWidth="12"/>
 <rect x="35" y="35" width="730" height="1055" fill="none" stroke="#e99e6b" strokeWidth="3"/>
 <rect x="315" y="46" width="170" height="35" rx="17" fill="#101010"/><ellipse cx="400" cy="-1" rx="25" ry="42" fill="none" stroke="#c7c7c7" strokeWidth="12"/>
 <rect x="350" y="130" width="100" height="5" fill="#fcba8d"/>
 <image href={c.lanyardPhoto} x="63.28" y="175" width="673.44" height="900" clipPath="url(#card-preview-clip)"/>
 </svg></div>}
