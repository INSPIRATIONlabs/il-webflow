// console.clear();
//from utils.js

// Map number x from range [a, b] to [c, d]
const map = (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c;

// Linear interpolation
const lerp = (a, b, n) => (1 - n) * a + n * b;

const calcWinsize = () => {
    return {width: window.innerWidth, height: window.innerHeight};
};

// Gets the mouse position
const getMousePos = e => {
  //console.log({x: e.clientX, y:e.clientY});
    return { 
        x : e.clientX, 
        y : e.clientY 
    };
};

const distance = (x1,y1,x2,y2) => {
    var a = x1 - x2;
    var b = y1 - y2;

    return Math.hypot(a,b);
}

// Generate a random float.
const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

//cursor.js
// Track the mouse position
let mouse = {x: 0, y: 0};
window.addEventListener('mousemove', ev => mouse = getMousePos(ev));

class Cursor {
    constructor(el) {
        this.DOM = {el: el};
        this.DOM.el.style.opacity = 0;
        
        this.bounds = this.DOM.el.getBoundingClientRect();
        
        this.renderedStyles = {
            tx: {previous: 0, current: 0, amt: 0.2},
            ty: {previous: 0, current: 0, amt: 0.2},
            scale: {previous: 1, current: 1, amt: 0.2},
            opacity: {previous: 1, current: 1, amt: 0.2}
        };

        this.onMouseMoveEv = () => {
            this.renderedStyles.tx.previous = this.renderedStyles.tx.current = mouse.x - this.bounds.width/2;
            this.renderedStyles.ty.previous = this.renderedStyles.ty.previous = mouse.y - this.bounds.height/2;
            gsap.to(this.DOM.el, {duration: 0.9, ease: 'Power3.easeOut', opacity: 1});
            requestAnimationFrame(() => this.render());
            window.removeEventListener('mousemove', this.onMouseMoveEv);
        };
        window.addEventListener('mousemove', this.onMouseMoveEv);
    }
    enter() {
        this.renderedStyles['scale'].current = 4;
        this.renderedStyles['opacity'].current = 0.2;
    }
    leave() {
        this.renderedStyles['scale'].current = 1;
        this.renderedStyles['opacity'].current = 1;
    }
    render() {
        this.renderedStyles['tx'].current = mouse.x - this.bounds.width/2;
        this.renderedStyles['ty'].current = mouse.y - this.bounds.height/2;

        for (const key in this.renderedStyles ) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }
                    
        this.DOM.el.style.transform = `translateX(${(this.renderedStyles['tx'].previous)}px) translateY(${this.renderedStyles['ty'].previous}px) scale(${this.renderedStyles['scale'].previous})`;
        this.DOM.el.style.opacity = this.renderedStyles['opacity'].previous;

        requestAnimationFrame(() => this.render());
    }
}

// events.js
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


//button ctrl. from magnetic buttons
//credits to: https://tympanus.net/codrops/2020/08/05/magnetic-buttons/

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => winsize = calcWinsize());

// Track the mouse position
let mousepos = {x: 0, y: 0};
window.addEventListener('mousemove', ev => mousepos = getMousePos(ev));

class ButtonCtrlSimplex extends EventEmitter {
    constructor(el) {
        super();
        console.log("ButtonCtrlSimplex");
        // DOM elements
        // el: main button
        // text/textinner: inner text elements
        this.DOM = {el: el};
        // console.log(this.DOM);
        this.DOM.text = this.DOM.el.querySelector('.button-inner-text');
        // this.DOM.textinner = this.DOM.el.querySelector('.button__text-inner');
        // amounts the button will translate
        this.renderedStyles = {
            tx: {previous: 0, current: 0, amt: 0.1},
            ty: {previous: 0, current: 0, amt: 0.1}
        };
        // button state (hover)
        this.state = {
            hover: false
        };
        // calculate size/position
        this.calculateSizePosition();
        // init events
        this.initEvents();
        // loop fn
        requestAnimationFrame(() => this.render());
    }
    calculateSizePosition() {
        // size/position
        this.rect = this.DOM.el.getBoundingClientRect();
        console.log(this.rect);
        // the movement will take place when the distance from the mouse to the center of the button is lower than this value
        this.distanceToTrigger = this.rect.width*0.7;
    }
    initEvents() {
        this.onResize = () => this.calculateSizePosition();
        window.addEventListener('resize', this.onResize);
    }
    render() {
        // calculate the distance from the mouse to the center of the button
        const distanceMouseButton = distance(mousepos.x+window.scrollX, mousepos.y+window.scrollY, this.rect.left + this.rect.width/2, this.rect.top + this.rect.height/2);
        // new values for the translations
        let x = 0;
        let y = 0;
        console.log({top: this.rect.top, dist: distanceMouseButton, trgi: this.distanceToTrigger});

        if ( distanceMouseButton < this.distanceToTrigger ) {
          console.log("enter");
            if ( !this.state.hover ) {
                this.enter();
            }
            x = (mousepos.x + window.scrollX - (this.rect.left + this.rect.width/2))*.3;
            y = (mousepos.y + window.scrollY - (this.rect.top + this.rect.height/2))*.3;
        }
        else if ( this.state.hover ) {
            this.leave();
        }

        this.renderedStyles['tx'].current = x;
        this.renderedStyles['ty'].current = y;
        
        for (const key in this.renderedStyles ) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }

        this.DOM.el.style.transform = `translate3d(${this.renderedStyles['tx'].previous}px, ${this.renderedStyles['ty'].previous}px, 0)`;
        this.DOM.text.style.transform = `translate3d(${-this.renderedStyles['tx'].previous*0.6}px, ${-this.renderedStyles['ty'].previous*0.6}px, 0)`;

        requestAnimationFrame(() => this.render());
    }
    enter() {
        this.emit('enter');
        console.log("enter");
        this.state.hover = true;
        this.DOM.el.classList.add('button--hover');

        document.body.classList.add('active');

        gsap.killTweensOf(this.DOM.textinner);

        gsap
        .timeline()
        .to(this.DOM.textinner, 0.15, {
            ease: 'Power2.easeIn',
            opacity: 0, 
            y: '-20%'
        })
        .to(this.DOM.textinner, 0.2, {
            ease: 'Expo.easeOut',
            opacity: 1, 
            startAt: {y: '100%'}, 
            y: '0%'
        });
    }
    leave() {
        this.emit('leave');
        console.log("leave");
        this.state.hover = false;
        this.DOM.el.classList.remove('button--hover');
        
        document.body.classList.remove('active');

        gsap.killTweensOf(this.DOM.textinner);
        
        gsap
        .timeline()
        .to(this.DOM.textinner, 0.15, {
            ease: 'Power2.easeIn',
            opacity: 0, 
            y: '20%'
        })
        .to(this.DOM.textinner, 0.2, {
            ease: 'Expo.easeOut',
            opacity: 1, 
            startAt: {y: '-100%'}, 
            y: '0%'
        });
    }
}

class ButtonCtrlRounded extends EventEmitter {
    constructor(el) {
        super();
        // DOM elements
        // el: main button
        // text: inner text element
        this.DOM = {el: el};
        this.DOM.text = this.DOM.el.querySelector('.button__text');
        this.DOM.textinner = this.DOM.el.querySelector('.button__text-inner');
        this.DOM.arrow = this.DOM.el.querySelector('.button__arrow');
        this.DOM.filler = this.DOM.el.querySelector('.button__filler');
        // amounts the button will translate
        this.renderedStyles = {
            tx: {previous: 0, current: 0, amt: 0.1},
            ty: {previous: 0, current: 0, amt: 0.1},
        };
        // button state (hover)
        this.state = {
            hover: false
        };
        // calculate size/position
        this.calculateSizePosition();
        // init events
        this.initEvents();
        // loop fn
        requestAnimationFrame(() => this.render());
    }
    calculateSizePosition() {
        // size/position
        this.rect = this.DOM.el.getBoundingClientRect();
        // the movement will take place when the distance from the mouse to the center of the button is lower than this value
        this.distanceToTrigger = this.rect.width*0.7;
    }
    initEvents() {
        this.onResize = () => this.calculateSizePosition();
        window.addEventListener('resize', this.onResize);
    }
    render() {
        // calculate the distance from the mouse to the center of the button
        const distanceMouseButton = distance(mousepos.x+window.scrollX, mousepos.y+window.scrollY, this.rect.left + this.rect.width/2, this.rect.top + this.rect.height/2);
        // new values for the translations
        let x = 0;
        let y = 0;

        if ( distanceMouseButton < this.distanceToTrigger ) {
            if ( !this.state.hover ) {
                this.enter();
            }
            x = (mousepos.x + window.scrollX - (this.rect.left + this.rect.width/2))*.3;
            y = (mousepos.y + window.scrollY - (this.rect.top + this.rect.height/2))*.3;
        }
        else if ( this.state.hover ) {
            this.leave();
        }

        this.renderedStyles['tx'].current = x;
        this.renderedStyles['ty'].current = y;
        
        for (const key in this.renderedStyles ) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }

        this.DOM.el.style.transform = `translate3d(${this.renderedStyles['tx'].previous}px, ${this.renderedStyles['ty'].previous}px, 0)`;
        this.DOM.text.style.transform = `translate3d(${-this.renderedStyles['tx'].previous*0.6}px, ${-this.renderedStyles['ty'].previous*0.6}px, 0)`;

        requestAnimationFrame(() => this.render());
    }
    enter() {
        this.emit('enter');
        this.state.hover = true;
        this.DOM.el.classList.add('button--hover');
        document.body.classList.add('active');

        gsap.killTweensOf(this.DOM.filler);
        gsap.killTweensOf(this.DOM.textinner);

        gsap
        .timeline()
        .to(this.DOM, 0.1, {
            ease: 'Power3.easeOut',
            borderTopWidth:10,
        })
        .to(this.DOM.filler, 0.5, {
            ease: 'Power3.easeOut',
            startAt: {y: '75%'},
            y: '0%'
        })
        .to(this.DOM.textinner, 0.1, {
            ease: 'Power3.easeOut',
            opacity: 0, 
            y: '-10%'
        }, 0)
        .to(this.DOM.arrow, 0.1, {
            ease: 'Power3.easeOut',
            opacity: 0, 
            y: '-10%'
        }, 0)
        .to(this.DOM.textinner, 0.25, {
            ease: 'Power3.easeOut',
            opacity: 1, 
            startAt: {y: '30%', opacity: 1}, 
            y: '0%'
        }, 0.1)
        .to(this.DOM.arrow, 0.25, {
            ease: 'Power3.easeOut',
            opacity: 1, 
            startAt: {y: '30%', opacity: 1}, 
            y: '0%'
        }, 0.1);

    }
    leave() {
        this.emit('leave');
        this.state.hover = false;
        this.DOM.el.classList.remove('button--hover');
        document.body.classList.remove('active');

        gsap.killTweensOf(this.DOM.filler);
        gsap.killTweensOf(this.DOM.textinner);
        
        gsap
        .timeline()
        .to(this.DOM.filler, 0.4, {
            ease: 'Power3.easeOut',
            y: '-75%'
        })
        .to(this.DOM.textinner, 0.1, {
            ease: 'Power3.easeOut',
            opacity: 0, 
            y: '10%'
        }, 0)
        .to(this.DOM.textinner, 0.25, {
            ease: 'Power3.easeOut',
            opacity: 1, 
            startAt: {y: '-30%', opacity: 1}, 
            y: '0%'
        }, 0.1);
    }
}

class ButtonCtrlCircles extends EventEmitter {
    constructor(el) {
        super();
        // DOM elements
        // el: main button
        // text: inner text element
        this.DOM = {el: el};
        this.DOM.text = this.DOM.el.querySelector('.button__text');
        this.DOM.textinner = this.DOM.el.querySelector('.button__text-inner');
        this.DOM.decoTop = this.DOM.el.querySelector('.button__deco--1');
        this.DOM.decoBottom = this.DOM.el.querySelector('.button__deco--2');
        // amounts the button will translate/scale
        this.renderedStyles = {
            tx: {previous: 0, current: 0, amt: 0.1},
            ty: {previous: 0, current: 0, amt: 0.1},
            tx2: {previous: 0, current: 0, amt: 0.05},
            ty2: {previous: 0, current: 0, amt: 0.05}
        };

        // button state (hover)
        this.state = {
            hover: false
        };
        // calculate size/position
        this.calculateSizePosition();
        // init events
        this.initEvents();
        // loop fn
        requestAnimationFrame(() => this.render());
    }
    calculateSizePosition() {
        // size/position
        this.rect = this.DOM.el.getBoundingClientRect();
        // the movement will take place when the distance from the mouse to the center of the button is lower than this value
        this.distanceToTrigger = this.rect.width*1.5;
    }
    initEvents() {
        this.onResize = () => this.calculateSizePosition();
        window.addEventListener('resize', this.onResize);
    }
    render() {
        // calculate the distance from the mouse to the center of the button
        const distanceMouseButton = distance(mousepos.x+window.scrollX, mousepos.y+window.scrollY, this.rect.left + this.rect.width/2, this.rect.top + this.rect.height/2);
        // new values for the translations and scale
        let x = 0;
        let y = 0;

        if ( distanceMouseButton < this.distanceToTrigger ) {
            if ( !this.state.hover ) {
                this.enter();
            }
            x = (mousepos.x + window.scrollX - (this.rect.left + this.rect.width/2))*.3;
            y = (mousepos.y + window.scrollY - (this.rect.top + this.rect.height/2))*.3;
        }
        else if ( this.state.hover ) {
            this.leave();
        }

        this.renderedStyles['tx'].current = this.renderedStyles['tx2'].current = x;
        this.renderedStyles['ty'].current = this.renderedStyles['ty2'].current = y;
        
        for (const key in this.renderedStyles ) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }
        
        this.DOM.decoTop.style.transform = `translate3d(${this.renderedStyles['tx'].previous}px, ${this.renderedStyles['ty'].previous}px, 0)`;
        this.DOM.decoBottom.style.transform = `translate3d(${this.renderedStyles['tx2'].previous}px, ${this.renderedStyles['ty2'].previous}px, 0)`;
        this.DOM.text.style.transform = `translate3d(${this.renderedStyles['tx'].previous*0.5}px, ${this.renderedStyles['ty'].previous*0.5}px, 0)`;

        requestAnimationFrame(() => this.render());
    }
    enter() {
        this.emit('enter');
        this.state.hover = true;

        this.DOM.el.classList.add('button--hover');
        document.body.classList.add('active');
        
        gsap.killTweensOf(document.body);
        gsap.killTweensOf(this.DOM.textinner);

        gsap
        .timeline()
        // .to(document.body, 0.2, {backgroundColor: '#000'})
        .to(this.DOM.textinner, 0.1, {
            ease: 'Power3.easeOut',
            opacity: 0, 
            y: '-10%'
        }, 0)
        .to(this.DOM.textinner, 0.2, {
            ease: 'Expo.easeOut',
            opacity: 1, 
            startAt: {y: '20%'}, 
            y: '0%'
        });
    }
    leave() {
        this.emit('leave');
        this.state.hover = false;

        this.DOM.el.classList.remove('button--hover');
        document.body.classList.remove('active');
        
        gsap.killTweensOf(document.body);
        gsap.killTweensOf(this.DOM.textinner);

        gsap
        .timeline()
        // .to(document.body, 0.2, {backgroundColor: bodyColor})
        .to(this.DOM.textinner, 0.1, {
            ease: 'Power3.easeOut',
            opacity: 0, 
            y: '10%'
        }, 0)
        .to(this.DOM.textinner, 0.2, {
            ease: 'Expo.easeOut',
            opacity: 1, 
            startAt: {y: '-20%'}, 
            y: '0%'
        });
    }
}

var vw = window.innerWidth;
var vh = window.innerHeight;
var mobileWidth = 478;
var pad = 26;
var minWidth = vw * 0.19;
var maxWidth = vw * 0.29;
var bubbleHeight = minWidth;
var itemNames = ['software', 'coaching', 'workspace', 'infrastructure']; 

var bubbles = [];

var symnames = {'M':'workspace', 'X':'software', 'O':'coaching', 'A':'infrastructure'};
var symposes = ['top', 'left'];
var symbolmap = [{img: 'L1270973-Caro', o: {x: '25%', y: '17%'}}, {img: 'other img', o: {x: '25%', y: '17%'}}];
document.addEventListener('DOMContentLoaded', (event) => {

    var containers = document.querySelectorAll('.sym-container');
    if (containers.length) {
        for (var c = 0; c < containers.length; c++) {
          var parent = containers[c];
          // get background-images out of container
          var imgs = parent.querySelectorAll('img.bg-image');
          
          console.log(imgs);
          imgs.forEach(img => {
            var filename = img.src.split("/").pop();
            console.log(filename);
            symbolmap.forEach(sym => {
              if(filename.includes(sym.img)) {
                console.log('match: ' + sym.img);
              } else {
                console.log('nomatch: ' + sym.img);
              }
            });
          });
          if(vw <= mobileWidth) {
            // go for the smaller version
          }
            // console.log('next run');
            bubbles = [];
            // random sort items
            // fisherYatesShuffle(itemNames);
            // @todo: remove items or double ones
            
            if(parent.dataset.symorder && parent.dataset.sympos) {
              /*var items = parent.dataset.symorder.split(' ');
              var positions = parent.dataset.sympos.split(';');
              var cnt = 0;
              items.forEach(id => {
                var els = parent.querySelectorAll('.sym-competence.'+symnames[id]);
                if (els.length) {
                  for(var e = 0; e < els.length; e++) {
                    if(positions[cnt]) {
                      var pos = positions[cnt].split(',');
                      var top = pos[0];
                      var left = pos[1];
                      els[e].style.position = 'absolute';
                      els[e].style.top = top;
                      els[e].style.left = left;  
                    } else {
                      els[e].style.display = 'none';
                    }
                  }
                }
                cnt++;
              });
              console.log(positions);
              //var positions = parent.dataset.sym
              */
            } else {
              for (var i = 0; i < itemNames.length; i++) {
                  var els = parent.querySelectorAll('.sym-competence.'+itemNames[i]);
                  if (els.length) {
                    if (itemNames[i] == 'coaching') {
                      console.log("asdsoftware");
                      for(var e = 0; e < els.length; e++) {
                        els[e].style.position = 'absolute';
                        els[e].style.top = '25%';
                        els[e].style.left = '40%';  
                      }
                    }
                    //var bubble = createBubble(els);
                    //bubbles.push(bubble);
                    //placeBubble(bubble);
                  }
              }
            }
        }
    }
    (function () {
        /*const scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            getDirection: true
        });*/

        let lastKnownScrollPosition = 0;
        let ticking = false;
        let direction = false;
        const h = document.documentElement;

        function handleNavbar(scrollPos) {
          // Do something with the scroll position
          if (scrollPos > lastKnownScrollPosition) {
            direction = 'down'
          } else {
            direction = 'up'
          }
          lastKnownScrollPosition = scrollPos;

          h.classList.toggle("direction-up", direction == "up");
          h.classList.toggle("direction-down", direction == "down");
          h.classList.toggle("is-top", lastKnownScrollPosition < 100);
          h.classList.toggle("is-not-top", 100 <= lastKnownScrollPosition);
        }

        document.addEventListener('scroll', function(e) {
          if (!ticking) {
            window.requestAnimationFrame(function() {
              handleNavbar(window.scrollY);
              ticking = false;
            });
            ticking = true;
          }
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
  // bubble.width  = randomInt(minWidth, maxWidth);  
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

/** MOUSE CURSOR */
/*
const cursor = new Cursor(document.querySelector('.cursor'));

var btns = document.querySelectorAll('.button-simplex');
btns.forEach(btn => {
    const button = new ButtonCtrlSimplex(btn);
    button.on('enter', () => cursor.enter());
    button.on('leave', () => cursor.leave());
});*/

/*

document.addEventListener("DOMContentLoaded", function(event) { 
	const cursorTag = document.querySelector("div.cursor");
  const cursorText = document.querySelector(".cursor-text");
  
  const activeAreas = document.querySelectorAll("[data-cursor]");
  activeAreas.forEach(active => {
  console.log(active);
  	active.addEventListener("mouseover", function() {
    	cursorText.innerHTML = active.getAttribute("data-cursor");
    });
    active.addEventListener("mouseout", function() {
    	cursorText.innerHTML = "";
    })
  });
});
*/