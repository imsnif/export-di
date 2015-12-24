"use strict";

import { EventEmitter } from 'events';

export const dependencies = [ "anotherlib/Singleton" ]
export default class ExampleDepsNestedSingleton extends EventEmitter {
  constructor(Singleton) {
    super()
    this._alive = true
    this._singleton = new Singleton()
  }
  get alive() {
    return this._alive
  }
  get firstArg() {
    return this._singleton.firstArg;
  }
  set firstArg(value) {
    if (value) {
      this._singleton.firstArg = value
    }
  }
}
