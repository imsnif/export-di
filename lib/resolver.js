import { EventEmitter } from 'events';
import _                from 'lodash';
import Dependency       from './dependency'

if (!Function.prototype.bindArray) {
  Function.prototype.bindArray = function(argArray) {
    if (!Array.isArray(argArray)) {
      throw new TypeError("Argument must be an array");
    }   
    let constr = this;
    return Function.prototype.bind.apply(this, [null].concat(argArray));
  }
}

function traverseModules(obj, name) {
  let path = name.split("/")
  if (path.length === 1 && obj[name]) return obj[name]
  let root = path.shift()
  if (obj[root]) {
    if(obj[root].type === "branch") return traverseModules(obj[root].branch, path.join("/"))
    if(obj[root].type === "module") throw new Error(`${root} is not a path node.`)
    return undefined
  }   
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
    if (item.type === "module") { // Single module
      let resolvedDeps = this.dependency.resolve(item.module.dependencies)
      return item.module.default.bindArray(resolvedDeps)
    } else { // Multiple modules
      return Object.keys(item.branch).reduce((memo, childName) => {
        memo[childName] = this.injectDeps(childName, item.branch)
        return memo;
      }, {})
    }
  }
}
