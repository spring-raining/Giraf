# refer: https://github.com/twilson63/cakefile-template/blob/master/Cakefile

jsDir = "js"

ignoreDirs = [
  "lib"
]

tailScript =
"""
app = new Giraf.App
app.run()
"""

destFile = "js/main"

fs = require "fs"
path = require "path"
util = require "util"
{spawn, exec} = require "child_process"

try
  which = require('which').sync
catch err
  if process.platform.match(/^win/)?
    console.log 'WARNING: the which module is required for windows\ntry: npm install which'
  which = null

# ANSI Terminal Colors
bold = '\x1b[0;1m'
green = '\x1b[0;32m'
reset = '\x1b[0m'
red = '\x1b[0;31m'

option "-m", "--map", "generate source map and save as .map files"

#
# Tasks
#

task 'build', 'compile source', (options) ->
  build false, (-> log "Compile successful :-)", green), useMapping: useMapping = options.map

task 'watch', 'compile and watch', (options) ->
  watchAndBuild (-> log ":-)", green), useMapping: useMapping = options.map

task 'test', 'run tests', -> build -> mocha -> log ":)", green

#
# Internal Functions
#

log = (message, color, explanation) -> console.log color + message + reset + ' ' + (explanation or '')

launch = (cmd, options=[], callback) ->
  cmd = which(cmd) if which
  app = spawn cmd, options
  app.stdout.pipe(process.stdout)
  app.stderr.pipe(process.stderr)
  app.on 'exit', (status) ->
    if status is 0
      callback()
    else
      log "Compile failed", red

coffeeInDir = (dir) ->
  coffeeRe = /^([^\.].*)\.coffee$/
  files = fs.readdirSync dir
  rtn = {}

  return null if dir in ignoreDirs.map (e) ->
    return path.join jsDir, e

  for f in files
    joinf = path.join dir, f
    if fs.statSync(joinf).isDirectory()
      d = coffeeInDir joinf
      rtn[f] = d if d? and Object.keys(d).length
    else
      continue if joinf in ignoreDirs.map (e) ->
        return path.join jsDir, e
      continue if joinf is "#{destFile}.coffee"
      match = f.match coffeeRe
      rtn[match[1]] = null if match?
  return rtn

enumerateClasses = (obj, prefix) ->
  reformat = (obj) ->
    rtn = {}
    for k, v of obj
      sp = k.split('.')
      post = sp.slice(1).join('.')
      if sp.length > 1
        ob = {}
        ob[sp.slice(1).join('.')] = v
        rtn[sp[0]] = reformat(ob)
      else
        if v? and typeof v is 'object'
          rtn[k] = reformat(v)
        else if v is null
          rtn[k] = v
    return if Object.keys(rtn).length then rtn else null

  joinDot = (prefix, suffix) ->
    toUpper = (str) ->
      return str.substr(0,1).toUpperCase() + str.substr(1)

    return if prefix? then (prefix + '.' + toUpper(suffix)) else toUpper(suffix)

  rtn = []
  for k, v of reformat(obj)
    if v? and typeof v is 'object'
      rtn.push joinDot(prefix, k)
      arr = enumerateClasses v, joinDot(prefix, k)
      rtn = rtn.concat arr
    else if v is null
      rtn.push joinDot(prefix, k)
  return rtn

enumerateFiles = (obj, dir) ->
  rtn = []
  for k, v of obj
    if v? and typeof v is 'object'
      arr = enumerateFiles v, path.join(dir, k)
      rtn = rtn.concat arr
    else if v is null
      rtn.push path.join(dir, k) + '.coffee'
  return rtn

build = (watch, callback, {useMapping} = {}) ->
  coffees = coffeeInDir jsDir

  firstScript = enumerateClasses(coffees).map (e) ->
    return "#{e} = {} unless #{e}?\n"
  .join("")

  fs.writeFile "#{destFile}.coffee", firstScript, (err) ->
    throw err if err

    for filename in enumerateFiles(coffees, jsDir)
      buf = fs.readFileSync filename
      fs.appendFileSync "#{destFile}.coffee", "\n\n# #{filename}\n\n" + buf
    fs.appendFileSync "#{destFile}.coffee", "\n\n" + tailScript

    useMapping ?= false
    if typeof watch is 'function'
      callback = watch
      watch = false

    options = ['-c', "#{destFile}.coffee"]
    options.unshift '-m' if useMapping
    options.unshift '-w' if watch
    options.unshift '-b'
    launch 'coffee', options, callback

watchAndBuild = (callback, {useMapping} = {}) ->
  useMapping ?= false
  fs.watch jsDir, {recursive: true}, (event, filename) ->
    return if not filename.match(/.coffee$/)\
          or path.join(jsDir, filename) is "#{destFile}.coffee"\
          or path.join(jsDir, filename) is "#{destFile}.js"
    log "File changed", bold, path.join(jsDir, filename)
    build false, (-> log "Compile successful :-)", green), useMapping: useMapping

mocha = (options, callback) ->
  #if moduleExists('mocha')
  if typeof options is 'function'
    callback = options
    options = []
  # add coffee directive
  options.push '--compilers'
  options.push 'coffee:coffee-script'

  launch 'mocha', options, callback
