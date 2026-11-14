export const wrapIndex=(index,count)=>((index%count)+count)%count;
export function gestureAxis(dx,dy,pointerType){
 if(Math.max(Math.abs(dx),Math.abs(dy))<8)return null;
 if(pointerType==='mouse')return Math.abs(dx)>=8?'horizontal':null;
 if(Math.abs(dx)>Math.abs(dy)*1.15)return 'horizontal';
 if(Math.abs(dy)>Math.abs(dx)*1.15)return 'vertical';
 return null;
}
export function releasedPosition(position,samples,now,spacing,reduced=false){
 const recent=samples.filter(sample=>now-sample.t<=120);
 let momentum=0;
 if(!reduced&&recent.length>1){const a=recent[0],b=recent.at(-1);const seconds=Math.max((b.t-a.t)/1000,.016);const velocity=(b.x-a.x)/seconds;momentum=Math.max(-.85,Math.min(.85,-velocity*.10/spacing));}
 return Math.round(position+momentum);
}
export function nearestPosition(current,index,count){return Math.round(current+(wrapIndex(index-current+count/2,count)-count/2));}
