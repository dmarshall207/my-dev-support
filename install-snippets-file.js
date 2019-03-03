let {copy_file}     = require('./tools-01')
copy_file(
    'dm1.code-snippets',
    process.env.SnippetsDirPath,
    `${process.env.StoRoot}\\my-doc`)
