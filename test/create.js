import Container from '../index.js';

import test from 'tape';

test('create module', function (t) {
  t.plan(1)
  let di = new Container(`${__dirname}/lib`)
  let example = di.create("Example")
  t.ok(example.alive)
})

test('create module with args', function (t) {
  t.plan(3)
  let di = new Container(`${__dirname}/lib`)
  let example = di.create("Example", "foo", "bar")
  t.ok(example.alive)
  t.equal(example.firstArg, "foo")
  t.equal(example.secondArg, "bar")
})

test('proper error', function (t) {
  t.plan(1)
  let di = new Container(`${__dirname}/lib`)
  t.throws(di.create.bind(di, "NonExistentComponent"))
})

test('create two instances of module', function (t) {
  t.plan(3)
  let di = new Container(`${__dirname}/lib`)
  let example = di.create("Example", "foo", "bar")
  let example2 = di.create("Example", "baz")
  t.ok(example.alive)
  t.ok(example2.alive)
  t.notEqual(example.firstArg, example2.firstArg)
})

test('create module from nested library', function (t) {
  t.plan(1)
  let di = new Container(`${__dirname}/lib`)
  let example = di.create("anotherlib/Example", "foo", "bar")
  t.ok(example.alive)
})
