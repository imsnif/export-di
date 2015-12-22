"use strict";

import { EventEmitter } from 'events';

export const dependencies = [ "NestedDependency" ]
export default class ExampleNestedDeps extends EventEmitter {
  constructor(nestedDependency) {
    super()
    this._alive = true
    this._dependency = nestedDependency
  }
  get alive() {
    return this._alive
  }
  get argFromDirectDep() {
    return this._dependency.myArg
  }
  get argFromNestedDep() {
    return this._dependency.childArg;
  }
}
