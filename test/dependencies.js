import Container from '../index.js';

test('create module with dependencies', function (t) {
  t.plan(2)
  let di = new Container(`${__dirname}/lib`)
  let exampleDeps = di.create("ExampleDeps")
  t.ok(example.alive)
  t.equal(example.attributeFromDep, "FooBarBaz")
})

test('create module with dependencies and arguments', function (t) {
  t.plan(3)
  let di = new Container(`${__dirname}/lib`)
  let exampleDeps = di.create("ExampleDeps", "Peanuts")
  t.ok(example.alive)
  t.equal(example.attributeFromDep, "FooBarBaz")
  t.equal(example.firstArg, "Peanuts")
})

test('create module with nested dependencies', function (t) {
  t.plan(1)
  let di = new Container(`${__dirname}/lib`)
  let example = di.create("ExampleNestedDeps")
  t.ok(example.alive)
  t.equal(example.argFromDirectDep, "Foo")
  t.equal(example.argFromNestedDep, "FooBarBaz")
})
