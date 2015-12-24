import { EventEmitter } from 'events';
import Dependency       from './dependency'

if (!Function.prototype.bindArray) {
  Function.prototype.bindArray = function(argArray) {
    if (!Array.isArray(argArray)) throw new TypeError("Argument must be an array");
    return Function.prototype.bind.apply(this, [null].concat(argArray));
  }
}

function traverseModules(obj, name) {
  let path = name.split("/")
  if (path.length === 1 && obj[name]) return obj[name]
  let root = path.shift()
  if (obj[root]) return traverseModules(obj[root].contents, path.join("/"))
  return undefined
}

export default class Resolver extends EventEmitter {
  constructor(modules, singletons) {
    super()
    this.modules = modules 
    this.dependency = new Dependency(this, singletons)
  }
  injectDeps(className, modules) {
    modules = modules || this.modules
    let item = traverseModules(modules, className)
    if (typeof item === "undefined") throw new Error(`Module ${className} not found.`)
    switch (item.type) {
      case "module": // Single module
        let module = item.contents;
        let resolvedDeps = this.dependency.resolve(module.dependencies)
        return module.default.bindArray(resolvedDeps)
      case "branch": // Multiple modules
        let branch = item.contents
        if (!branch) throw new Error(`Failed while trying to traverse ${className}`)
        return Object.keys(branch).reduce((memo, childName) => {
          memo[childName] = this.injectDeps(childName, branch)
          return memo;
        }, {})
    }
  }
}
