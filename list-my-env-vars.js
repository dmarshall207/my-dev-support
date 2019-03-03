// (:refcode  "filter env var keys")
function list_my_env_vars() {
    function env_keys_filter(want_re) {      // snippet 'd-env_keys_filter'
        let all_keys    = Object.keys(process.env);
        return all_keys.filter((s,i)=>{
                            return s.match(want_re)})}
    let keys        = env_keys_filter(/^Sto/)
    keys.push('SnippetsDirPath')
    keys.forEach((k,i)=>{
        console.log(`${k.padEnd(20,' ')} : ${process.env[k]}`)})}
list_my_env_vars()
