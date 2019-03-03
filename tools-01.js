let fs                  = require('fs')
function copy_file(
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
        console.log(`      dst_file_path     : ${dst_file_path}`)
        if (! fs.existsSync(src_file_path) ) {
            console.log('\nERR: file-not-found')
            console.log('    * src_file_path not found:' )
            console.log(`         * ${src_file_path}`)
            process.exit(1)}
        if (fs.existsSync(dst_file_path) ) {
            console.log('\nERR: file-already-exists')
            console.log('    * dst_file_path already exists:')
            console.log(`         * ${dst_file_path}`)
            process.exit(1)}
        fs.copyFileSync(src_file_path, dst_file_path)}

exports.copy_file                   = copy_file