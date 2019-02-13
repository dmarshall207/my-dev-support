// INITIALLY  -- copy of 'srch.js'  -- from dcm house
// will try to adapt it to ua-environment
//=== snip === snip === snip === snip === snip === 


var spawn               = require("child_process").spawn,child;
// var _                   = require("underscore");

// from example:
//      * https://stackoverflow.com/questions/8153750/how-to-search-a-string-in-multiple-files-and-return-the-names-of-files-in-powers
// Get-ChildItem -recurse | Get-Content | Select-String -pattern "dummy"
// Get-ChildItem -recurse | Select-String -pattern "dummy" | group path | select name


// (:refcode "run 'powershell' command via call to 'spawn' -- w/o Promise")
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

// (:refcode "run 'powershell' command via call to 'spawn' -- w/ Promise")
function run_powershell_cmd_2(cmd) {
    return new Promise((resolve, reject) => {
        let sig         = [];
        let handle_stdout  = (data)=>{
            process.stdout.write(data)
            sig.push(`${data}`)}
        let handle_stderr  = (data)=>{
            process.stderr.write(`err: ${data}`)}
        let handle_exit  = ()=>{
            process.stderr.write('_done_\n')
            resolve(sig)}           // :key -- causes 'await' return
        if (! (cmd instanceof Array)) {
            throw "\nerr: 'run_powershell_cmd': CMD not an array\n\n"}
        cmd.unshift("-Command")
        child = spawn("powershell.exe",cmd);
        child.stdout.on("data", handle_stdout)
        child.stderr.on("data", handle_stderr)
        child.on(       "exit", handle_exit)
        child.stdin.end()})}             // ????


function check_cmd_line() {
    if (! (process.argv.length === 4 || process.argv.length === 5)) {
        console.log( process.argv );
        process.stderr.write('\nerr: requires 2 args -- can have 3:\n')
        process.stderr.write('   1)  glob pattern\n')
        process.stderr.write('   2)  regexp pattern\n')
        process.stderr.write('   3)  any value = so results as file names\n\n')
        throw "err" }}

function build_cmd(args) {
    let cmd                 = false
    let [glob, re_pat]      = args.slice(0,2)
    if (args.length === 2) {           // display file-name + match line
            cmd     = ["Get-ChildItem", 
                       "-recurse", "-include", `'${glob}'`, 
                       "|", "Select-String", "-pattern", `'${re_pat}'`]}
    else if (args.length === 3) {     // display file-name only
            cmd     = ["Get-ChildItem", 
                       "-recurse", "-include", `'${glob}'`, 
                       "|", "Select-String", "-pattern", `'${re_pat}'`,
                       "|", "group", "path", 
                       "|", "select", "name"]}
    else { throw "err - 'build_cmd'"}
    return cmd}

let cmd                 = build_cmd( process.argv.slice(2) )
let cmd_str             = cmd.join(' ')
let args                = process.argv.slice(2)
let [glob, re_pat]      = args.slice(0,2)
process.stderr.write(`\ncmd     : ${cmd_str}\n`)
process.stderr.write(`glob    : [${glob}]\n`)
process.stderr.write(`re_pat  : [${re_pat}]\n`)
process.stderr.write(`results : ...\n`);

// run_powershell_cmd(cmd)                          // call ver setup w/o Promise
(async ()=>{                                        // call ver setup w/ Promise
    let r    = await run_powershell_cmd_2(cmd)})();


