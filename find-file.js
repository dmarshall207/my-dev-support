const  {walk_dir,
        parse_cmd_line,
        }                       = require('dm-std-1')
function show_usage() {
    console.log(`
Usage:
        find-file
            -r          : regexp - match name
            -p          : regexp - match dir-names to skip
            -path       : alt path for search - default is current dir
    `)
    process.exit();
}
const opt = parse_cmd_line(
                {'-r' : [1, 'regex'],
                 '-p' : [1, 'prune'],
                 '-path' : [1, 'path']
                },)
function search_file(path, re_str) {
    walk_dir(path,
             (d,f,p)=>{console.log(`p" ${p}`)},
             (d,f,p)=>f.match(re_str),
             (d,f,p)=>{if (opt.prune) {return f.match(opt.prune)}
                       else           {return false}}
             )
}
if (! opt.regex) {
    show_usage()
}
if (opt.path)   {search_file(opt.path, opt.regex)
} else          {search_file('./', opt.regex)}
