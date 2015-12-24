"use strict";

import { EventEmitter } from 'events';

export const dependencies = [ "Dependency", "anotherlib" ]
export default class ExampleWithWildcard extends EventEmitter {
  constructor(Dependency, anotherLib) {
    super()
    this._alive = true
    this._anotherExample = new anotherLib.AnotherExample;
    this._example = new anotherLib.Example;
    this._yetAnotherExample = new anotherLib.yetAnotherLib.YetAnotherExample()
  }
  get alive() {
    return this._alive
  }
  anotherExample(methodName) {
    return this._anotherExample[methodName]
  }
  example(methodName) {
    return this._example[methodName]
  }
  yetAnotherExample(methodName) {
    return this._yetAnotherExample[methodName]
  }
}
