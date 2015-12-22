"use strict";

import { EventEmitter } from 'events';

export const dependencies = [ "Dependency" ]
export default class ExampleDeps extends EventEmitter {
  constructor(dependency, firstArg) {
    super()
    this._alive = true
    this._firstArg = firstArg
    this._dependency = dependency
  }
  get alive() {
    return this._alive
  }
  get attributeFromDep() {
    return this._dependency.myArg;
  }
  get firstArg() {
    return this._firstArg;
  }
}
