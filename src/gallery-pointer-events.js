// Keep browser pointer ownership separate from the gallery's animation state.
export function bindGalleryPointerEvents(element,root,handlers){
 // lostpointercapture bubbles. Ignore the child's implicit capture being
 // transferred to the gallery; only loss of the gallery's own capture cancels.
 const lostCapture=e=>{if(e.target===element)handlers.cancel(e)};
 const entries=[
  [element,'pointerdown',handlers.down],
  [root,'pointermove',handlers.move,{passive:false}],
  [root,'pointerup',handlers.up],
  [root,'pointercancel',handlers.cancel],
  [element,'lostpointercapture',lostCapture],
  [element,'pointerenter',handlers.enter],
  [element,'pointerleave',handlers.leave]
 ];
 for(const [target,type,handler,options] of entries)target.addEventListener(type,handler,options);
 return()=>{for(const [target,type,handler,options] of entries)target.removeEventListener(type,handler,options)};
}
