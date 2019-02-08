// INITIALLY  -- copy of 'srch.js'  -- from dcm house
// will try to adapt it to ua-environment
//=== snip === snip === snip === snip === snip === 


var spawn = require("child_process").spawn,child;

// from example:
//      * https://stackoverflow.com/questions/8153750/how-to-search-a-string-in-multiple-files-and-return-the-names-of-files-in-powers
// Get-ChildItem -recurse | Get-Content | Select-String -pattern "dummy"
// Get-ChildItem -recurse | Select-String -pattern "dummy" | group path | select name

// test calls:
// Get-ChildItem -recurse -include *.js | Select-String -pattern testthis2
// Get-ChildItem -path "C:\dlm\work\try-code" -recurse -include *.js | Select-String -pattern testthis2

// my vers: srch *.js for "fs"
// Get-ChildItem *.js | Select-String -pattern "fs"
// Get-ChildItem *.js | Select-String -pattern "fs" | group path | select name

// ------[ aux 
// (:refcode "run 'powershell' command via call to 'spawn'")
function run_powershell_cmd(cmd) {
    if (! (cmd instanceof Array)) {
        throw "\nerr: 'run_powershell_cmd': CMD not an array\n\n"}
    cmd.unshift("-Command")
    child = spawn("powershell.exe",cmd);
    child.stdout.on("data",function(data){
        process.stdout.write(data)});
    child.stderr.on("data",function(data){
        process.stdout.write(`stderr: [${data}]`)});
    child.on("exit",()=>{
        process.stderr.write('_done_\n')})
    child.stdin.end()}


// ------[ config
// <sec>
//    ||  this was previous to using 'process.argv'
// let glob          = "*.js"
// let re_pat        = "fs"     // regexp match pattern
// </sec>

if (! (process.argv.length === 4 || process.argv.length === 5)) {
    console.log( process.argv );
    process.stderr.write('\nerr: requires 2 args -- can have 3:\n')
    process.stderr.write('   1)  glob pattern\n')
    process.stderr.write('   2)  regexp pattern\n')
    process.stderr.write('   3)  any value = so results as file names\n\n')
    throw "err" }
    
let args                = process.argv.slice(2)
let glob                = args[0]
let re_pat              = args[1]     // regexp match pattern

// let cmd_matches   = ["Get-ChildItem", glob, "|", "Select-String", "-pattern", re_pat]
// let cmd_matches   = ["Get-ChildItem", glob, "-recurse", "|", "Select-String", "-pattern", re_pat]
// let cmd_matches   = ["Get-ChildItem", "-recurse", "-include", glob, "|", "Select-String", "-pattern", re_pat]
let cmd_matches   = ["Get-ChildItem", 
                     //"-path", "C:\\dlm\\work\\try-code",
                    //  "-path", "C:/dlm/work/try-code",
                     "-recurse", "-include", glob, "|", "Select-String", "-pattern", re_pat]

let cmd_names     = cmd_matches.concat( 
                        ["|", "group", "path", 
                         "|", "select", "name"])

let cmd                 = "no yet set"
if (args.length === 2) {
       cmd     = cmd_matches} 
else if (args.length === 3) {
       cmd     = cmd_names}
else {
       throw "err2"}

console.log('cmd:', cmd.join(' ') );

// ------[ run 
process.stderr.write(`\nglob    : [${glob}]\n`)
process.stderr.write(`re_pat  : [${re_pat}]\n`)
process.stderr.write(`results : ...\n`)
run_powershell_cmd(cmd)


