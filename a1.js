// https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j

const fs                = require('fs');
const {walk_dir}        = require('dm-std-1');

let path        = 'input1.txt'
function make_regex_finder(re_str) {
    // returns closure that searches for 're_str' in 'path'
    // and output each match -- labled by the path
    return (dir, file, path)=>{
        let text        = fs.readFileSync(path)
        let re          = new RegExp(re_str, "ig");
        let m;
        while (m = re.exec(text)) {
           console.log(`${file}:  ${m[0].trim()}`)}}}

// let re_find    = make_regex_finder("[bc]+")
// re_find(path)  // works


// :DAVIS:   NEXT
//   * use path = './'
//   * get ext from argv
//   * get re_str from argv


let ext  = "js"
let re   = new RegExp(`\.${ext}$`,"i")

let re_find    = make_regex_finder("\\n.*?let.*")

walk_dir(
    'c:/sto/nodejs/my',
    (d,f,p)=>{
        console.log(`---[ ${p}`)
        re_find(d, f, p)},
    (d,f,p)=>f.match(re),
    (d,f,p)=>false)                     // prune



// "abc".match(/v/)