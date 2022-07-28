import Cursor from '../../../js/cursor.js';
import {ButtonCtrlSimplex, ButtonCtrlRounded, ButtonCtrlCircles} from './buttonCtrl.js';

// initialize custom cursor
const cursor = new Cursor(document.querySelector('.cursor'));
var btns = document.querySelectorAll('.button.circles');
btns.forEach(btn => {
    const button = new ButtonCtrlCircles(btn);
    button.on('enter', () => cursor.enter());
    button.on('leave', () => cursor.leave());
});
var btns = document.querySelectorAll('.button.rounded');
btns.forEach(btn => {
    const button = new ButtonCtrlRounded(btn);
    button.on('enter', () => cursor.enter());
    button.on('leave', () => cursor.leave());
});
var btns = document.querySelectorAll('.button.simplex');
btns.forEach(btn => {
    const button = new ButtonCtrlSimplex(btn);
    button.on('enter', () => cursor.enter());
    button.on('leave', () => cursor.leave());
});



