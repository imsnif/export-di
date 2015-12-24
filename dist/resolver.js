'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _dependency = require('./dependency');

var _dependency2 = _interopRequireDefault(_dependency);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (!Function.prototype.bindArray) {
  Function.prototype.bindArray = function (argArray) {
    if (!Array.isArray(argArray)) throw new TypeError("Argument must be an array");
    return Function.prototype.bind.apply(this, [null].concat(argArray));
  };
}

function traverseModules(obj, name) {
  var path = name.split("/");
  if (path.length === 1 && obj[name]) return obj[name];
  var root = path.shift();
  if (obj[root]) return traverseModules(obj[root].contents, path.join("/"));
  return undefined;
}

var Resolver = (function (_EventEmitter) {
  _inherits(Resolver, _EventEmitter);

  function Resolver(modules, singleton) {
    _classCallCheck(this, Resolver);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Resolver).call(this));

    _this._modules = modules;
    _this._singleton = singleton;
    _this._dependency = new _dependency2.default(_this);
    return _this;
  }

  _createClass(Resolver, [{
    key: 'injectDeps',
    value: function injectDeps(className, modules) {
      var _this2 = this;

      modules = modules || this._modules;
      if (this._singleton.isSingleton(className)) return this._singleton.getSingleton(className);
      var item = traverseModules(modules, className);
      if (typeof item === "undefined") throw new Error('Module ' + className + ' not found.');
      switch (item.type) {
        case "module":
          // Single module
          var module = item.contents;
          var defaultClass = module.default;
          var resolvedDeps = this._dependency.resolve(module.dependencies);
          if (module.singleton) return this._singleton.create(className, defaultClass.bindArray(resolvedDeps));
          return defaultClass.bindArray(resolvedDeps);
        case "branch":
          // Multiple modules
          var branch = item.contents;
          if (!branch) throw new Error('Failed while trying to traverse ' + className);
          return Object.keys(branch).reduce(function (memo, childName) {
            memo[childName] = _this2.injectDeps(childName, branch);
            return memo;
          }, {});
      }
    }
  }]);

  return Resolver;
})(_events.EventEmitter);

exports.default = Resolver;