import { EventEmitter } from 'events';
import requireAll       from 'require-all';
import _                from 'lodash';
import Resolver         from './resolver';

export default class Container extends EventEmitter {
  constructor(path) {
    super()
    this.modules = requireAll({recursive: true, dirname: path})
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
