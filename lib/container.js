import { EventEmitter } from 'events';
import requireAll       from 'require-all';
import Resolver         from './resolver';
import Singleton        from './singleton';

function parseRequires(requires) {
  let parsed = {}
  Object.keys(requires).forEach(function(key) {
    let isModule = ( typeof requires[key].default === "function" )
    let nodeName = isModule ? requires[key].default.name : key // Store by classname
    parsed[nodeName] = {
      type: isModule ? "module" : "branch",
      contents: isModule ? requires[key] : parseRequires(requires[key])
    }
  })
  return parsed;
}

export default class Container extends EventEmitter {
  constructor(path) {
    super()
    this._modules   = parseRequires(requireAll({recursive: true, dirname: path}))
    this._singleton = new Singleton()
    this._resolver  = new Resolver(this._modules, this._singleton)
  }
  create(className, ...args) {
    return new (this._resolver.injectDeps(className))(...args)
  }
  singleton(className, ...args) {
    if (this._singleton.isSingleton(className)) { 
      throw new Error (`Singleton "${className}" already declared`)
    }
    return new (this._singleton.create(className, this._resolver.injectDeps(className), ...args))
  }
}
