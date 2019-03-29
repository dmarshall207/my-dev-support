// :d this will replace 'srch.js'

const fs                = require('fs');
const {walk_dir}        = require('dm-std-1');

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
    console.log(`
    argument postion / semantics:
       1)   'run' | 'help'  
       2)   extension(s)
       3)   regex pattern
       4)   optional:  flag to only print file names
    `)}

const args = process.argv.slice(2)
// console.log(`> ${args}`)

if ( ! ['run', 'help'].includes(args[0]) ){
    show_usage()
    process.exit()}
if (args[0] === 'help') {
    show_usage()
    process.exit()}

if (args[0] === 'run') {
    const ext_re      = new RegExp(`\\.${args[1]}$`,"i")
    const match_re    = `\\n.*?${args[2]}.*`
    const only_names  = args[3]          // flag - only output file names w/ matches
    const finder      = make_regex_finder(match_re, only_names)
    walk_dir(
        './',
        (d,f,p)=>{                           // callback - for each match
            finder(d, f, p)},
        (d,f,p)=>f.match(ext_re),           // "want" predicate - filter
        (d,f,p)=>false)                     // "prune" - filter-not dir recusrion
} else {
    show_usage()}
