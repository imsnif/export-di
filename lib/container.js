import { EventEmitter } from 'events';
import requireAll       from 'require-all';
import Resolver         from './resolver';

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
    this.modules = parseRequires(requireAll({recursive: true, dirname: path}))
    this.singletons = {}
    this.resolver = new Resolver(this.modules, this.singletons)
  }
  create(className, ...args) {
    return new (this.resolver.injectDeps(className))(...args)
  }
  singleton(className, ...args) {
    if (this.singletons[className]) {
      throw new Error(`Singleton "${className}" already declared`)
    }
    this.singletons[className] = new (this.resolver.injectDeps(className))(...args)
    return this.singletons[className]
  }
}
