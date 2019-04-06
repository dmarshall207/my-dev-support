// :d this will replace 'srch.js'

const fs                = require('fs');
const {walk_dir}        = require('dm-std-1');
const {compile_option_specs,
       parse_cmd_line}        = require('dm-std-1');
// =====================================================================

// SAFE - ORIG - HAVING PROBEMS ???
// function make_regex_finder(re_str,  only_names) {
//     // returns closure that searches for 're_str' in 'path'
//     // and output each match -- labled by the path
//     return (dir, file, path)=>{
//         // console.log(`> path ${path}`)
//         let text        = fs.readFileSync(path)
//         let re          = new RegExp(re_str, "ig");
//         let m;
//         let first       = true;
//         while (m = re.exec(text)) {
//                 if (first) {
//                     console.log(`\n|||||||| ${path}`)
//                     first    = false}
//                 if (only_names) {
//                     return
//                 } else {
//                     console.log(`${file}:  ${m[0].trim()}`)}}}
// }

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

const args          = process.argv.slice(2)

// let option_spec     = compile_option_specs({
//                             // "-v"     : [0, 'verbose'],
//                             "--names"   : [0, 'names_only'],
//                             "-n"        : [0, 'names_only'],
//                             "--ext"     : [1, 'extension'],
//                             "-x"        : [1, 'extension'],
//                             "--regex"   : [1, 'regex'],
//                             "-r"        : [1, 'regex'],
//                             "--prune"   : [1, 'prune'],
//                             "-p"        : [1, 'prune'],
//                             "--help"    : [0, 'help'],
//                             "-h"        : [0, 'help'],
//                         })
let option_spec  = {
    // "-v"     : [0, 'verbose'],
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

let [option, cmd_line]   = parse_cmd_line(option_spec, args)
// console.log(option)
// console.log(cmd_line)
if (option.help) {
    show_usage()
    process.exit()}
if ((! option.regex) || (! option.extension)) {
    show_usage()
    process.exit()}

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

const ext_re        = build_spec_regex(option.extension)
const prune_re      = build_spec_regex(option.prune)
const match_re      = `\\n.*?${option.regex}.*`
const finder        = make_regex_finder(match_re, option.names_only)  // closure to search a file for matches
walk_dir(
    './',                               // root to start walk/search from
    finder,                             // callback - for each match
    (d,f,p)=>f.match(ext_re),           // "want" predicate - filter
    (d,f,p)=>{                          // prune
        if (prune_re) {
            return f.match(prune_re)} 
        else {
            return false}})
