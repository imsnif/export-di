# Export-DI

### Dependency Injection Container for Node.js based on ES2015 Exports

Allows you to define class dependencies inside the modules themselves by exporting a "dependencies" array.
Includes singleton and folder-dependency support.

Example:
```javascript
  /* lib/dependency.js */
  import { EventEmitter } from 'events';

  export default class Dependency extends EventEmitter {
    constructor(myArg) {
      super()
      this._myArg = myArg || "FooBarBaz"
    }
    get myArg() {
      return this._myArg;
    }
    set myArg(value) {
      if (value) {
        this._myArg = value
      }   
    }
  }
  
  /* lib/example-deps.js */
  import { EventEmitter } from 'events';

  export const dependencies = [ "Dependency" ]
  export default class ExampleDeps extends EventEmitter {
    constructor(Dependency, firstArg) {
      super()
      this._firstArg = firstArg
      this._dependency = new Dependency()
    }
    get attributeFromDep() {
      return this._dependency.myArg;
    }
  }

  /* index.js */
  import Container from 'export-di'
  
  let di = new Container(`${__dirname}/lib`)
  let exampleDeps = di.create("ExampleDeps")
  console.log(exampleDeps.attributeFromDep) // "FooBarBaz"
  
  let exampleDeps2 = di.create("ExampleDeps", "BazBarFoo")
  console.log(exampleDeps2.attributeFromDep) // "BazBarFoo"
```


## Installation
```
npm install export-di
npm build
```
## Usage

The DI constructor accepts a directory path as its argument. It will auto-require all folders in this path, injecting their dependencies and creating singletons as needed.

```javascript
import Container from 'export-di'
let di = new Container(`${__dirname}/dist')
```
### Export Dependencies

Classes in the required directory should be separated to one class per file. The class should be exported as `default`, and the file should also export a `dependencies` array.

The `dependencies` array should consist of the path of the file relative to the root library of the container (provided in the constructor), and the name of the exported class.

Example:
```javascript
export const dependencies = [ 
  "library/ClassName", 
  "ClassNameInRootLib", 
  "anotherLibrary/yetAnotherLibrary/AnotherClassName" 
]
export default class FineClass () {
  constructor(ClassName, ClassNameInRootLib, AnotherClassName) {
      ...
    }
}
```

### Export Singletons

Export-DI also allows the declaration of singletons. A singleton object will be the same object wherever it is injected. Please note that for the sake of consistency, singleton classes are injected as constructors. When instantiated, the constructors will ignore all arguments passed to them and return the singleton as the created object.

Singletons can be declared by exporting a truthy singleton constant from the module file.

Example:
```javascript
/* lib/my-awesome-singleton.js */
...
export class dependencies = [ /* some dependencies */ ]
export const singleton = true
export default class MyAwesomeSingleton extends EventEmitter () {
  constructor(/* my dependencies */) {
    super()
    this._count = 0
  }
  get count() {
    return this._count
  }
  increaseCount() {
    this.count += 1
  }
}

/* lib/my-awesome-class.js */
...
export class dependencies = [ "MyAwesomeSingleton" ]
export default class MyAwesomeClass extends EventEmitter () {
  constructor(MyAwesomeSingleton) {
    super()
    this._jointCounter = new MyAwesomeSingleton()
  }
  get count() {
    return this._jointCounter.count
  }
  increaseCount() {
    this._jointCounter.increaseCount()
  }
}

/* app.js */
import Container from 'export-di'

let di = new Container(`${__dirname}/lib`)

let myAwesome = di.create("MyAwesomeClass")
let myOtherAwesome = di.create("MyAwesomeClass")

console.log(myAwesome.count) // 0
myOtherAwesome.increaseCount()
console.log(myAwesome.count) // 1
```

### Folder Dpendencies

When declaring dependencies, it's possible to declare a path to a folder rather than a path to a classname. This returns an object with all the constructors in that directory recursively.

Example with the following library structure:
```
lib/
├── anotherlib
│   ├── anotherexample.js (classname: AnotherExample)
│   ├── example.js (classname: Example)
│   ├── singleton.js (classname: Singleton)
│   └── yetAnotherLib
│       └── yetAnotherExample.js (classname: YetAnotherExample)
├── dependency.js (classname: Dependency)
```
```javascript
...
export const dependencies = [ "anotherLib" ]
export default class SomeClass extends EventEmitter {
  constructor(anotherLib) {
    super()
    this.anotherExample = new anotherLib.AnotherExample()
    this.example = new anotherLib.AnotherExample("some", "args", "because", "why", "not?")
    this.singleton = new anotherLib.Singleton()
    this.yetAnotherExample = new anotherLib.yetAnotherLib.YetanotherExample()
  }
}
```

## API
### di.create(`<modulePath>`, [...args])
Returns an instance of module at the specified path relative to the root library provided in the constructor.

In the below example, "lib" is provided as the root path:
```
lib/
├── anotherlib
│   ├── anotherexample.js (classname: AnotherExample)
│   ├── example.js (classname: Example)
│   ├── singleton.js (classname: Singleton)
│   └── yetAnotherLib
│       └── yetAnotherExample.js (classname: YetAnotherExample)
├── dependency.js (classname: Dependency)
```
To create the class exported from the "dependency.js" file:
```javascript
di.create("Dependency")
```
To create the class exported from the yetAnotherExample.js file:
```javascript
di.create("anotherlib/yetAnotherLib/YetAnotherExample")
```
Any arguments provided the create function will be passed on to the module's constructor.

### di.singleton(`<modulePath>`, [...args])
Manually creates a singleton and returns its instance. Note that if the module created is already a singleton, this will throw.
For an explanation of `modulePath` see the create method.


## Contributions / Issues
This project is still very new and has not been widely tested yet. Please feel free to open an issue or a PR if something's broken, or if you'd like some specific features added.

## License
MIT

