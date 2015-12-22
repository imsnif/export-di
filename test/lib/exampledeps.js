"use strict";

import { EventEmitter } from 'events';

export const dependencies = [ "Dependency" ]
export default class ExampleDeps extends EventEmitter {
  constructor(Dependency, firstArg) {
    super()
    this._alive = true
    this._firstArg = firstArg
    this._dependency = new Dependency()
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
