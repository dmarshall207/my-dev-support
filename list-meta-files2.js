/* 
    * init a copy+ of 'src3'

    * expl this as a new foundation for tools ...

    * this is turning into a replacment for 'list-meta-file' it
        * does the same thing but generates html files/links

*/

let fs                      = require('fs')

//===================================================
// aux
function path_dir(p) {
    let p_ar    = p.split('/')
    return p_ar.slice(0, p_ar.length-1).join('/')}

//===================================================
// :LESSON : node command line passes .... replacse ','
//  with space if there is not quotes around the list
function build_spec_regex(raw) {
    function build_or_regex(ext_list) {
        let ar  = ext_list.map((s)=>`\\.${s}`)
        return new RegExp( ar.join('|'), 'i')
    }
    let re                  = false
    if (! raw) {
        return false}
    let has_comma           = raw.match(',')
    let has_space           = raw.match(' ')
    if (has_comma && has_space) {
        console.log('\nERR:  oops  both commas and spaces -- ambigious situation')
        process.exit()
    } else if (has_comma) {
        re    = build_or_regex( raw.split(',') )
    } else if (has_space) {
        re    = build_or_regex( raw.split(' ') )
    } else {
        re    = new RegExp(raw)
    }
    return re 
}
//====================================================
let {parse_cmd_line}        = require('dm-std-1')
let option_spec  = {
    // "-v"        : [0, 'verbose'],
    "--prune"           : [1, 'prune'],
    "-p"                : [1, 'prune'],
    "--help"            : [0, 'help'],
    "-h"                : [0, 'help'],
    "--gen-index-1"     : [0, 'gen-index-1'],

}
let option          = parse_cmd_line(option_spec, process.argv.slice(2))

//==============================================
// const ext_re        = build_spec_regex(option.extension)
const prune_re      = build_spec_regex(option.prune)
// const match_re      = `\\n.*?${option.regex}.*`
// const finder        = make_regex_finder(match_re, option.names_only)  // closure to search a file for matches

//====================================================
function walk_dir(
    dir,               // dir path
    callback,          // callback for each file -- subdirs are files
    want,              // optional predicate to filter 'callback' calls
    prune,             // optional predicate to block recursive call
    state='on'
    ) {
    let trace = (dir, file, path)=>{
        if (state === 'on') {
            // console.log('on  ',path)
        } else if (state === 'off') {
            console.log('off  ',path)
        } else {
            process.stdout.write('wtf --exit--\n'); process.exit();}}
    fs.readdirSync(dir).forEach(file => {
            let path                = `${dir}/${file}`
            // if (! want || want(dir, file, path)){  // ORIG
            // trace(dir, file, path)
            if ( (state === 'on')  && (! want || want(dir, file, path))) {
                    callback(dir, file, path)
            }
            if (fs.statSync(path).isDirectory()){
                    let has_prune_flag      = fs.existsSync(`${path}/@prune`)
                    let has_graft_flag      = fs.existsSync(`${path}/@graft`)
                    
                    if (has_prune_flag && has_graft_flag) {
                            console.log(`\nERR: both 'has_prune_flag' 'has_graft_flag'`)
                            process.exit();}
                    if (has_prune_flag){
                                walk_dir(path, callback, want, prune, 'off')
                    } else if (has_graft_flag){
                                walk_dir(path, callback, want, prune, 'on')
                    } else if (prune && prune(dir, file, path)) {
                                // ?? design?? : don't decend at all ??
                    } else{
                                walk_dir(path, callback, want, prune, state)
                    }
        }
            })
        }

let sig                 = ['<pre>']
function sigma(str)     {sig.push(str)}

function do_walk_dir(root_dir) {
    let cur_dir         = ''
    walk_dir(
        root_dir,            // process.env.StoMy,
        (d,f,p)=>{ 
            sigma(`${path_dir(p).padEnd(40)} <a href="file://${p}">${f}</a>`)
            let dir     = path_dir(p)
            if (! (cur_dir === dir)) { 
                sigma('')
                cur_dir = dir} },
        (d,f,p)=>{return  f.match('meta') },             // want predicate
        (d,f,p)=>{                                       // prune
                    let has_prune_flag  = fs.existsSync(`${p}/@prune`)
                    if (has_prune_flag)     {return true}
                    else if (prune_re)      {return f.match(prune_re)} 
                    else                    {return false}} 
        )
}

if (option['gen-index-1']) {
    do_walk_dir(process.env.StoMy) 
    fs.writeFileSync(`${process.env.StoMy}/meta-index.html`,sig.join('\n'))
} else {
    do_walk_dir(process.env.StoMy) 
    console.log(sig.join('\n'))
}
