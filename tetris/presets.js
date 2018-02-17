/**
 * A Simple jet lovely Tetris-Clone done with p5 :)
 * 
 * Author: Sven Weinstein
 * Email: sven.weinstein (at) gmail.com
 * https://github.com/winest0ne
 */

let tSpinSetup = [[0,0,0,0,0,0,1,1,0,0],
                  [1,1,1,1,0,0,0,1,1,1],
                  [1,1,1,1,0,0,1,1,1,1],];
let doubleTSpinSetup = [[0,0,0,0,0,0,1,1,0,0],
                        [1,1,1,1,0,0,0,1,1,1],
                        [1,1,1,1,1,0,1,1,1,1],];


function injectArray(target, source){
    let tl = target.length;
    let sl = source.length;
    for(let i = 0; i < sl; i++ ) {
        target[tl - i -1 ] = source[sl - i - 1].slice(0);
    }
}