import { EventEmitter } from 'events';
import requireAll       from 'require-all';
import _                from 'lodash';
import Resolver         from './resolver';

function parseRequires(requires) {
  Object.keys(requires).forEach(function(key) {
    if (typeof requires[key].default === "function") {
      let className = requires[key].default.name
      requires[className] = requires[key]
      delete requires[key];
    } else {
      requires[key] = parseRequires(requires[key])
    }
  })
  return requires;
}

export default class Container extends EventEmitter {
  constructor(path) {
    super()
    this.modules = parseRequires(requireAll({recursive: true, dirname: path}))
    this.singletons = {}
    this.resolver = new Resolver(this.modules, this.singletons)
  }
  create(className, ...args) {
    if (this.singletons[className]) {
      return this.singletons[className]
    } else {
      return new (this.resolver.injectDeps(className))(...args)
    }
  }
  singleton(className, ...args) {
    if (this.singletons[className]) {
      throw new Error(`Singleton "${className}" already declared`)
    }
    this.singletons[className] = new (this.resolver.injectDeps(className))(...args)
    return this.singletons[className]
  }
}
