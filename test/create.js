import Container from '../index.js';

test('create module', function (t) {
  t.plan(1)
  let di = new Container(`${__dirname}/lib`)
  let example = di.create("Example")
  t.equal(example.alive, true)
})

test('create module with args', function (t) {
  t.plan(3)
  let di = new Container(`${__dirname}/lib`)
  let example = di.create("Example", "foo", "bar")
  t.equal(example.alive, true)
  t.equal(example.firstArg, "foo")
  t.equal(example.secondArg, "bar")
})

test('create two instances of module', function (t) {
  t.plan(3)
  let di = new Container(`${__dirname}/lib`)
  let example = di.create("Example", "foo", "bar")
  let example2 = di.create("Example", "baz")
  t.equal(example.alive, true)
  t.equal(example2.alive, true)
  t.notEqual(example.firstArg, example2.firstArg)
})

test('create two instances of module', function (t) {
  t.plan(3)
  let di = new Container(`${__dirname}/lib`)
  let example = di.create("Example", "foo", "bar")
  let example2 = di.create("Example", "baz")
  t.equal(example.alive, true)
  t.equal(example2.alive, true)
  t.notEqual(example.firstArg, example2.firstArg)
})

test('create module with dependencies', function (t) {
  t.plan(2)
  let di = new Container(`${__dirname}/lib`)
  let exampleDeps = di.create("ExampleDeps")
  t.equal(example.alive, true)
  t.equal(example.attributeFromDep, "FooBarBaz")
})

test('create module with dependencies and arguments', function (t) {
  t.plan(3)
  let di = new Container(`${__dirname}/lib`)
  let exampleDeps = di.create("ExampleDeps", "Peanuts")
  t.equal(example.alive, true)
  t.equal(example.attributeFromDep, "FooBarBaz")
  t.equal(example.firstArg, "Peanuts")
})
