import {EventEmitter} from '../../../js/events.js';
import { lerp, getMousePos, calcWinsize, distance } from '../../../js/utils.js';

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => winsize = calcWinsize());

// Track the mouse position
let mousepos = {x: 0, y: 0};
window.addEventListener('mousemove', ev => mousepos = getMousePos(ev));

export class ButtonCtrlSimplex extends EventEmitter {
    constructor(el) {
        super();
        // DOM elements
        // el: main button
        // text/textinner: inner text elements
        this.DOM = {el: el};
        this.DOM.text = this.DOM.el.querySelector('.button__text');
        this.DOM.textinner = this.DOM.el.querySelector('.button__text-inner');
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

export class ButtonCtrlRounded extends EventEmitter {
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


export class ButtonCtrlCircles extends EventEmitter {
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