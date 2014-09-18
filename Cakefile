exec = require("child_process").exec

dest = "js/main.js"

files=[
  "js/giraf.coffee"
  "js/giraf/footage.coffee"
  "js/giraf/main.coffee"
]

task "build", "Compile CoffeeScript files", ->
  command = "coffee -cj #{dest} #{files.join ' '}"
  console.log command
  exec command, (err, stdout, stderr)->
    throw err if err
    console.log stdout if stdout
    console.log stderr if stderr
