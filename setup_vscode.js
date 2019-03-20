let fs              = require('fs')

function install_my_code_snippets(
        src_dir_path,
        dst_dir_path,
        snippet_files) {
    // logic to install dm1.code-snippets
    let valid           = []
    let not_valid       = []
    snippet_files.forEach(file => {   // pre-flight check
        let src_file_path   = `${src_dir_path}\\${file}`
        let dst_file_path   = `${dst_dir_path}\\${file}`
        let dst_exists      = fs.existsSync(dst_file_path)
        let src_exists      = fs.existsSync(src_file_path)
        console.log(`f ${file}  : ${src_exists}  : ${dst_exists}`)
        if (src_exists && ! dst_exists)  {valid.push(file)} 
        else                             {not_valid.push(file)}})
    if (not_valid.length > 0) {
        console.log(`\noops - invalid copy request encountered:`)
        console.log(`  count: ${not_valid.length}`)
        console.log(`  files:`)
        not_valid.forEach(f => {console.log(`     * '${f}'`)})
        console.log()}
    else {
        console.log('... copying snippet files ....')
        valid.forEach(file => {
            let src_file_path   = `${src_dir_path}\\${file}`
            let dst_file_path   = `${dst_dir_path}\\${file}`
            console.log(`...     file: '${file}'`)
            console.log(`${dst_file_path}`)
            fs.copyFileSync(src_file_path, dst_file_path)})}}g
install_my_code_snippets(
    `${process.env.StoRoot}\\my-doc`,    // 'c:/sto/my-doc'
    process.env.SnippetsDirPath,         // "C:\Users\public$($Env:UserId)\AppData\Roaming\Code\User\snippets"
    ['dm1.code-snippets'])


