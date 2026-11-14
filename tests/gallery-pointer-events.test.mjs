import test from 'node:test';
import assert from 'node:assert/strict';
import {bindGalleryPointerEvents} from '../src/gallery-pointer-events.js';
function event(type,target){const e=new Event(type,{bubbles:true,cancelable:true});Object.defineProperty(e,'target',{value:target});Object.assign(e,{pointerId:7,pointerType:'touch',isPrimary:true,button:0});return e;}
function setup(){
 const gallery=new EventTarget(),root=new EventTarget(),card={};let active=false,moves=0,cancels=0,ups=0;
 const dispose=bindGalleryPointerEvents(gallery,root,{
  down:()=>{active=true},move:()=>{if(active)moves++},up:()=>{if(active)ups++;active=false},cancel:()=>{cancels++;active=false},enter:()=>{},leave:()=>{}
 });
 return{gallery,root,card,dispose,state:()=>({active,moves,cancels,ups})};
}
test('touch drag survives implicit capture moving from a card to its gallery',()=>{
 const s=setup();s.gallery.dispatchEvent(event('pointerdown',s.card));s.root.dispatchEvent(event('pointermove',s.card));
 // Touch browsers release implicit capture on the child when the gallery captures.
 // That child's lostpointercapture bubbles through the gallery.
 s.gallery.dispatchEvent(event('lostpointercapture',s.card));
 s.root.dispatchEvent(event('pointermove',s.gallery));s.root.dispatchEvent(event('pointerup',s.gallery));
 assert.deepEqual(s.state(),{active:false,moves:2,cancels:0,ups:1});s.dispose();
});
test('losing the gallery own capture cancels the active drag',()=>{const s=setup();s.gallery.dispatchEvent(event('pointerdown',s.card));s.gallery.dispatchEvent(event('lostpointercapture',s.gallery));s.root.dispatchEvent(event('pointermove',s.gallery));assert.deepEqual(s.state(),{active:false,moves:0,cancels:1,ups:0});s.dispose()});
test('pointer cancellation recovers and the next touch can drag',()=>{const s=setup();s.gallery.dispatchEvent(event('pointerdown',s.card));s.root.dispatchEvent(event('pointercancel',s.gallery));s.gallery.dispatchEvent(event('pointerdown',s.card));s.root.dispatchEvent(event('pointermove',s.gallery));s.root.dispatchEvent(event('pointerup',s.gallery));assert.deepEqual(s.state(),{active:false,moves:1,cancels:1,ups:1});s.dispose()});
test('unmount removes pointer listeners before another category mounts',()=>{const s=setup();s.dispose();s.gallery.dispatchEvent(event('pointerdown',s.card));s.root.dispatchEvent(event('pointermove',s.gallery));assert.deepEqual(s.state(),{active:false,moves:0,cancels:0,ups:0})});
