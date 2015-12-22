import Container from '../index.js';

import test from 'tape';

test('create module with dependencies', function (t) {
  t.plan(2)
  let di = new Container(`${__dirname}/lib`)
  let exampleDeps = di.create("ExampleDeps")
  t.ok(exampleDeps.alive)
  t.equal(exampleDeps.attributeFromDep, "FooBarBaz")
})

test('create module with dependencies and arguments', function (t) {
  t.plan(3)
  let di = new Container(`${__dirname}/lib`)
  let exampleDeps = di.create("ExampleDeps", "Peanuts")
  t.ok(exampleDeps.alive)
  t.equal(exampleDeps.attributeFromDep, "FooBarBaz")
  t.equal(exampleDeps.firstArg, "Peanuts")
})

test('create module with nested dependencies', function (t) {
  t.plan(3)
  let di = new Container(`${__dirname}/lib`)
  let example = di.create("ExampleNestedDeps")
  t.ok(example.alive)
  t.equal(example.argFromDirectDep, "Foo")
  t.equal(example.argFromNestedDep, "FooBarBaz")
})
