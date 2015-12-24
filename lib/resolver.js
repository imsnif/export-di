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
  constructor(modules, singleton) {
    super()
    this._modules    = modules
    this._singleton  = singleton
    this._dependency = new Dependency(this)
  }
  injectDeps(className, modules) {
    modules = modules || this._modules
    if (this._singleton.isSingleton(className)) return this._singleton.getSingleton(className)
    let item = traverseModules(modules, className)
    if (typeof item === "undefined") throw new Error(`Module ${className} not found.`)
    switch (item.type) {
      case "module": // Single module
        let module = item.contents
        let defaultClass = module.default
        let resolvedDeps = this._dependency.resolve(module.dependencies)
        if (module.singleton) return this._singleton.create(className, defaultClass.bindArray(resolvedDeps))
        return defaultClass.bindArray(resolvedDeps)
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
