import { EventEmitter } from 'events';

function wrapSingleton(className) {
  let singletons = this.singletons
  return function singletonWrapper() {
    return singletons[className]
  }
}

function stripDependency(dependency) {
  if (dependency.indexOf("/")) return dependency.split("/").shift()
  return dependency
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
        let cleanDep = stripDependency(dependency)
        if (this.singletons[dependency]) {
          resolvedDeps.push(wrapSingleton.call(this, cleanDep))
        } else {
          resolvedDeps.push(this.resolver.injectDeps(cleanDep))
        }
      })
    }
    return resolvedDeps;
  }
}
