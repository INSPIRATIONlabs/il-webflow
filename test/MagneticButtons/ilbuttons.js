import Cursor from '../../../js/cursor.js';
import ButtonCtrl from './buttonCtrl.js';

// initialize custom cursor
const cursor = new Cursor(document.querySelector('.cursor'));
var btns = document.querySelectorAll('.button');
btns.forEach(btn => {
    const button = new ButtonCtrl(btn);
    button.on('enter', () => cursor.enter());
    button.on('leave', () => cursor.leave());
});



