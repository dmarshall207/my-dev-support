/* 
idea:  list all evn vars
*/


const {spawn,
    spawnSync}      = require("child_process")
const fs            = require("fs");
const powershell    = "powershell.exe"
const o             = spawnSync(powershell, ["gci env:*", '|', 'sort-object', 'name']);
console.log(`${o.stdout}`)
