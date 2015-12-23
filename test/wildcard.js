import Container from '../index.js';

import test from 'tape';

test('create module with wildcard dependency', function (t) {
  t.plan(3)
  let di = new Container(`${__dirname}/lib`)
  let exampleWithWildcard = di.create("ExampleWithWildcard")
  t.ok(exampleWithWildcard.alive)
  t.equal(exampleWithWildcard.anotherExample("firstArg"), "octopus")
  t.equal(exampleWithWildcard.example("secondArg"), "pickUpTruck")
})

test('create module with wildcard dependency and nested folder', function (t) {
  t.plan(2)
  let di = new Container(`${__dirname}/lib`)
  let exampleWithWildcard = di.create("ExampleWithWildcard")
  t.ok(exampleWithWildcard.alive)
  t.equal(exampleWithWildcard.yetAnotherExample("firstArg"), "manatee")
})
