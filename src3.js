/* 
    This logic (mine) is explr for an alt ver of 'walk_dir' to allow for a new
    feature -- '@prune' occurances will still decend into the dir but turn
    'want' off -- to skip -- util a '@graft' is incountered -- will then
    turn collection back on.
*/

let fs                      = require('fs')

//======================================================
function show_usage() {
    // console.log(`
    // argument postion / semantics:
    //    1)   'run' | 'help'  
    //    2)   extension(s)
    //    3)   regex pattern
    //    4)   optional:  flag to only print file names
    // `)
    console.log(`
    --help, -h         : help 
    --names, -n        : flag : only print file names w/ matches
    --ext, -x          : file extension to search
    --regex, -r        : regex for matches
    --prune, -p        : regex for skip subdirs - by name
    `)}

//===============================================
function make_regex_finder(re_str,  only_names) {
    // returns closure that searches for 're_str' in 'path'
    // and output each match -- labled by the path
    return (dir, file, path)=>{
        // console.log('xxxxx',path)
        if (fs.statSync(path).isDirectory()){
            // not a file --- how did this work before ???
        } else {
            let text        = fs.readFileSync(path)
            let re          = new RegExp(re_str, "ig");
            let m;
            let first       = true;
            while (m = re.exec(text)) {
                    if (first) {
                        console.log(`\n|||||||| ${path}`)
                        first    = false}
                    if (only_names) {
                        return
                    } else {
                        console.log(`${file}:  ${m[0].trim()}`)}}}
    }
}
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
    "--names"   : [0, 'names_only'],
    "-n"        : [0, 'names_only'],
    "--ext"     : [1, 'extension'],
    "-x"        : [1, 'extension'],
    "--regex"   : [1, 'regex'],
    "-r"        : [1, 'regex'],
    "--prune"   : [1, 'prune'],
    "-p"        : [1, 'prune'],
    "--help"    : [0, 'help'],
    "-h"        : [0, 'help'],
}
let option          = parse_cmd_line(option_spec, process.argv.slice(2))

//====================================================
// must have both --ext and --regexp
if (option.help) {
    show_usage()
    process.exit()}
if ((! option.regex) || (! option.extension)) {
    show_usage()
    process.exit()}

//==============================================
const ext_re        = build_spec_regex(option.extension)
const prune_re      = build_spec_regex(option.prune)
const match_re      = `\\n.*?${option.regex}.*`
const finder        = make_regex_finder(match_re, option.names_only)  // closure to search a file for matches

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
walk_dir(
    './',                               // root to start walk/search from
    finder,                             // callback - for each match
    (d,f,p)=>f.match(ext_re),           // "want" predicate - filter
    (d,f,p)=>{                          // prune
                let has_prune_flag  = fs.existsSync(`${p}/@prune`)
                if (has_prune_flag)     {return true}
                else if (prune_re)      {return f.match(prune_re)} 
                else                    {return false}} )
