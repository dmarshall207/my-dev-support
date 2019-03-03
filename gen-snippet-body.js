// @:context: eplr gen of snippet 'body'
/*
https://stackoverflow.com/questions/2447915/javascript-string-regex-backreferences
http://webreference.com/js/column5/values.html
*/

let fs            = require('fs')
function backslash_dbl_quotes(s) {    // good
    // return str 's' with added '\' to double quotes chars
    return s.replace( /([""])/g, '\\$1')}
function gen_snippet_body(input_path) {
    let dat     = `${fs.readFileSync(input_path)}`
    let arr     = dat.split('\n')
    let sig     = []
    arr.forEach((s,i)=>{
        let s_          = backslash_dbl_quotes(s)
        sig.push(`"    ${s_.trimEnd() }",`)})
    let dat_as_snippet_body = `body: [\n${sig.join('\n')}\n]`
    // fs.writeFileSync('./out.js', dat_as_snippet_body)
    console.log(dat_as_snippet_body)}
gen_snippet_body('./input.js')
