"use strict";

import { EventEmitter } from 'events';

export const singleton = true
export default class Singleton extends EventEmitter {
  constructor(firstArg, secondArg) {
    super()
    this._alive = true
    this._firstArg = firstArg || "hoverboard"
    this._secondArg = secondArg || "fishing"
  }
  get alive() {
    return this._alive;
  }
  get firstArg() {
    return this._firstArg;
  }
  set firstArg(value) {
    if (value) {
      this._firstArg = value
    }
  }
}
