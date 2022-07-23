// console.clear();

var vw = window.innerWidth;
var vh = window.innerHeight;
alert("Hey");
var pad = 26;
var minWidth = vw * 0.19;
var maxWidth = vw * 0.29;
var bubbleHeight = minWidth;
var itemNames = ['software', 'coaching', 'workspace', 'infrastructure']; 

var bubbles = [];

document.addEventListener('DOMContentLoaded', (event) => {

    var containers = document.querySelectorAll('.sym-container');
    if (containers.length) {
        for (var c = 0; c < containers.length; c++) {
            // console.log('next run');
            bubbles = [];
            // random sort items
            // fisherYatesShuffle(itemNames);
            // @todo: remove items or double ones
            var parent = containers[c];

            for (var i = 0; i < itemNames.length; i++) {
                var els = parent.querySelectorAll('.sym-competence.'+itemNames[i]);
                if (els.length) {
                  var bubble = createBubble(els);
                  bubbles.push(bubble);
                  placeBubble(bubble);
                }
            }
        }
    }
    (function () {
        const scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            getDirection: true
        });
        scroll.on('scroll', (instance) => {
            changeOpacityEls();
            const h = document.documentElement;
            // console.log(instance.scroll.y);

            h.classList.toggle("direction-up", instance.direction == "up");
            h.classList.toggle("direction-down", instance.direction == "down");
            h.classList.toggle("is-top", instance.scroll.y < 100);
            h.classList.toggle("is-not-top", 100 <= instance.scroll.y);

            /*if (instance.scroll.y > 0) {
              document.querySelector('.main-navigation').classList.add('menu-shrink');
            } else {
              document.querySelector('.main-navigation').classList.remove('menu-shrink');
            }*/
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
  // console.log(bubble.elements[0].className);
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
        // console.log('trya');
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


function changeOpacityEls() {
  var els = document.getElementsByClassName('saturate');
  // console.log(els);
  for(let i=0; i<els.length; i++) {
  	var el = els[i];
    changeOpacity(el);
  }
  els = document.getElementsByClassName('unleash');
  for(let i=0; i<els.length; i++) {
  	var el = els[i];
    unleash(el);
  }
  // console.log(els);
}


function changeOpacity(el) {
  var rect = el.getBoundingClientRect();
  var top = rect.top;
  var scrollY = window.scrollY;
  var inView = false;
  var pct = 100;
  var diff = (scrollY - (top*-1));
  
  if(isInView(rect)) {
    if(diff < winHeight) {	// image is placed already in viewport at start
    	inView = true;
    	pct = (-1 * top) / (rect.height / 5);
    } else {
    	top = top - (winHeight / 3);
      	pct = (-1 * top) / (rect.height / 2);
    	// console.log({rect, top, winHeight, diff, scrollY, pct, inView});
    }
    el.style.filter = 'saturate('+(pct)+')';
  }
}

function unleash(el) {
  var rect = el.getBoundingClientRect();
  var top = rect.top;
  var scrollY = window.scrollY;
  var inView = false;
  var pct = 100;
  var diff = (scrollY - (top*-1));
  
  if(isInView(rect)) {
    if(diff < winHeight) {	// image is placed already in viewport at start
    	inView = true;
    	pct = 1 - (-1 * top) / (rect.height / 5);
    } else {
    	top = top - (winHeight / 3);
      	pct = 1 - (-1 * top) / (rect.height / 2);
    	// console.log({rect, top, winHeight, diff, scrollY, pct, inView});
    }
    pct = Math.max(pct, 0.2);
    el.style.opacity = pct;
  }
}

function isInView(rect) {
  if(rect.bottom > 0 && rect.top < winHeight) return true;
  return false;
}
