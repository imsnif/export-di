import { EventEmitter } from 'events';
import requireAll from 'require-all';
import _ from 'lodash';

if (!Function.prototype.bindArray) { //TODO: move outside
  Function.prototype.bindArray = function(argArray) {
    if (!Array.isArray(argArray)) {
      throw new TypeError("Argument must be an array");
    }   
    let constr = this;
    return Function.prototype.bind.apply(this, [null].concat(argArray));
  }
}

function injectDeps(className) {
  let module = getModuleAtPath.call(this, className)
  let resolvedDeps = []
  if (module.dependencies) {
    module.dependencies.forEach((dependency) => {
      if (this.singletons[dependency]) {
        resolvedDeps.push(wrapSingleton.call(this, dependency))
      } else {
        resolvedDeps.push(injectDeps.call(this, dependency))
      }
    })
  }
  return module.default.bindArray(resolvedDeps)
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

export default class Container extends EventEmitter {
  constructor(path) {
    super()
    this.modules = requireAll({recursive: true, dirname: path})
    this.singletons = {}
  }
  create(className, ...args) {
    if (this.singletons[className]) {
      return this.singletons[className]
    } else {
      return new (injectDeps.call(this, className))(...args)
    }
  }
  singleton(className, ...args) {
    if (this.singletons[className]) {
      throw new Error(`Singleton "${className}" already declared`)
    }
    this.singletons[className] = new (injectDeps.call(this, className))(...args)
    return this.singletons[className]
  }
}
