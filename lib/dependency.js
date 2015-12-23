import { EventEmitter } from 'events';

function wrapSingleton(className) {
  let singleton = this.singletons[className]
  return function singletonWrapper() {
    return singleton;
  }
}

export default class Dependency extends EventEmitter {
  constructor(resolver, singletons) {
    super()
    this.resolver = resolver
    this.singletons = singletons
  }
  resolve(dependencies) {
    let resolvedDeps = []
    if (dependencies) {
      dependencies.forEach((dependency) => {
        if (this.singletons[dependency]) {
          resolvedDeps.push(wrapSingleton.call(this, dependency))
        } else {
          resolvedDeps.push(this.resolver.injectDeps(dependency))
        }
      })
    }
    return resolvedDeps;
  }
}
