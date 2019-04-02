/* 
:d  Hack to use raw mode and read special keys 
:d  Using this I can generate any key representation in
    a testable form (including function-keys) 
        * i.e.  this output can be used to generate code for loop control
I put this together from multiple source:
    * prompt-sync
    * https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin/8384887
        * Dan Heberden
    * https://stackoverflow.com/questions/14551608/list-of-encodings-that-node-js-supports
       * "List of encodings that Node.js supports"
*/
// <section>  'Dan Heberden' code
        // var stdin = process.stdin;
        // // without this, we would only get streams once enter is pressed
        // stdin.setRawMode( true );
        // // resume stdin in the parent process (node app won't quit all by itself
        // // unless an error or process.exit() happens)
        // stdin.resume();
        // // i don't want binary, do you?
        // stdin.setEncoding( 'utf8' );
        // // on any data into stdin
        // stdin.on( 'data', function( key ){
        // // ctrl-c ( end of text )
        // if ( key === '\u0003' ) {process.exit();}
        // // write the key to stdout all normal like
        // process.stdout.write( key );});
// </section>

let cnt   = 0
let max   = 9
var stdin = process.stdin;
stdin.setRawMode( true );
stdin.resume();
// stdin.setEncoding( 'utf8' );     // orig - from Dan-Heberden code
stdin.setEncoding( 'hex' );         // from list of encodes (above url)
function pad(v, sz) {return `${v}`.padEnd(sz)}

console.log('char      dec              hex              symbol')
stdin.on( 'data', function( hex ){
    let dec         = parseInt(hex, 16)
    let ch          = String.fromCharCode(dec)
    let sym         = (hex_2_sym[hex]) ? hex_2_sym[hex] : ''
    // console.log(hex, dec, ch, sym)
    if (dec === 13) {
        console.log(`enter    ${pad(dec,16)}  ${pad(hex,16)} ${sym}`)} 
    else if (dec === 9) {
        console.log(`tab       ${pad(dec,16)} ${pad(hex,16)} ${sym}`)}
    else {
        console.log(`${pad(ch,8)}  ${pad(dec,16)} ${pad(hex,16)} ${sym}`)}
    // console.log(` '${pad(hex,9)}' : '',`)
    // console.log(hex, hex_2_sym[hex])
    if ( hex === '03' ) { process.exit();}      // ctrl-c 
    });

let hex_2_sym = {
    '1b5b327e'      : 'INSERT',
    '1b5b317e'      : 'HOME',
    '1b5b357e'      : 'PAGE-UP',
    '1b5b337e'      : 'DELETE',
    '1b5b347e'      : 'END',
    '1b5b367e'      : 'PAGE-DOWN',
    '0d'            : 'ENTER',
    '09'            : 'TAB',
    '1b5b5b41'      : 'F1',
    '1b5b5b42'      : 'F2',
    '1b5b5b43'      : 'F3',
    '1b5b5b44'      : 'F4',
    '1b5b5b45'      : 'F5',
    '1b5b31377e'    : 'F6',
    '1b5b31387e'    : 'F7',
    '1b5b31397e'    : 'F8',
    '1b5b32307e'    : 'F9',
    '1b5b32317e'    : 'F10',
    '1b5b32337e'    : 'F11',
    '1b5b32347e'    : 'F12',
    '1b'            : 'ESC',
    '1b5b44'        : 'LEFT',
    '1b5b43'        : 'RIGHT',
    '1b5b41'        : 'UP',
    '1b5b42'        : 'DOWN' ,
}

