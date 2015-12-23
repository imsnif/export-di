"use strict";

import { EventEmitter } from 'events';

export default class YetAnotherExample extends EventEmitter {
  constructor(firstArg, secondArg) {
    super()
    this._alive = true
    this._firstArg = firstArg || "manatee"
    this._secondArg = secondArg || "pencil"
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
