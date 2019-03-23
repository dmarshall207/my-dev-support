// (:refcode  "filter env var keys")
function list_my_env_vars() {
    function env_keys_filter(want_re) {      // snippet 'd-env_keys_filter'
        let all_keys    = Object.keys(process.env);
        return all_keys.filter((s,i)=>{
                            return s.match(want_re)})}
    let keys        = env_keys_filter(/^Sto/)
    keys.push('SnippetsDirPath')
    keys.push('UserId')
    keys.forEach((k,i)=>{
        console.log(`${k.padEnd(20,' ')} : ${process.env[k]}`)})}

if (! process.env.StoRoot ){
    console.log('\nERR: environment-vars-not-set')
    console.log('    * my stanard env vars have not been set\n')
    console.log("$Env:StoRoot = \"c:\\sto\"")
    console.log("$Env:MyDocRoot = \"c:\\sto\\my-doc\"")
    console.log("$Env:StoBinRoot = \"c:\\sto\\bin\"")
    console.log("$Env:StoMyRoot = \"c:\\sto\"")
    console.log("$Env:SnippetsDirPath = \"C:\\Users\\User\\AppData\\Roaming\\Code\\User\\snippets\"")
    console.log() 
    process.exit()
} else {
    list_my_env_vars() }
