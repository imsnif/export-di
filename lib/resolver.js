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

function getModuleAtPath(className) {
  let path = className.split("/")
  if (Array.isArray(path) && path[path.length - 1] === "*") { // Last element is a wildcard
    Array.pop(path);
    return _.get(this.modules, path);
  } else {
    return _.get(this.modules, path)
  }
}

export default class Resolver extends EventEmitter {
  constructor(modules, singletons) {
    super()
    this.modules = modules 
    this.singletons = singletons
    this.dependency = new Dependency()
  }
  injectDeps(className) {
    let module = getModuleAtPath.call(this, className)
    if (typeof module.default === "function") { // Single module
      let resolvedDeps = this.dependency.resolve.call(this, module.dependencies)
      return module.default.bindArray(resolvedDeps)
    } else { // Multiple modules
      let folderName = className.split("/").shift()
      return Object.keys(module).reduce((memo, moduleClassName) => {
        memo[moduleClassName] = this.injectDeps(`${folderName}/${moduleClassName}`)
        return memo;
      }, {})
    }
  }
}
