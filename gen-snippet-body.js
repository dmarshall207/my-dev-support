// @:context: tool to generate snippet 'body' from file_path

/*
https://stackoverflow.com/questions/2447915/javascript-string-regex-backreferences
http://webreference.com/js/column5/values.html
*/


// ===========================================================
// require
let fs            = require('fs')

// ========================================================
// core
function backslash_dbl_quotes(s) {    // good
    // return str 's' with added '\' to double quotes chars
    return s.replace( /([""])/g, '\\$1')}    // (:refcode "use of regex back ref in replacment string")
function double_up_backslash(s) {    // good
    // return str 's' with added '\' to double quotes chars
    return s.replace( /([\\])/g, '\\\\')}

function escape_dollar_sign(s) {
    // :ISSUE : for this to be a regerious -- need to only replace if
    // the occurace is w/in a backtick string template -- consider using
    // my state-mach logic -- rather than shadowing the sting will extract
    // the string
    return s.replace( /\$/g, '\\\\$')}

function gen_snippet_body(input_path) {
    let dat     = `${fs.readFileSync(input_path)}`
    let arr     = dat.split('\n')
    let sig     = []
    let s_      = ''
    arr.forEach((s,i)=>{
        s_          = double_up_backslash(s)
        s_          = backslash_dbl_quotes(s_)
        // s_          = escape_dollar_sign(s_)   // see notes in function

        sig.push(`    "${s_.trimEnd() }",`)})
    let dat_as_snippet_body = `"body": [\n${sig.join('\n')}\n    ],`
    // fs.writeFileSync('./out.js', dat_as_snippet_body)
    console.log(dat_as_snippet_body)}
// gen_snippet_body('./input.js')

// ==========================================================
// main 
if (process.argv.length < 3) {
    console.log('\nERR : command-line : invalid format')
    console.log('   * explects: #1 arg:      input file\n')
    process.exit(1)}


let input_file_path         = process.argv[2];
// console.log(`input_file_path: ${input_file_path}`)

if (! fs.existsSync(input_file_path)){
    console.log('\nERR: input-file')
    console.log(`  * input-file not found: ${input_file_path}\n`)
    process.exit(1)}

gen_snippet_body(input_file_path)
