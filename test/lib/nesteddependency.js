"use strict";

import { EventEmitter } from 'events';

export const dependencies = [ "Dependency" ]
export default class NestedDependency extends EventEmitter {
  constructor(Dependency) {
    super()
    this._alive = true
    this._myArg = "Foo"
    this._child = new Dependency()
  }
  get myArg() {
    return this._myArg;
  }
  get childArg() {
    return this._child.myArg;
  }
}
