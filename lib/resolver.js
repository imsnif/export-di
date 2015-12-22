import { EventEmitter } from 'events';
import requireAll       from 'require-all';
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

function getModuleAtPath(className) {
  let path = className.toLowerCase().split("/")
  return _.get(this.modules, path)
}

function wrapSingleton(className) {
  let singletons = this.singletons
  return function singletonWrapper() {
    return singletons[className]
  }
}

export default class Resolver extends EventEmitter {
  constructor(modules, singletons) {
    super()
    this.modules = modules 
    this.singletons = singletons
  }
  injectDeps(className) {
    let module = getModuleAtPath.call(this, className)
    let resolvedDeps = []
    if (module.dependencies) {
      module.dependencies.forEach((dependency) => {
        if (this.singletons[dependency]) {
          resolvedDeps.push(wrapSingleton.call(this, dependency))
        } else {
          resolvedDeps.push(this.injectDeps.call(this, dependency))
        }
      })
    }
    return module.default.bindArray(resolvedDeps)
  }
}
