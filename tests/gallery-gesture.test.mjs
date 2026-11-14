import test from 'node:test';import assert from 'node:assert/strict';
import {gestureAxis,releasedPosition,nearestPosition,wrapIndex} from '../src/gallery-gesture.js';
test('small pointer movements do not become drags',()=>assert.equal(gestureAxis(4,3,'touch'),null));
test('touch gestures distinguish horizontal gallery dragging from vertical scene swipes',()=>{assert.equal(gestureAxis(80,15,'touch'),'horizontal');assert.equal(gestureAxis(15,80,'touch'),'vertical');assert.equal(gestureAxis(9,9,'touch'),null);});
test('mouse can drag diagonally without cancelling',()=>assert.equal(gestureAxis(30,60,'mouse'),'horizontal'));
test('a paused release has no stale fling velocity',()=>assert.equal(releasedPosition(2.2,[{x:300,t:0},{x:0,t:50}],400,250),2));
test('fast swipes have bounded momentum in either direction',()=>{assert.equal(releasedPosition(2,[{x:500,t:0},{x:0,t:16}],16,250),3);assert.equal(releasedPosition(2,[{x:0,t:0},{x:500,t:16}],16,250),1);});
test('reduced motion always snaps without momentum',()=>assert.equal(releasedPosition(2.2,[{x:500,t:0},{x:0,t:16}],16,250,true),2));
test('looping picks the closest copy of a requested card',()=>{assert.equal(nearestPosition(6.8,0,7),7);assert.equal(nearestPosition(.2,6,7),-1);assert.equal(wrapIndex(-1,7),6);});
