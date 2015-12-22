import Container from '../index.js';

test('create module as singleton', function (t) {
  t.plan(1)
  let di = new Container(`${__dirname}/lib`)
  let example = di.singleton("Example")
  t.ok(example.alive)
})

test('create module as singleton with args', function (t) {
  t.plan(3)
  let di = new Container(`${__dirname}/lib`)
  let example = di.singleton("Example", "foo", "bar")
  t.ok(example.alive)
  t.equal(example.firstArg, "foo")
  t.equal(example.secondArg, "bar")
})

test('create two singleton instances', function (t) {
  t.plan(1)
  let di = new Container(`${__dirname}/lib`)
  let example = di.singleton("Example", "foo", "bar")
  t.throws(di.singleton("Example", "baz"))
})

test('get singleton instance from subsequent creates', function (t) {
  t.plan(3)
  let di = new Container(`${__dirname}/lib`)
  let example = di.singleton("Example", "foo", "bar")
  let example2 = di.create("Example", "baz") // "baz" will be ignored
  t.ok(example.alive)
  t.ok(example2.alive)
  t.equal(example.firstArg, example2.firstArg)
})

test('singleton as dependency', function (t) {
  t.plan(2)
  let di = new Container(`${__dirname}/lib`)
  di.singleton("Dependency", "Pillow")
  let exampleDeps = di.create("ExampleDeps")
  t.ok(example.alive)
  t.equal(example.attributeFromDep, "Pillow")
})