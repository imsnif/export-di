'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function wrap(className) {
  var singleton = this._singletons[className];
  return function singletonWrapper() {
    return singleton;
  };
}

var Singleton = (function (_EventEmitter) {
  _inherits(Singleton, _EventEmitter);

  function Singleton() {
    _classCallCheck(this, Singleton);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Singleton).call(this));

    _this._singletons = {};
    return _this;
  }

  _createClass(Singleton, [{
    key: 'create',
    value: function create(className, Constructor) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      this._singletons[className] = new (Function.prototype.bind.apply(Constructor, [null].concat(args)))();
      return wrap.call(this, className);
    }
  }, {
    key: 'isSingleton',
    value: function isSingleton(className) {
      if (this._singletons[className]) return true;
    }
  }, {
    key: 'getSingleton',
    value: function getSingleton(className) {
      return wrap.call(this, className);
    }
  }, {
    key: 'getSingletonInstance',
    value: function getSingletonInstance(className) {
      return this._singletons[className];
    }
  }]);

  return Singleton;
})(_events.EventEmitter);

exports.default = Singleton;