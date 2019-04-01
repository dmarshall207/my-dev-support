const fs                    = require('fs')
const prompt                = require('prompt-sync')();


// let {copy_file}     = require('./tools-01')

function copy_file_2(
    file_name_to_copy,
    src_dir_path,
    dst_dir_path,) {
        let dst_file_name       = file_name_to_copy
        let src_file_name       = file_name_to_copy
        let dst_file_path       = `${dst_dir_path}\\${dst_file_name}`
        let src_file_path       = `${src_dir_path}\\${src_file_name}`
        console.log()
        console.log('... copying file ...')
        console.log(`      src_file_path     : ${src_file_path}`)
        console.log(`      dst_file_path     : ${dst_file_path}\n`)
        if (! fs.existsSync(src_file_path) ) {
            console.log('\nERR: file-not-found')
            console.log('    * src_file_path not found:' )
            console.log(`         * ${src_file_path}`)
            process.exit(1)}
        if (fs.existsSync(dst_file_path) ) {
            var res = prompt('already exists -- overwrite? ');
            console.log(`res ${res}`)
            if (res === 'y' || res === 'yes') {
                console.log('\n... overwriting ...')
                fs.copyFileSync(src_file_path, dst_file_path)
                console.log()} 
            else {
                console.log('\n... no action taken ...\n')
                process.exit(1)}}}


copy_file_2(
    'dm1.code-snippets',
    `${process.env.StoRoot}\\my-doc`,
    process.env.SnippetsDirPath)

// console.log('input ')
// process.stdin.read()
// console.log('_end_')

