// :d this will replace 'srch.js'

const fs                = require('fs');
const {walk_dir}        = require('dm-std-1');
const {compile_option_specs,
       parse_cmd_line}        = require('dm-std-1');

function make_regex_finder(re_str,  only_names) {
    // returns closure that searches for 're_str' in 'path'
    // and output each match -- labled by the path
    return (dir, file, path)=>{
        // console.log(`> path ${path}`)
        let text        = fs.readFileSync(path)
        let re          = new RegExp(re_str, "ig");
        let m;
        let first       = true;
        while (m = re.exec(text)) {
                if (first) {
                    console.log(`|||||||| ${path}`)
                    first    = false}
                if (only_names) {
                    return
                } else {
                    console.log(`${file}:  ${m[0].trim()}`)}}}}

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
    `)}

const args          = process.argv.slice(2)
let option_spec     = compile_option_specs({
                            // "-v"     : [0, 'verbose'],
                            "--names"   : [0, 'names_only'],
                            "-n"        : [0, 'names_only'],

                            "--ext"     : [1, 'extension'],
                            "-x"        : [1, 'extension'],

                            "--regex"   : [1, 'regex'],
                            "-r"        : [1, 'regex'],
                        
                            "--help"    : [0, 'help'],
                            "-h"        : [0, 'help'],
                        })

let [option, cmd_line]   = parse_cmd_line(option_spec, args)
// console.log(option)
// console.log(cmd_line)

if (option.help) {
    show_usage()
    process.exit()}
if ((! option.regex) || (! option.extension)) {
    show_usage()
    process.exit()}
const ext_re      = new RegExp(`\\.${option.extension}$`,"i")
const match_re    = `\\n.*?${option.regex}.*`
const finder      = make_regex_finder(match_re, option.names_only)  // closure to search a file for matches
walk_dir(
    './',
    // (d,f,p)=>{finder(d, f, p)},                           // callback - for each match
    finder,
    (d,f,p)=>f.match(ext_re),           // "want" predicate - filter
    (d,f,p)=>false)                     // "prune" - filter-not dir recusrion
