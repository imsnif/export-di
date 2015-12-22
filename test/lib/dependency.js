"use strict";

import { EventEmitter } from 'events';

export default class Dependency extends EventEmitter {
  constructor(myArg) {
    super()
    this._alive = true
    this._myArg = myArg || "FooBarBaz"
  }
  get myArg() {
    return this._myArg;
  }
}
