'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _resolver = require('./resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var _singleton2 = require('./singleton');

var _singleton3 = _interopRequireDefault(_singleton2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function parseRequires(requires) {
  var parsed = {};
  Object.keys(requires).forEach(function (key) {
    var isModule = typeof requires[key].default === "function";
    var nodeName = isModule ? requires[key].default.name : key; // Store by classname
    parsed[nodeName] = {
      type: isModule ? "module" : "branch",
      contents: isModule ? requires[key] : parseRequires(requires[key])
    };
  });
  return parsed;
}

var Container = (function (_EventEmitter) {
  _inherits(Container, _EventEmitter);

  function Container(path) {
    _classCallCheck(this, Container);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this));

    _this._modules = parseRequires((0, _requireAll2.default)({ recursive: true, dirname: path }));
    _this._singleton = new _singleton3.default();
    _this._resolver = new _resolver2.default(_this._modules, _this._singleton);
    return _this;
  }

  _createClass(Container, [{
    key: 'create',
    value: function create(className) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(this._resolver.injectDeps(className), [null].concat(args)))();
    }
  }, {
    key: 'singleton',
    value: function singleton(className) {
      var _singleton;

      if (this._singleton.isSingleton(className)) {
        throw new Error('Singleton "' + className + '" already declared');
      }

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return new ((_singleton = this._singleton).create.apply(_singleton, [className, this._resolver.injectDeps(className)].concat(args)))();
    }
  }]);

  return Container;
})(_events.EventEmitter);

exports.default = Container;