import { EventEmitter } from 'events';

export default class Dependency extends EventEmitter {
  constructor(resolver) {
    super()
    this.resolver = resolver
  }
  resolve(dependencies) {
    let resolvedDeps = []
    if (dependencies) {
      dependencies.forEach((dependency) => {
          resolvedDeps.push(this.resolver.injectDeps(dependency))
      })
    }
    return resolvedDeps;
  }
}
