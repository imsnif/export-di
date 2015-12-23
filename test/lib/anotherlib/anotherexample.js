"use strict";

import { EventEmitter } from 'events';

export default class AnotherExample extends EventEmitter {
  constructor(firstArg, secondArg) {
    super()
    this._alive = true
    this._firstArg = firstArg || "octopus"
    this._secondArg = secondArg || "elephant"
  }
  get alive() {
    return this._alive;
  }
  get firstArg() {
    return this._firstArg;
  }
  get secondArg() {
    return this._secondArg;
  }
}
