const fs                        = require('fs')

function list_dirs(evar_list) {
    const check_dir = (p)=>{
        return (fs.existsSync(`${p}`) && fs.statSync(p).isDirectory()) ? '*':'_'
    }
    for (let i = 0; i < evar_list.length; i++) {
        const evar      = evar_list[i];
        const val       = process.env[evar]
        const mrk       = check_dir(val)
        console.log(`  ${evar.padEnd(20)}: (${mrk})  ${val}`)
    }        
}
const evar_list_all =[
    "UserId", "StoRoot", "StoBin", "StoMyDoc", "StoNodejs", "StoMy", 
    "Mongo", "MongoBin", "MongoDb", "MongoLog", 
    "SnippetsDirPath", "MyEnvVars", ]
const dir_evar_list = [
    "StoRoot", "StoBin", "StoMyDoc", "StoNodejs", "StoMy", 
    "Mongo", "MongoBin", "MongoDb", "MongoLog", 
    "SnippetsDirPath"
]
console.log('\nDirectories:')
list_dirs(dir_evar_list)
console.log('\nMisc:')
console.log('  MyEnvVars:',`'${process.env.MyEnvVars}'`)
console.log()

// =====================================================================
// <section>    older code -- keep - has "ref code"
// // (:refcode  "filter env var keys")
// function list_my_env_vars() {
//     function env_keys_filter(want_re) {      // snippet 'd-env_keys_filter'
//         let all_keys    = Object.keys(process.env);
//         return all_keys.filter((s,i)=>{
//                             return s.match(want_re)})}
//     let keys        = env_keys_filter(/^Sto/)
//     keys.push('SnippetsDirPath')
//     keys.push('UserId')
//     keys.forEach((k,i)=>{
//         console.log(`${k.padEnd(20,' ')} : ${process.env[k]}`)})}
// if (! process.env.StoRoot ){
//     console.log('\nERR: environment-vars-not-set')
//     console.log('    * my stanard env vars have not been set\n')
//     console.log("$Env:StoRoot = \"c:\\sto\"")
//     console.log("$Env:MyDocRoot = \"c:\\sto\\my-doc\"")
//     console.log("$Env:StoBinRoot = \"c:\\sto\\bin\"")
//     console.log("$Env:StoMyRoot = \"c:\\sto\"")
//     console.log("$Env:SnippetsDirPath = \"C:\\Users\\User\\AppData\\Roaming\\Code\\User\\snippets\"")
//     console.log() 
//     process.exit()
// } else {
//     list_my_env_vars() }
// </section>
