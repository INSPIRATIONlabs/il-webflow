var vw = window.innerWidth;
var vh = window.innerHeight;

var pad = 26;
var minWidth = vw * 0.19;
var maxWidth = vw * 0.29;
var bubbleHeight = minWidth;
var itemNames = ['software', 'coaching', 'workspace', 'infrastructure']; 

var elastic = Elastic.easeOut.config(0.3, 0.3);

var bubbles = [];

document.addEventListener('DOMContentLoaded', (event) => {

    /**
    for (var i = 0; i < 4; i++) {
        var bubble = createBubble(i);
        bubbles.push(bubble);  
        placeBubble(bubble);
    }**/

    var containers = document.querySelectorAll('.sym-container');
    for (var c = 0; c < containers.length; c++) {
        console.log('next run');
        bubbles = [];
        // random sort items
        // fisherYatesShuffle(itemNames);
        // @todo: remove items or double ones
        var parent = containers[c];
    
        for (var i = 0; i < itemNames.length; i++) {
            var els = parent.querySelectorAll('.sym-competence.'+itemNames[i]);
            var bubble = createBubble(els);
            bubbles.push(bubble);
            placeBubble(bubble);
        }
    
        // console.log(itemNames);    
    }
    (function () {
        const scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
    smooth: true
        });
    })();
});

window.addEventListener("resize", resize);

function fisherYatesShuffle(arr){
    for(var i =arr.length-1 ; i>0 ;i--){
        var j = Math.floor( Math.random() * (i + 1) ); //random index
        [arr[i],arr[j]]=[arr[j],arr[i]]; // swap
    }
}

function placeBubble(bubble) {
  console.log(bubble.elements[0].className);
  bubble.placed = true;
//   bubble.width  = randomInt(minWidth, maxWidth);  
  bubble.left   = randomInt(pad, vw - (bubble.width + pad));
  bubble.top    = randomInt(pad, vh - (bubble.height + pad));
  bubble.right  = bubble.left + bubble.width;
  bubble.bottom = bubble.top  + bubble.height;
//   console.log(bubble);
  // Loop through all bubbles
  for (var i = 0; i < bubbles.length; i++) {
    
    var b = bubbles[i];
    
    // Skip if b is this bubble or isn't placed
    if (b === bubble || !b.placed) {
      continue;
    }
    
    // Collision detected, can't place bubble
    if (intersects(bubble, b)) {
      bubble.placed = false;
      break;
    }    
  }
  
  if (bubble.placed) {    
    
    // No collisions detected. It's place is reserved and we can animate to it
    animateBubble(bubble);    
    
  } else {        
    
    // Can't place bubble. Try again on next animation frame
    // requestAnimationFrame(function() {
        console.log('trya');
        placeBubble(bubble);
    // });
  }
}

function animateBubble(bubble) {
  for(var i = 0; i < bubble.elements.length; i++) {
    bubble.elements[i].style.position = 'absolute';
    bubble.elements[i].style.top = bubble.top + 'px';
    bubble.elements[i].style.left = bubble.left + 'px';  
  }
  /*  
  TweenLite.set(bubble.element, {
    width: bubble.width,
    x: bubble.left,
    y: vh
  });*/
  
  /*
  var tl = new TimelineLite({ onComplete: placeBubble, onCompleteParams: [bubble] })
    .to(bubble.element, random(0.5, 2), { autoAlpha: 1, y: bubble.top, ease: elastic }, random(10))
    .add("leave", "+=" + random(5, 10))
    .add(function() { bubble.placed = false; }, "leave") // When bubble is leaving, it is no longer placed
    .to(bubble.element, random(0.5, 2), { autoAlpha: 0, y: -vh }, "leave");*/
}

function createBubble(elements) {
    
  return {
    elements: elements,
    placed: false,
    width: elements[0].offsetWidth,
    height: elements[0].offsetHeight,
    left: 0,
    top: 0,
    right: elements[0].offsetWidth,
    bottom: elements[0].offsetHeight
  };
}

function intersects(a, b) {
  return !(b.left > a.right + pad || 
           b.right < a.left - pad || 
           b.top > a.bottom + pad || 
           b.bottom < a.top - pad);
}

function resize() {
  vw = window.innerWidth;
  vh = window.innerHeight;
}

function random(min, max) {
  if (max == null) { max = min; min = 0; }
  if (min > max) { var tmp = min; min = max; max = tmp; }
  return min + (max - min) * Math.random();
}

function randomInt(min, max) {
  if (max == null) { max = min; min = 0; }
  if (min > max) { var tmp = min; min = max; max = tmp; }
  return Math.floor(min + (max - min + 1) * Math.random());
}
