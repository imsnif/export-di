"use strict";

import { EventEmitter } from 'events';

export const dependencies = [ "Dependency" ]
export default class Dependency extends EventEmitter {
  constructor(dependency) {
    super()
    this._alive = true
    this._myArg = "Foo"
    this._childArg = dependency.myArg
  }
  get myArg() {
    return this._myArg;
  }
  get childArg() {
    return this._childArg;
  }
}
