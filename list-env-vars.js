/* 
list all evn vars
*/

const fs       = require('fs')
let r          = process.env
for (var k in process.env) {
    if (process.env.hasOwnProperty(k)) {
        let v       = process.env[k];
        console.log(`${k}`.padStart(30), `|`, v)
    }}


// const {spawn,
//        spawnSync}   = require("child_process")
// const fs            = require("fs");
// const powershell    = "powershell.exe"
// const r             = spawnSync(powershell, ["gci env:*", '|', 'sort-object', 'name']);
// console.log(`${r.stdout}`)
