let fs              = require('fs')
let cheerio         = require('cheerio')
let _               = require('underscore')

// <section>
function write_file(path, data) {
    let fd         = fs.openSync(path, 'w')
    fs.writeFileSync(fd, data)
    fs.closeSync(fd)}
// </section>

// <section>
// Update:  I'm finding instances where this does not work --
// I am suspecious that it is due to firefox dynamically adjusting
// the html/dom at load time.

// Discovery:  Firefox copy 'CSS Selector' and 'CSS Path' -- which
// require no translation --- much better approach.

// Firefox page-inspector's "copy xpath" returns a xpath of
// tag-names with sibling index values (per step) if there 
// is no 'id' attrib.  This format is translated to a jquery
// selector ...
// (:candidate  "translation of simple xpath str format to jquery selector")
function xpath_2_selector(xpath_str) {
    // let re              = /([a-z]+\[[0-9]+\])|([a-z]+)/g  // :got-ya
    let re              = /([a-z]+\[[0-9]+\])|([a-z]+)/
    let m               = 0
    let sig             = []
    let step_w_index = (step)=>{
        let re              = /([a-z]+)\[([0-9]+)\]/;
        let [, tag, i]      = re.exec(step)
        sig.push(
            // `${tag}:nth-child(${i})`
            `${tag}:nth-of-type(${i})`
        )}
    let step_wo_index = (step)=>{
        sig.push(step)}
    let steps         = xpath_str.split(/\//).slice(1)  // split on '/'
    steps.forEach((step)=>{
        let m               = re.exec(step)
        if (! m) {                              // ??? new -- uncertain
            '??-do-nothing'}
        else if (m[1])      {step_w_index(m[1])
        } else if (m[2])    {step_wo_index(m[2])}})

    return sig.join(' ')}
// </section>

// <section>
function sibling_index(e) {
    is_elm    = (it)=>{return it.type === 'tag'}                 //  <----  TURN THIS INTO A AUX FUNCTION
    if (e.parent) {
            let sibs        = e.parent.children.filter(is_elm)
            if (sibs.length > 1)     {return sibs.indexOf(e) + 1}
            else                     {return 1}}
    else {
            return 1}}
function sibling_index_by_type(e) {
    is_same_name    = (it)=>{return (it.type === 'tag' && it.name === e.name)}                 //  <----  TURN THIS INTO A AUX FUNCTION
    if (e.parent) {
            let sibs        = e.parent.children.filter(is_same_name)
            if (sibs.length > 1)     {return sibs.indexOf(e) + 1}
            else                     {return 1}}
    else {
            return 1}}
// </section>

// <section>
function elm_to_tag_index_xpath($, e) {
    let ancestors            = $(e).parents()
    let i                    = ancestors.length - 1
    let arr                  =  []                            // collect (sigma)    
    while (i > -1){
         let a          = ancestors[i]
         let n          = sibling_index_by_type(a)
         arr.push(`${a.name}[${n}]`)
         i  = i-1}
    return '/' + arr.join('/') + `/${e.name}[${sibling_index_by_type(e)}]`}
// </section>

// <section>
//      * '$_query' : performs a cheerio selector query on $ and
//        returns results and extra meta data.
function $_query($, selector) {  // = 'query_css_path'
     let sig                  = []         // sigma / results collection
     let results              = $(selector)
     let i                    = 0
     while (i < results.length) {
          let e               = results[i]
          let xpath           = elm_to_tag_index_xpath($, e)
          let match_rec =    {xpath:    xpath, 
                              elm:      e,
                              selector: xpath_2_selector(xpath)}   // my generated selector for each match
          sig.push(match_rec)
          i  = i+1}
     let results_rec  = {selector:   selector,
                         count:      sig.length,  
                         results:    results,
                         elms:       sig,}
     return results_rec}
// <section>



// ========================================================
exports.write_file                  = write_file
exports.read_file                   = fs.readFileSync

exports.xpath_2_selector            = xpath_2_selector           // see 'Update' 
// exports.indexed_xpath_steps         = indexed_xpath_steps     // obsoleted

exports.sibling_index               = sibling_index
exports.sibling_index_by_type       = sibling_index_by_type

exports.elm_to_tag_index_xpath      = elm_to_tag_index_xpath
exports.$_query              = $_query