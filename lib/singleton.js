import { EventEmitter } from 'events';

function wrap(className) {
  let singleton = this._singletons[className]
  return function singletonWrapper() {
    return singleton;
  }
}

export default class Singleton extends EventEmitter {
  constructor() {
    super()
    this._singletons = {}
  }
  create(className, Constructor, ...args) {
    this._singletons[className] = new Constructor(...args)
    return wrap.call(this, className)
  }
  isSingleton(className) {
    if (this._singletons[className]) return true
  }
  getSingleton(className) {
    return wrap.call(this, className)
  }
  getSingletonInstance(className) {
    return this._singletons[className]
  }
}
