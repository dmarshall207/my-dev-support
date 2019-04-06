const  {walk_dir,
        parse_cmd_line,
        }                       = require('dm-std-1')

function show_usage() {
    console.log(`
Usage:
        <cmd>  <args/opts>
    `)
    process.exit();
}
const opt = parse_cmd_line(
                {
                    // '-p' : [1, 'prune'],
                    '-html' : [0, 'html']
                },)
// :d - may need to fix/adjust path sperator chars
function show_match(d,f,p) {
    if (opt.html)   {console.log(`<a href="${p}">${p}</a>`)}
     else           {console.log(`${p}`)}
}
function search_file(path, re_str) {
    walk_dir(path,
            show_match,
            (d,f,p)=>f.match(re_str),
            //  (d,f,p)=>{if (opt.prune) {return f.match(opt.prune)}
            //            else           {return false}}
             )
}
search_file(process.env.StoMy, 'meta')


