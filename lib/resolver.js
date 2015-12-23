import { EventEmitter } from 'events';
import _                from 'lodash';

if (!Function.prototype.bindArray) {
  Function.prototype.bindArray = function(argArray) {
    if (!Array.isArray(argArray)) {
      throw new TypeError("Argument must be an array");
    }   
    let constr = this;
    return Function.prototype.bind.apply(this, [null].concat(argArray));
  }
}

if (!Object.values) {
  Object.values = function (obj) { 
    return Object.keys(obj).map( function (key) { 
      return obj[key] 
    }) 
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

function wrapSingleton(className) {
  let singletons = this.singletons
  return function singletonWrapper() {
    return singletons[className]
  }
}

function resolveDependencies(dependencies) {
  let resolvedDeps = []
  if (dependencies) {
    dependencies.forEach((dependency) => {
      let cleanDep = stripDependency(dependency)
      if (this.singletons[dependency]) {
        resolvedDeps.push(wrapSingleton.call(this, cleanDep))
      } else {
        resolvedDeps.push(this.injectDeps.call(this, cleanDep))
      }
    })
  }
  return resolvedDeps;
}

function stripDependency(dependency) {
  if (dependency.indexOf("/")) return dependency.split("/").shift()
  return dependency
}

export default class Resolver extends EventEmitter {
  constructor(modules, singletons) {
    super()
    this.modules = modules 
    this.singletons = singletons
  }
  injectDeps(className) {
    let module = getModuleAtPath.call(this, className)
    if (typeof module.default === "function") { // Single module
      let resolvedDeps = resolveDependencies.call(this, module.dependencies)
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
