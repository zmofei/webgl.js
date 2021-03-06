/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _camera = __webpack_require__(1);

	var _camera2 = _interopRequireDefault(_camera);

	var _plane = __webpack_require__(4);

	var _plane2 = _interopRequireDefault(_plane);

	var _wall = __webpack_require__(7);

	var _wall2 = _interopRequireDefault(_wall);

	var _utility = __webpack_require__(5);

	var _default = __webpack_require__(8);

	var _pathtowall = __webpack_require__(9);

	var _pathtowall2 = _interopRequireDefault(_pathtowall);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GL = function () {
	    function GL(dom) {
	        _classCallCheck(this, GL);

	        var self = this;

	        var renderList = this.renderList = [];

	        var canvas = document.getElementById(dom);

	        var gl = this.gl = (0, _utility.getWebGLContext)(canvas);
	        // console.log(canvas,gl,'22')
	        (0, _utility.initShaders)(gl, _default.VSHADER_SOURCE, _default.FSHADER_SOURCE);

	        gl.enable(gl.DEPTH_TEST);

	        gl.clearColor(0.98, 0.98, 0.98, 1.0);

	        //init camear
	        self.camera = new _camera2.default(this.gl);

	        function draw() {
	            gl.clear(gl.COLOR_BUFFER_BIT);
	            for (var i in renderList) {
	                renderList[i].render();
	            }
	            requestAnimationFrame(draw);
	        }
	        requestAnimationFrame(draw);
	    }

	    _createClass(GL, [{
	        key: 'Plane',
	        value: function Plane(obj) {
	            var plane = new _plane2.default(this, obj);
	            this.renderList.push(plane);
	            return plane;
	        }
	    }, {
	        key: 'Wall',
	        value: function Wall(obj) {
	            var wall = new _wall2.default(this, obj);
	            this.renderList.push(wall);
	            return wall;
	        }
	    }], [{
	        key: 'pathExend',
	        value: function pathExend(paths, width) {
	            return (0, _pathtowall2.default)(paths, width);
	        }
	    }]);

	    return GL;
	}();

	global.GL = GL;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _mat = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Camera = function () {
	    function Camera(gl) {
	        _classCallCheck(this, Camera);

	        this.gl = gl;
	        this.radius = 30;

	        this.lon = 90;
	        this.lat = 45;

	        var canvas = gl.canvas;

	        gl.viewport(0, 0, canvas.width, canvas.height);
	        var pMatrix = _mat.mat4.create();
	        _mat.mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 1, 1000.0);
	        gl.uniformMatrix4fv(gl.uPMatrix, false, pMatrix);

	        this.computerXYZ();
	        this.render();
	        this.init();
	    }

	    _createClass(Camera, [{
	        key: 'init',
	        value: function init() {
	            this.drag();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var mvMatrix = _mat.mat4.create();
	            _mat.mat4.lookAt(mvMatrix, [this.x, this.y, this.z], [0, 0, 0], [0, 0, 1]);
	            this.mvMatrix = mvMatrix;
	        }
	    }, {
	        key: 'drag',
	        value: function drag() {
	            var self = this;
	            var canvas = this.gl.canvas;

	            var startX = 0;
	            var startY = 0;
	            var startLon = 0;
	            var startLat = 0;
	            var canDrag = false;

	            canvas.addEventListener('mousedown', function (e) {
	                startX = e.offsetX;
	                startY = e.offsetY;
	                startLon = self.lon;
	                startLat = self.lat;
	                canDrag = true;
	            });

	            window.addEventListener('mousemove', function (e) {
	                if (canDrag) {
	                    var dX = e.offsetX - startX;
	                    var dY = e.offsetY - startY;
	                    var dLon = dX / 1;
	                    var dLat = dY / 1;
	                    self.lon = (startLon + dLon) % 360;
	                    self.lat = startLat + dLat;
	                    self.lat = self.lat > 90 ? 90 : self.lat;
	                    self.lat = self.lat < -90 ? -90 : self.lat;
	                    self.computerXYZ();
	                    self.render();
	                }
	            });

	            window.addEventListener('mouseup', function (e) {
	                startX = 0;
	                startY = 0;
	                canDrag = false;
	            });
	        }
	    }, {
	        key: 'computerXYZ',
	        value: function computerXYZ() {
	            var self = this;
	            self.z = self.radius * Math.sin(self.lat * Math.PI / 180);
	            var smallRadius = self.radius * Math.cos(self.lat * Math.PI / 180);
	            self.x = smallRadius * Math.cos(self.lon * Math.PI / 180);
	            self.y = -smallRadius * Math.sin(self.lon * Math.PI / 180);
	        }
	    }]);

	    return Camera;
	}();

	exports.default = Camera;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * @fileoverview gl-matrix - High performance matrix and vector operations
	 * @author Brandon Jones
	 * @author Colin MacKenzie IV
	 * @version 2.3.2
	 */

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	!function (t, a) {
	  if ("object" == ( false ? "undefined" : _typeof(exports)) && "object" == ( false ? "undefined" : _typeof(module))) module.exports = a();else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else {
	    var n = a();for (var r in n) {
	      ("object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports : t)[r] = n[r];
	    }
	  }
	}(undefined, function () {
	  return function (t) {
	    function a(r) {
	      if (n[r]) return n[r].exports;var o = n[r] = { exports: {}, id: r, loaded: !1 };return t[r].call(o.exports, o, o.exports, a), o.loaded = !0, o.exports;
	    }var n = {};return a.m = t, a.c = n, a.p = "", a(0);
	  }([function (t, a, n) {
	    a.glMatrix = n(1), a.mat2 = n(2), a.mat2d = n(3), a.mat3 = n(4), a.mat4 = n(5), a.quat = n(6), a.vec2 = n(9), a.vec3 = n(7), a.vec4 = n(8);
	  }, function (t, a) {
	    var n = {};n.EPSILON = 1e-6, n.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array, n.RANDOM = Math.random, n.ENABLE_SIMD = !1, n.SIMD_AVAILABLE = n.ARRAY_TYPE === Float32Array && "SIMD" in this, n.USE_SIMD = n.ENABLE_SIMD && n.SIMD_AVAILABLE, n.setMatrixArrayType = function (t) {
	      n.ARRAY_TYPE = t;
	    };var r = Math.PI / 180;n.toRadian = function (t) {
	      return t * r;
	    }, t.exports = n;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = {};o.create = function () {
	      var t = new r.ARRAY_TYPE(4);return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(4);return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t;
	    }, o.identity = function (t) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t;
	    }, o.transpose = function (t, a) {
	      if (t === a) {
	        var n = a[1];t[1] = a[2], t[2] = n;
	      } else t[0] = a[0], t[1] = a[2], t[2] = a[1], t[3] = a[3];return t;
	    }, o.invert = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          l = a[3],
	          u = n * l - o * r;return u ? (u = 1 / u, t[0] = l * u, t[1] = -r * u, t[2] = -o * u, t[3] = n * u, t) : null;
	    }, o.adjoint = function (t, a) {
	      var n = a[0];return t[0] = a[3], t[1] = -a[1], t[2] = -a[2], t[3] = n, t;
	    }, o.determinant = function (t) {
	      return t[0] * t[3] - t[2] * t[1];
	    }, o.multiply = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = n[0],
	          M = n[1],
	          i = n[2],
	          s = n[3];return t[0] = r * e + l * M, t[1] = o * e + u * M, t[2] = r * i + l * s, t[3] = o * i + u * s, t;
	    }, o.mul = o.multiply, o.rotate = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = Math.sin(n),
	          M = Math.cos(n);return t[0] = r * M + l * e, t[1] = o * M + u * e, t[2] = r * -e + l * M, t[3] = o * -e + u * M, t;
	    }, o.scale = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = n[0],
	          M = n[1];return t[0] = r * e, t[1] = o * e, t[2] = l * M, t[3] = u * M, t;
	    }, o.fromRotation = function (t, a) {
	      var n = Math.sin(a),
	          r = Math.cos(a);return t[0] = r, t[1] = n, t[2] = -n, t[3] = r, t;
	    }, o.fromScaling = function (t, a) {
	      return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = a[1], t;
	    }, o.str = function (t) {
	      return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
	    }, o.frob = function (t) {
	      return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2));
	    }, o.LDU = function (t, a, n, r) {
	      return t[2] = r[2] / r[0], n[0] = r[0], n[1] = r[1], n[3] = r[3] - t[2] * n[1], [t, a, n];
	    }, t.exports = o;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = {};o.create = function () {
	      var t = new r.ARRAY_TYPE(6);return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(6);return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[4] = t[4], a[5] = t[5], a;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t;
	    }, o.identity = function (t) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t;
	    }, o.invert = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          l = a[3],
	          u = a[4],
	          e = a[5],
	          M = n * l - r * o;return M ? (M = 1 / M, t[0] = l * M, t[1] = -r * M, t[2] = -o * M, t[3] = n * M, t[4] = (o * e - l * u) * M, t[5] = (r * u - n * e) * M, t) : null;
	    }, o.determinant = function (t) {
	      return t[0] * t[3] - t[1] * t[2];
	    }, o.multiply = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = a[4],
	          M = a[5],
	          i = n[0],
	          s = n[1],
	          c = n[2],
	          f = n[3],
	          D = n[4],
	          S = n[5];return t[0] = r * i + l * s, t[1] = o * i + u * s, t[2] = r * c + l * f, t[3] = o * c + u * f, t[4] = r * D + l * S + e, t[5] = o * D + u * S + M, t;
	    }, o.mul = o.multiply, o.rotate = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = a[4],
	          M = a[5],
	          i = Math.sin(n),
	          s = Math.cos(n);return t[0] = r * s + l * i, t[1] = o * s + u * i, t[2] = r * -i + l * s, t[3] = o * -i + u * s, t[4] = e, t[5] = M, t;
	    }, o.scale = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = a[4],
	          M = a[5],
	          i = n[0],
	          s = n[1];return t[0] = r * i, t[1] = o * i, t[2] = l * s, t[3] = u * s, t[4] = e, t[5] = M, t;
	    }, o.translate = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = a[4],
	          M = a[5],
	          i = n[0],
	          s = n[1];return t[0] = r, t[1] = o, t[2] = l, t[3] = u, t[4] = r * i + l * s + e, t[5] = o * i + u * s + M, t;
	    }, o.fromRotation = function (t, a) {
	      var n = Math.sin(a),
	          r = Math.cos(a);return t[0] = r, t[1] = n, t[2] = -n, t[3] = r, t[4] = 0, t[5] = 0, t;
	    }, o.fromScaling = function (t, a) {
	      return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = a[1], t[4] = 0, t[5] = 0, t;
	    }, o.fromTranslation = function (t, a) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = a[0], t[5] = a[1], t;
	    }, o.str = function (t) {
	      return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ")";
	    }, o.frob = function (t) {
	      return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + 1);
	    }, t.exports = o;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = {};o.create = function () {
	      var t = new r.ARRAY_TYPE(9);return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
	    }, o.fromMat4 = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[4], t[4] = a[5], t[5] = a[6], t[6] = a[8], t[7] = a[9], t[8] = a[10], t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(9);return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[4] = t[4], a[5] = t[5], a[6] = t[6], a[7] = t[7], a[8] = t[8], a;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t;
	    }, o.identity = function (t) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
	    }, o.transpose = function (t, a) {
	      if (t === a) {
	        var n = a[1],
	            r = a[2],
	            o = a[5];t[1] = a[3], t[2] = a[6], t[3] = n, t[5] = a[7], t[6] = r, t[7] = o;
	      } else t[0] = a[0], t[1] = a[3], t[2] = a[6], t[3] = a[1], t[4] = a[4], t[5] = a[7], t[6] = a[2], t[7] = a[5], t[8] = a[8];return t;
	    }, o.invert = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          l = a[3],
	          u = a[4],
	          e = a[5],
	          M = a[6],
	          i = a[7],
	          s = a[8],
	          c = s * u - e * i,
	          f = -s * l + e * M,
	          D = i * l - u * M,
	          S = n * c + r * f + o * D;return S ? (S = 1 / S, t[0] = c * S, t[1] = (-s * r + o * i) * S, t[2] = (e * r - o * u) * S, t[3] = f * S, t[4] = (s * n - o * M) * S, t[5] = (-e * n + o * l) * S, t[6] = D * S, t[7] = (-i * n + r * M) * S, t[8] = (u * n - r * l) * S, t) : null;
	    }, o.adjoint = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          l = a[3],
	          u = a[4],
	          e = a[5],
	          M = a[6],
	          i = a[7],
	          s = a[8];return t[0] = u * s - e * i, t[1] = o * i - r * s, t[2] = r * e - o * u, t[3] = e * M - l * s, t[4] = n * s - o * M, t[5] = o * l - n * e, t[6] = l * i - u * M, t[7] = r * M - n * i, t[8] = n * u - r * l, t;
	    }, o.determinant = function (t) {
	      var a = t[0],
	          n = t[1],
	          r = t[2],
	          o = t[3],
	          l = t[4],
	          u = t[5],
	          e = t[6],
	          M = t[7],
	          i = t[8];return a * (i * l - u * M) + n * (-i * o + u * e) + r * (M * o - l * e);
	    }, o.multiply = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = a[4],
	          M = a[5],
	          i = a[6],
	          s = a[7],
	          c = a[8],
	          f = n[0],
	          D = n[1],
	          S = n[2],
	          I = n[3],
	          x = n[4],
	          F = n[5],
	          m = n[6],
	          h = n[7],
	          d = n[8];return t[0] = f * r + D * u + S * i, t[1] = f * o + D * e + S * s, t[2] = f * l + D * M + S * c, t[3] = I * r + x * u + F * i, t[4] = I * o + x * e + F * s, t[5] = I * l + x * M + F * c, t[6] = m * r + h * u + d * i, t[7] = m * o + h * e + d * s, t[8] = m * l + h * M + d * c, t;
	    }, o.mul = o.multiply, o.translate = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = a[4],
	          M = a[5],
	          i = a[6],
	          s = a[7],
	          c = a[8],
	          f = n[0],
	          D = n[1];return t[0] = r, t[1] = o, t[2] = l, t[3] = u, t[4] = e, t[5] = M, t[6] = f * r + D * u + i, t[7] = f * o + D * e + s, t[8] = f * l + D * M + c, t;
	    }, o.rotate = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = a[4],
	          M = a[5],
	          i = a[6],
	          s = a[7],
	          c = a[8],
	          f = Math.sin(n),
	          D = Math.cos(n);return t[0] = D * r + f * u, t[1] = D * o + f * e, t[2] = D * l + f * M, t[3] = D * u - f * r, t[4] = D * e - f * o, t[5] = D * M - f * l, t[6] = i, t[7] = s, t[8] = c, t;
	    }, o.scale = function (t, a, n) {
	      var r = n[0],
	          o = n[1];return t[0] = r * a[0], t[1] = r * a[1], t[2] = r * a[2], t[3] = o * a[3], t[4] = o * a[4], t[5] = o * a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t;
	    }, o.fromTranslation = function (t, a) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = a[0], t[7] = a[1], t[8] = 1, t;
	    }, o.fromRotation = function (t, a) {
	      var n = Math.sin(a),
	          r = Math.cos(a);return t[0] = r, t[1] = n, t[2] = 0, t[3] = -n, t[4] = r, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
	    }, o.fromScaling = function (t, a) {
	      return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = a[1], t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
	    }, o.fromMat2d = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = 0, t[3] = a[2], t[4] = a[3], t[5] = 0, t[6] = a[4], t[7] = a[5], t[8] = 1, t;
	    }, o.fromQuat = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          l = a[3],
	          u = n + n,
	          e = r + r,
	          M = o + o,
	          i = n * u,
	          s = r * u,
	          c = r * e,
	          f = o * u,
	          D = o * e,
	          S = o * M,
	          I = l * u,
	          x = l * e,
	          F = l * M;return t[0] = 1 - c - S, t[3] = s - F, t[6] = f + x, t[1] = s + F, t[4] = 1 - i - S, t[7] = D - I, t[2] = f - x, t[5] = D + I, t[8] = 1 - i - c, t;
	    }, o.normalFromMat4 = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          l = a[3],
	          u = a[4],
	          e = a[5],
	          M = a[6],
	          i = a[7],
	          s = a[8],
	          c = a[9],
	          f = a[10],
	          D = a[11],
	          S = a[12],
	          I = a[13],
	          x = a[14],
	          F = a[15],
	          m = n * e - r * u,
	          h = n * M - o * u,
	          d = n * i - l * u,
	          v = r * M - o * e,
	          z = r * i - l * e,
	          p = o * i - l * M,
	          w = s * I - c * S,
	          A = s * x - f * S,
	          R = s * F - D * S,
	          b = c * x - f * I,
	          q = c * F - D * I,
	          y = f * F - D * x,
	          Y = m * y - h * q + d * b + v * R - z * A + p * w;return Y ? (Y = 1 / Y, t[0] = (e * y - M * q + i * b) * Y, t[1] = (M * R - u * y - i * A) * Y, t[2] = (u * q - e * R + i * w) * Y, t[3] = (o * q - r * y - l * b) * Y, t[4] = (n * y - o * R + l * A) * Y, t[5] = (r * R - n * q - l * w) * Y, t[6] = (I * p - x * z + F * v) * Y, t[7] = (x * d - S * p - F * h) * Y, t[8] = (S * z - I * d + F * m) * Y, t) : null;
	    }, o.str = function (t) {
	      return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")";
	    }, o.frob = function (t) {
	      return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2));
	    }, t.exports = o;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = { scalar: {}, SIMD: {} };o.create = function () {
	      var t = new r.ARRAY_TYPE(16);return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(16);return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[4] = t[4], a[5] = t[5], a[6] = t[6], a[7] = t[7], a[8] = t[8], a[9] = t[9], a[10] = t[10], a[11] = t[11], a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15], a;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15], t;
	    }, o.identity = function (t) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.scalar.transpose = function (t, a) {
	      if (t === a) {
	        var n = a[1],
	            r = a[2],
	            o = a[3],
	            l = a[6],
	            u = a[7],
	            e = a[11];t[1] = a[4], t[2] = a[8], t[3] = a[12], t[4] = n, t[6] = a[9], t[7] = a[13], t[8] = r, t[9] = l, t[11] = a[14], t[12] = o, t[13] = u, t[14] = e;
	      } else t[0] = a[0], t[1] = a[4], t[2] = a[8], t[3] = a[12], t[4] = a[1], t[5] = a[5], t[6] = a[9], t[7] = a[13], t[8] = a[2], t[9] = a[6], t[10] = a[10], t[11] = a[14], t[12] = a[3], t[13] = a[7], t[14] = a[11], t[15] = a[15];return t;
	    }, o.SIMD.transpose = function (t, a) {
	      var n, r, o, l, u, e, M, i, s, c;return n = SIMD.Float32x4.load(a, 0), r = SIMD.Float32x4.load(a, 4), o = SIMD.Float32x4.load(a, 8), l = SIMD.Float32x4.load(a, 12), u = SIMD.Float32x4.shuffle(n, r, 0, 1, 4, 5), e = SIMD.Float32x4.shuffle(o, l, 0, 1, 4, 5), M = SIMD.Float32x4.shuffle(u, e, 0, 2, 4, 6), i = SIMD.Float32x4.shuffle(u, e, 1, 3, 5, 7), SIMD.Float32x4.store(t, 0, M), SIMD.Float32x4.store(t, 4, i), u = SIMD.Float32x4.shuffle(n, r, 2, 3, 6, 7), e = SIMD.Float32x4.shuffle(o, l, 2, 3, 6, 7), s = SIMD.Float32x4.shuffle(u, e, 0, 2, 4, 6), c = SIMD.Float32x4.shuffle(u, e, 1, 3, 5, 7), SIMD.Float32x4.store(t, 8, s), SIMD.Float32x4.store(t, 12, c), t;
	    }, o.transpose = r.USE_SIMD ? o.SIMD.transpose : o.scalar.transpose, o.scalar.invert = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          l = a[3],
	          u = a[4],
	          e = a[5],
	          M = a[6],
	          i = a[7],
	          s = a[8],
	          c = a[9],
	          f = a[10],
	          D = a[11],
	          S = a[12],
	          I = a[13],
	          x = a[14],
	          F = a[15],
	          m = n * e - r * u,
	          h = n * M - o * u,
	          d = n * i - l * u,
	          v = r * M - o * e,
	          z = r * i - l * e,
	          p = o * i - l * M,
	          w = s * I - c * S,
	          A = s * x - f * S,
	          R = s * F - D * S,
	          b = c * x - f * I,
	          q = c * F - D * I,
	          y = f * F - D * x,
	          Y = m * y - h * q + d * b + v * R - z * A + p * w;return Y ? (Y = 1 / Y, t[0] = (e * y - M * q + i * b) * Y, t[1] = (o * q - r * y - l * b) * Y, t[2] = (I * p - x * z + F * v) * Y, t[3] = (f * z - c * p - D * v) * Y, t[4] = (M * R - u * y - i * A) * Y, t[5] = (n * y - o * R + l * A) * Y, t[6] = (x * d - S * p - F * h) * Y, t[7] = (s * p - f * d + D * h) * Y, t[8] = (u * q - e * R + i * w) * Y, t[9] = (r * R - n * q - l * w) * Y, t[10] = (S * z - I * d + F * m) * Y, t[11] = (c * d - s * z - D * m) * Y, t[12] = (e * A - u * b - M * w) * Y, t[13] = (n * b - r * A + o * w) * Y, t[14] = (I * h - S * v - x * m) * Y, t[15] = (s * v - c * h + f * m) * Y, t) : null;
	    }, o.SIMD.invert = function (t, a) {
	      var n,
	          r,
	          o,
	          l,
	          u,
	          e,
	          M,
	          i,
	          s,
	          c,
	          f = SIMD.Float32x4.load(a, 0),
	          D = SIMD.Float32x4.load(a, 4),
	          S = SIMD.Float32x4.load(a, 8),
	          I = SIMD.Float32x4.load(a, 12);return u = SIMD.Float32x4.shuffle(f, D, 0, 1, 4, 5), r = SIMD.Float32x4.shuffle(S, I, 0, 1, 4, 5), n = SIMD.Float32x4.shuffle(u, r, 0, 2, 4, 6), r = SIMD.Float32x4.shuffle(r, u, 1, 3, 5, 7), u = SIMD.Float32x4.shuffle(f, D, 2, 3, 6, 7), l = SIMD.Float32x4.shuffle(S, I, 2, 3, 6, 7), o = SIMD.Float32x4.shuffle(u, l, 0, 2, 4, 6), l = SIMD.Float32x4.shuffle(l, u, 1, 3, 5, 7), u = SIMD.Float32x4.mul(o, l), u = SIMD.Float32x4.swizzle(u, 1, 0, 3, 2), e = SIMD.Float32x4.mul(r, u), M = SIMD.Float32x4.mul(n, u), u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1), e = SIMD.Float32x4.sub(SIMD.Float32x4.mul(r, u), e), M = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, u), M), M = SIMD.Float32x4.swizzle(M, 2, 3, 0, 1), u = SIMD.Float32x4.mul(r, o), u = SIMD.Float32x4.swizzle(u, 1, 0, 3, 2), e = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, u), e), s = SIMD.Float32x4.mul(n, u), u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1), e = SIMD.Float32x4.sub(e, SIMD.Float32x4.mul(l, u)), s = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, u), s), s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1), u = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(r, 2, 3, 0, 1), l), u = SIMD.Float32x4.swizzle(u, 1, 0, 3, 2), o = SIMD.Float32x4.swizzle(o, 2, 3, 0, 1), e = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, u), e), i = SIMD.Float32x4.mul(n, u), u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1), e = SIMD.Float32x4.sub(e, SIMD.Float32x4.mul(o, u)), i = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, u), i), i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1), u = SIMD.Float32x4.mul(n, r), u = SIMD.Float32x4.swizzle(u, 1, 0, 3, 2), i = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, u), i), s = SIMD.Float32x4.sub(SIMD.Float32x4.mul(o, u), s), u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1), i = SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, u), i), s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(o, u)), u = SIMD.Float32x4.mul(n, l), u = SIMD.Float32x4.swizzle(u, 1, 0, 3, 2), M = SIMD.Float32x4.sub(M, SIMD.Float32x4.mul(o, u)), i = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, u), i), u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1), M = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, u), M), i = SIMD.Float32x4.sub(i, SIMD.Float32x4.mul(r, u)), u = SIMD.Float32x4.mul(n, o), u = SIMD.Float32x4.swizzle(u, 1, 0, 3, 2), M = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, u), M), s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(r, u)), u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1), M = SIMD.Float32x4.sub(M, SIMD.Float32x4.mul(l, u)), s = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, u), s), c = SIMD.Float32x4.mul(n, e), c = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), c), c = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), c), u = SIMD.Float32x4.reciprocalApproximation(c), c = SIMD.Float32x4.sub(SIMD.Float32x4.add(u, u), SIMD.Float32x4.mul(c, SIMD.Float32x4.mul(u, u))), (c = SIMD.Float32x4.swizzle(c, 0, 0, 0, 0)) ? (SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(c, e)), SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(c, M)), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(c, i)), SIMD.Float32x4.store(t, 12, SIMD.Float32x4.mul(c, s)), t) : null;
	    }, o.invert = r.USE_SIMD ? o.SIMD.invert : o.scalar.invert, o.scalar.adjoint = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          l = a[3],
	          u = a[4],
	          e = a[5],
	          M = a[6],
	          i = a[7],
	          s = a[8],
	          c = a[9],
	          f = a[10],
	          D = a[11],
	          S = a[12],
	          I = a[13],
	          x = a[14],
	          F = a[15];return t[0] = e * (f * F - D * x) - c * (M * F - i * x) + I * (M * D - i * f), t[1] = -(r * (f * F - D * x) - c * (o * F - l * x) + I * (o * D - l * f)), t[2] = r * (M * F - i * x) - e * (o * F - l * x) + I * (o * i - l * M), t[3] = -(r * (M * D - i * f) - e * (o * D - l * f) + c * (o * i - l * M)), t[4] = -(u * (f * F - D * x) - s * (M * F - i * x) + S * (M * D - i * f)), t[5] = n * (f * F - D * x) - s * (o * F - l * x) + S * (o * D - l * f), t[6] = -(n * (M * F - i * x) - u * (o * F - l * x) + S * (o * i - l * M)), t[7] = n * (M * D - i * f) - u * (o * D - l * f) + s * (o * i - l * M), t[8] = u * (c * F - D * I) - s * (e * F - i * I) + S * (e * D - i * c), t[9] = -(n * (c * F - D * I) - s * (r * F - l * I) + S * (r * D - l * c)), t[10] = n * (e * F - i * I) - u * (r * F - l * I) + S * (r * i - l * e), t[11] = -(n * (e * D - i * c) - u * (r * D - l * c) + s * (r * i - l * e)), t[12] = -(u * (c * x - f * I) - s * (e * x - M * I) + S * (e * f - M * c)), t[13] = n * (c * x - f * I) - s * (r * x - o * I) + S * (r * f - o * c), t[14] = -(n * (e * x - M * I) - u * (r * x - o * I) + S * (r * M - o * e)), t[15] = n * (e * f - M * c) - u * (r * f - o * c) + s * (r * M - o * e), t;
	    }, o.SIMD.adjoint = function (t, a) {
	      var n,
	          r,
	          o,
	          l,
	          u,
	          e,
	          M,
	          i,
	          s,
	          c,
	          f,
	          D,
	          S,
	          n = SIMD.Float32x4.load(a, 0),
	          r = SIMD.Float32x4.load(a, 4),
	          o = SIMD.Float32x4.load(a, 8),
	          l = SIMD.Float32x4.load(a, 12);return s = SIMD.Float32x4.shuffle(n, r, 0, 1, 4, 5), e = SIMD.Float32x4.shuffle(o, l, 0, 1, 4, 5), u = SIMD.Float32x4.shuffle(s, e, 0, 2, 4, 6), e = SIMD.Float32x4.shuffle(e, s, 1, 3, 5, 7), s = SIMD.Float32x4.shuffle(n, r, 2, 3, 6, 7), i = SIMD.Float32x4.shuffle(o, l, 2, 3, 6, 7), M = SIMD.Float32x4.shuffle(s, i, 0, 2, 4, 6), i = SIMD.Float32x4.shuffle(i, s, 1, 3, 5, 7), s = SIMD.Float32x4.mul(M, i), s = SIMD.Float32x4.swizzle(s, 1, 0, 3, 2), c = SIMD.Float32x4.mul(e, s), f = SIMD.Float32x4.mul(u, s), s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1), c = SIMD.Float32x4.sub(SIMD.Float32x4.mul(e, s), c), f = SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, s), f), f = SIMD.Float32x4.swizzle(f, 2, 3, 0, 1), s = SIMD.Float32x4.mul(e, M), s = SIMD.Float32x4.swizzle(s, 1, 0, 3, 2), c = SIMD.Float32x4.add(SIMD.Float32x4.mul(i, s), c), S = SIMD.Float32x4.mul(u, s), s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1), c = SIMD.Float32x4.sub(c, SIMD.Float32x4.mul(i, s)), S = SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, s), S), S = SIMD.Float32x4.swizzle(S, 2, 3, 0, 1), s = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 2, 3, 0, 1), i), s = SIMD.Float32x4.swizzle(s, 1, 0, 3, 2), M = SIMD.Float32x4.swizzle(M, 2, 3, 0, 1), c = SIMD.Float32x4.add(SIMD.Float32x4.mul(M, s), c), D = SIMD.Float32x4.mul(u, s), s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1), c = SIMD.Float32x4.sub(c, SIMD.Float32x4.mul(M, s)), D = SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, s), D), D = SIMD.Float32x4.swizzle(D, 2, 3, 0, 1), s = SIMD.Float32x4.mul(u, e), s = SIMD.Float32x4.swizzle(s, 1, 0, 3, 2), D = SIMD.Float32x4.add(SIMD.Float32x4.mul(i, s), D), S = SIMD.Float32x4.sub(SIMD.Float32x4.mul(M, s), S), s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1), D = SIMD.Float32x4.sub(SIMD.Float32x4.mul(i, s), D), S = SIMD.Float32x4.sub(S, SIMD.Float32x4.mul(M, s)), s = SIMD.Float32x4.mul(u, i), s = SIMD.Float32x4.swizzle(s, 1, 0, 3, 2), f = SIMD.Float32x4.sub(f, SIMD.Float32x4.mul(M, s)), D = SIMD.Float32x4.add(SIMD.Float32x4.mul(e, s), D), s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1), f = SIMD.Float32x4.add(SIMD.Float32x4.mul(M, s), f), D = SIMD.Float32x4.sub(D, SIMD.Float32x4.mul(e, s)), s = SIMD.Float32x4.mul(u, M), s = SIMD.Float32x4.swizzle(s, 1, 0, 3, 2), f = SIMD.Float32x4.add(SIMD.Float32x4.mul(i, s), f), S = SIMD.Float32x4.sub(S, SIMD.Float32x4.mul(e, s)), s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1), f = SIMD.Float32x4.sub(f, SIMD.Float32x4.mul(i, s)), S = SIMD.Float32x4.add(SIMD.Float32x4.mul(e, s), S), SIMD.Float32x4.store(t, 0, c), SIMD.Float32x4.store(t, 4, f), SIMD.Float32x4.store(t, 8, D), SIMD.Float32x4.store(t, 12, S), t;
	    }, o.adjoint = r.USE_SIMD ? o.SIMD.adjoint : o.scalar.adjoint, o.determinant = function (t) {
	      var a = t[0],
	          n = t[1],
	          r = t[2],
	          o = t[3],
	          l = t[4],
	          u = t[5],
	          e = t[6],
	          M = t[7],
	          i = t[8],
	          s = t[9],
	          c = t[10],
	          f = t[11],
	          D = t[12],
	          S = t[13],
	          I = t[14],
	          x = t[15],
	          F = a * u - n * l,
	          m = a * e - r * l,
	          h = a * M - o * l,
	          d = n * e - r * u,
	          v = n * M - o * u,
	          z = r * M - o * e,
	          p = i * S - s * D,
	          w = i * I - c * D,
	          A = i * x - f * D,
	          R = s * I - c * S,
	          b = s * x - f * S,
	          q = c * x - f * I;return F * q - m * b + h * R + d * A - v * w + z * p;
	    }, o.SIMD.multiply = function (t, a, n) {
	      var r = SIMD.Float32x4.load(a, 0),
	          o = SIMD.Float32x4.load(a, 4),
	          l = SIMD.Float32x4.load(a, 8),
	          u = SIMD.Float32x4.load(a, 12),
	          e = SIMD.Float32x4.load(n, 0),
	          M = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 1, 1, 1, 1), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 2, 2, 2, 2), l), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 3, 3, 3, 3), u))));SIMD.Float32x4.store(t, 0, M);var i = SIMD.Float32x4.load(n, 4),
	          s = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(i, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(i, 1, 1, 1, 1), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(i, 2, 2, 2, 2), l), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(i, 3, 3, 3, 3), u))));SIMD.Float32x4.store(t, 4, s);var c = SIMD.Float32x4.load(n, 8),
	          f = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 1, 1, 1, 1), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 2, 2, 2, 2), l), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 3, 3, 3, 3), u))));SIMD.Float32x4.store(t, 8, f);var D = SIMD.Float32x4.load(n, 12),
	          S = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(D, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(D, 1, 1, 1, 1), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(D, 2, 2, 2, 2), l), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(D, 3, 3, 3, 3), u))));return SIMD.Float32x4.store(t, 12, S), t;
	    }, o.scalar.multiply = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = a[4],
	          M = a[5],
	          i = a[6],
	          s = a[7],
	          c = a[8],
	          f = a[9],
	          D = a[10],
	          S = a[11],
	          I = a[12],
	          x = a[13],
	          F = a[14],
	          m = a[15],
	          h = n[0],
	          d = n[1],
	          v = n[2],
	          z = n[3];return t[0] = h * r + d * e + v * c + z * I, t[1] = h * o + d * M + v * f + z * x, t[2] = h * l + d * i + v * D + z * F, t[3] = h * u + d * s + v * S + z * m, h = n[4], d = n[5], v = n[6], z = n[7], t[4] = h * r + d * e + v * c + z * I, t[5] = h * o + d * M + v * f + z * x, t[6] = h * l + d * i + v * D + z * F, t[7] = h * u + d * s + v * S + z * m, h = n[8], d = n[9], v = n[10], z = n[11], t[8] = h * r + d * e + v * c + z * I, t[9] = h * o + d * M + v * f + z * x, t[10] = h * l + d * i + v * D + z * F, t[11] = h * u + d * s + v * S + z * m, h = n[12], d = n[13], v = n[14], z = n[15], t[12] = h * r + d * e + v * c + z * I, t[13] = h * o + d * M + v * f + z * x, t[14] = h * l + d * i + v * D + z * F, t[15] = h * u + d * s + v * S + z * m, t;
	    }, o.multiply = r.USE_SIMD ? o.SIMD.multiply : o.scalar.multiply, o.mul = o.multiply, o.scalar.translate = function (t, a, n) {
	      var r,
	          o,
	          l,
	          u,
	          e,
	          M,
	          i,
	          s,
	          c,
	          f,
	          D,
	          S,
	          I = n[0],
	          x = n[1],
	          F = n[2];return a === t ? (t[12] = a[0] * I + a[4] * x + a[8] * F + a[12], t[13] = a[1] * I + a[5] * x + a[9] * F + a[13], t[14] = a[2] * I + a[6] * x + a[10] * F + a[14], t[15] = a[3] * I + a[7] * x + a[11] * F + a[15]) : (r = a[0], o = a[1], l = a[2], u = a[3], e = a[4], M = a[5], i = a[6], s = a[7], c = a[8], f = a[9], D = a[10], S = a[11], t[0] = r, t[1] = o, t[2] = l, t[3] = u, t[4] = e, t[5] = M, t[6] = i, t[7] = s, t[8] = c, t[9] = f, t[10] = D, t[11] = S, t[12] = r * I + e * x + c * F + a[12], t[13] = o * I + M * x + f * F + a[13], t[14] = l * I + i * x + D * F + a[14], t[15] = u * I + s * x + S * F + a[15]), t;
	    }, o.SIMD.translate = function (t, a, n) {
	      var r = SIMD.Float32x4.load(a, 0),
	          o = SIMD.Float32x4.load(a, 4),
	          l = SIMD.Float32x4.load(a, 8),
	          u = SIMD.Float32x4.load(a, 12),
	          e = SIMD.Float32x4(n[0], n[1], n[2], 0);a !== t && (t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11]), r = SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(e, 0, 0, 0, 0)), o = SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(e, 1, 1, 1, 1)), l = SIMD.Float32x4.mul(l, SIMD.Float32x4.swizzle(e, 2, 2, 2, 2));var M = SIMD.Float32x4.add(r, SIMD.Float32x4.add(o, SIMD.Float32x4.add(l, u)));return SIMD.Float32x4.store(t, 12, M), t;
	    }, o.translate = r.USE_SIMD ? o.SIMD.translate : o.scalar.translate, o.scalar.scale = function (t, a, n) {
	      var r = n[0],
	          o = n[1],
	          l = n[2];return t[0] = a[0] * r, t[1] = a[1] * r, t[2] = a[2] * r, t[3] = a[3] * r, t[4] = a[4] * o, t[5] = a[5] * o, t[6] = a[6] * o, t[7] = a[7] * o, t[8] = a[8] * l, t[9] = a[9] * l, t[10] = a[10] * l, t[11] = a[11] * l, t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15], t;
	    }, o.SIMD.scale = function (t, a, n) {
	      var r,
	          o,
	          l,
	          u = SIMD.Float32x4(n[0], n[1], n[2], 0);return r = SIMD.Float32x4.load(a, 0), SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(u, 0, 0, 0, 0))), o = SIMD.Float32x4.load(a, 4), SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(u, 1, 1, 1, 1))), l = SIMD.Float32x4.load(a, 8), SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(l, SIMD.Float32x4.swizzle(u, 2, 2, 2, 2))), t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15], t;
	    }, o.scale = r.USE_SIMD ? o.SIMD.scale : o.scalar.scale, o.rotate = function (t, a, n, o) {
	      var l,
	          u,
	          e,
	          M,
	          i,
	          s,
	          c,
	          f,
	          D,
	          S,
	          I,
	          x,
	          F,
	          m,
	          h,
	          d,
	          v,
	          z,
	          p,
	          w,
	          A,
	          R,
	          b,
	          q,
	          y = o[0],
	          Y = o[1],
	          g = o[2],
	          E = Math.sqrt(y * y + Y * Y + g * g);return Math.abs(E) < r.EPSILON ? null : (E = 1 / E, y *= E, Y *= E, g *= E, l = Math.sin(n), u = Math.cos(n), e = 1 - u, M = a[0], i = a[1], s = a[2], c = a[3], f = a[4], D = a[5], S = a[6], I = a[7], x = a[8], F = a[9], m = a[10], h = a[11], d = y * y * e + u, v = Y * y * e + g * l, z = g * y * e - Y * l, p = y * Y * e - g * l, w = Y * Y * e + u, A = g * Y * e + y * l, R = y * g * e + Y * l, b = Y * g * e - y * l, q = g * g * e + u, t[0] = M * d + f * v + x * z, t[1] = i * d + D * v + F * z, t[2] = s * d + S * v + m * z, t[3] = c * d + I * v + h * z, t[4] = M * p + f * w + x * A, t[5] = i * p + D * w + F * A, t[6] = s * p + S * w + m * A, t[7] = c * p + I * w + h * A, t[8] = M * R + f * b + x * q, t[9] = i * R + D * b + F * q, t[10] = s * R + S * b + m * q, t[11] = c * R + I * b + h * q, a !== t && (t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t);
	    }, o.rotateX = function (t, a, n) {
	      var r = Math.sin(n),
	          o = Math.cos(n),
	          l = a[4],
	          u = a[5],
	          e = a[6],
	          M = a[7],
	          i = a[8],
	          s = a[9],
	          c = a[10],
	          f = a[11];return a !== t && (t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t[4] = l * o + i * r, t[5] = u * o + s * r, t[6] = e * o + c * r, t[7] = M * o + f * r, t[8] = i * o - l * r, t[9] = s * o - u * r, t[10] = c * o - e * r, t[11] = f * o - M * r, t;
	    }, o.rotateY = function (t, a, n) {
	      var r = Math.sin(n),
	          o = Math.cos(n),
	          l = a[0],
	          u = a[1],
	          e = a[2],
	          M = a[3],
	          i = a[8],
	          s = a[9],
	          c = a[10],
	          f = a[11];return a !== t && (t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t[0] = l * o - i * r, t[1] = u * o - s * r, t[2] = e * o - c * r, t[3] = M * o - f * r, t[8] = l * r + i * o, t[9] = u * r + s * o, t[10] = e * r + c * o, t[11] = M * r + f * o, t;
	    }, o.rotateZ = function (t, a, n) {
	      var r = Math.sin(n),
	          o = Math.cos(n),
	          l = a[0],
	          u = a[1],
	          e = a[2],
	          M = a[3],
	          i = a[4],
	          s = a[5],
	          c = a[6],
	          f = a[7];return a !== t && (t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t[0] = l * o + i * r, t[1] = u * o + s * r, t[2] = e * o + c * r, t[3] = M * o + f * r, t[4] = i * o - l * r, t[5] = s * o - u * r, t[6] = c * o - e * r, t[7] = f * o - M * r, t;
	    }, o.fromTranslation = function (t, a) {
	      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = a[0], t[13] = a[1], t[14] = a[2], t[15] = 1, t;
	    }, o.fromScaling = function (t, a) {
	      return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = a[1], t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = a[2], t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.fromRotation = function (t, a, n) {
	      var o,
	          l,
	          u,
	          e = n[0],
	          M = n[1],
	          i = n[2],
	          s = Math.sqrt(e * e + M * M + i * i);return Math.abs(s) < r.EPSILON ? null : (s = 1 / s, e *= s, M *= s, i *= s, o = Math.sin(a), l = Math.cos(a), u = 1 - l, t[0] = e * e * u + l, t[1] = M * e * u + i * o, t[2] = i * e * u - M * o, t[3] = 0, t[4] = e * M * u - i * o, t[5] = M * M * u + l, t[6] = i * M * u + e * o, t[7] = 0, t[8] = e * i * u + M * o, t[9] = M * i * u - e * o, t[10] = i * i * u + l, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t);
	    }, o.fromXRotation = function (t, a) {
	      var n = Math.sin(a),
	          r = Math.cos(a);return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = r, t[6] = n, t[7] = 0, t[8] = 0, t[9] = -n, t[10] = r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.fromYRotation = function (t, a) {
	      var n = Math.sin(a),
	          r = Math.cos(a);return t[0] = r, t[1] = 0, t[2] = -n, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = n, t[9] = 0, t[10] = r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.fromZRotation = function (t, a) {
	      var n = Math.sin(a),
	          r = Math.cos(a);return t[0] = r, t[1] = n, t[2] = 0, t[3] = 0, t[4] = -n, t[5] = r, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.fromRotationTranslation = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = r + r,
	          M = o + o,
	          i = l + l,
	          s = r * e,
	          c = r * M,
	          f = r * i,
	          D = o * M,
	          S = o * i,
	          I = l * i,
	          x = u * e,
	          F = u * M,
	          m = u * i;return t[0] = 1 - (D + I), t[1] = c + m, t[2] = f - F, t[3] = 0, t[4] = c - m, t[5] = 1 - (s + I), t[6] = S + x, t[7] = 0, t[8] = f + F, t[9] = S - x, t[10] = 1 - (s + D), t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t;
	    }, o.fromRotationTranslationScale = function (t, a, n, r) {
	      var o = a[0],
	          l = a[1],
	          u = a[2],
	          e = a[3],
	          M = o + o,
	          i = l + l,
	          s = u + u,
	          c = o * M,
	          f = o * i,
	          D = o * s,
	          S = l * i,
	          I = l * s,
	          x = u * s,
	          F = e * M,
	          m = e * i,
	          h = e * s,
	          d = r[0],
	          v = r[1],
	          z = r[2];return t[0] = (1 - (S + x)) * d, t[1] = (f + h) * d, t[2] = (D - m) * d, t[3] = 0, t[4] = (f - h) * v, t[5] = (1 - (c + x)) * v, t[6] = (I + F) * v, t[7] = 0, t[8] = (D + m) * z, t[9] = (I - F) * z, t[10] = (1 - (c + S)) * z, t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t;
	    }, o.fromRotationTranslationScaleOrigin = function (t, a, n, r, o) {
	      var l = a[0],
	          u = a[1],
	          e = a[2],
	          M = a[3],
	          i = l + l,
	          s = u + u,
	          c = e + e,
	          f = l * i,
	          D = l * s,
	          S = l * c,
	          I = u * s,
	          x = u * c,
	          F = e * c,
	          m = M * i,
	          h = M * s,
	          d = M * c,
	          v = r[0],
	          z = r[1],
	          p = r[2],
	          w = o[0],
	          A = o[1],
	          R = o[2];return t[0] = (1 - (I + F)) * v, t[1] = (D + d) * v, t[2] = (S - h) * v, t[3] = 0, t[4] = (D - d) * z, t[5] = (1 - (f + F)) * z, t[6] = (x + m) * z, t[7] = 0, t[8] = (S + h) * p, t[9] = (x - m) * p, t[10] = (1 - (f + I)) * p, t[11] = 0, t[12] = n[0] + w - (t[0] * w + t[4] * A + t[8] * R), t[13] = n[1] + A - (t[1] * w + t[5] * A + t[9] * R), t[14] = n[2] + R - (t[2] * w + t[6] * A + t[10] * R), t[15] = 1, t;
	    }, o.fromQuat = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          l = a[3],
	          u = n + n,
	          e = r + r,
	          M = o + o,
	          i = n * u,
	          s = r * u,
	          c = r * e,
	          f = o * u,
	          D = o * e,
	          S = o * M,
	          I = l * u,
	          x = l * e,
	          F = l * M;return t[0] = 1 - c - S, t[1] = s + F, t[2] = f - x, t[3] = 0, t[4] = s - F, t[5] = 1 - i - S, t[6] = D + I, t[7] = 0, t[8] = f + x, t[9] = D - I, t[10] = 1 - i - c, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
	    }, o.frustum = function (t, a, n, r, o, l, u) {
	      var e = 1 / (n - a),
	          M = 1 / (o - r),
	          i = 1 / (l - u);return t[0] = 2 * l * e, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 2 * l * M, t[6] = 0, t[7] = 0, t[8] = (n + a) * e, t[9] = (o + r) * M, t[10] = (u + l) * i, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = u * l * 2 * i, t[15] = 0, t;
	    }, o.perspective = function (t, a, n, r, o) {
	      var l = 1 / Math.tan(a / 2),
	          u = 1 / (r - o);return t[0] = l / n, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = l, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = (o + r) * u, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = 2 * o * r * u, t[15] = 0, t;
	    }, o.perspectiveFromFieldOfView = function (t, a, n, r) {
	      var o = Math.tan(a.upDegrees * Math.PI / 180),
	          l = Math.tan(a.downDegrees * Math.PI / 180),
	          u = Math.tan(a.leftDegrees * Math.PI / 180),
	          e = Math.tan(a.rightDegrees * Math.PI / 180),
	          M = 2 / (u + e),
	          i = 2 / (o + l);return t[0] = M, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = i, t[6] = 0, t[7] = 0, t[8] = -((u - e) * M * .5), t[9] = (o - l) * i * .5, t[10] = r / (n - r), t[11] = -1, t[12] = 0, t[13] = 0, t[14] = r * n / (n - r), t[15] = 0, t;
	    }, o.ortho = function (t, a, n, r, o, l, u) {
	      var e = 1 / (a - n),
	          M = 1 / (r - o),
	          i = 1 / (l - u);return t[0] = -2 * e, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * M, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 2 * i, t[11] = 0, t[12] = (a + n) * e, t[13] = (o + r) * M, t[14] = (u + l) * i, t[15] = 1, t;
	    }, o.lookAt = function (t, a, n, l) {
	      var u,
	          e,
	          M,
	          i,
	          s,
	          c,
	          f,
	          D,
	          S,
	          I,
	          x = a[0],
	          F = a[1],
	          m = a[2],
	          h = l[0],
	          d = l[1],
	          v = l[2],
	          z = n[0],
	          p = n[1],
	          w = n[2];return Math.abs(x - z) < r.EPSILON && Math.abs(F - p) < r.EPSILON && Math.abs(m - w) < r.EPSILON ? o.identity(t) : (f = x - z, D = F - p, S = m - w, I = 1 / Math.sqrt(f * f + D * D + S * S), f *= I, D *= I, S *= I, u = d * S - v * D, e = v * f - h * S, M = h * D - d * f, I = Math.sqrt(u * u + e * e + M * M), I ? (I = 1 / I, u *= I, e *= I, M *= I) : (u = 0, e = 0, M = 0), i = D * M - S * e, s = S * u - f * M, c = f * e - D * u, I = Math.sqrt(i * i + s * s + c * c), I ? (I = 1 / I, i *= I, s *= I, c *= I) : (i = 0, s = 0, c = 0), t[0] = u, t[1] = i, t[2] = f, t[3] = 0, t[4] = e, t[5] = s, t[6] = D, t[7] = 0, t[8] = M, t[9] = c, t[10] = S, t[11] = 0, t[12] = -(u * x + e * F + M * m), t[13] = -(i * x + s * F + c * m), t[14] = -(f * x + D * F + S * m), t[15] = 1, t);
	    }, o.str = function (t) {
	      return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")";
	    }, o.frob = function (t) {
	      return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) + Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2));
	    }, t.exports = o;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = n(4),
	        l = n(7),
	        u = n(8),
	        e = {};e.create = function () {
	      var t = new r.ARRAY_TYPE(4);return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t;
	    }, e.rotationTo = function () {
	      var t = l.create(),
	          a = l.fromValues(1, 0, 0),
	          n = l.fromValues(0, 1, 0);return function (r, o, u) {
	        var M = l.dot(o, u);return -.999999 > M ? (l.cross(t, a, o), l.length(t) < 1e-6 && l.cross(t, n, o), l.normalize(t, t), e.setAxisAngle(r, t, Math.PI), r) : M > .999999 ? (r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 1, r) : (l.cross(t, o, u), r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = 1 + M, e.normalize(r, r));
	      };
	    }(), e.setAxes = function () {
	      var t = o.create();return function (a, n, r, o) {
	        return t[0] = r[0], t[3] = r[1], t[6] = r[2], t[1] = o[0], t[4] = o[1], t[7] = o[2], t[2] = -n[0], t[5] = -n[1], t[8] = -n[2], e.normalize(a, e.fromMat3(a, t));
	      };
	    }(), e.clone = u.clone, e.fromValues = u.fromValues, e.copy = u.copy, e.set = u.set, e.identity = function (t) {
	      return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t;
	    }, e.setAxisAngle = function (t, a, n) {
	      n = .5 * n;var r = Math.sin(n);return t[0] = r * a[0], t[1] = r * a[1], t[2] = r * a[2], t[3] = Math.cos(n), t;
	    }, e.add = u.add, e.multiply = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = n[0],
	          M = n[1],
	          i = n[2],
	          s = n[3];return t[0] = r * s + u * e + o * i - l * M, t[1] = o * s + u * M + l * e - r * i, t[2] = l * s + u * i + r * M - o * e, t[3] = u * s - r * e - o * M - l * i, t;
	    }, e.mul = e.multiply, e.scale = u.scale, e.rotateX = function (t, a, n) {
	      n *= .5;var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = Math.sin(n),
	          M = Math.cos(n);return t[0] = r * M + u * e, t[1] = o * M + l * e, t[2] = l * M - o * e, t[3] = u * M - r * e, t;
	    }, e.rotateY = function (t, a, n) {
	      n *= .5;var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = Math.sin(n),
	          M = Math.cos(n);return t[0] = r * M - l * e, t[1] = o * M + u * e, t[2] = l * M + r * e, t[3] = u * M - o * e, t;
	    }, e.rotateZ = function (t, a, n) {
	      n *= .5;var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3],
	          e = Math.sin(n),
	          M = Math.cos(n);return t[0] = r * M + o * e, t[1] = o * M - r * e, t[2] = l * M + u * e, t[3] = u * M - l * e, t;
	    }, e.calculateW = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2];return t[0] = n, t[1] = r, t[2] = o, t[3] = Math.sqrt(Math.abs(1 - n * n - r * r - o * o)), t;
	    }, e.dot = u.dot, e.lerp = u.lerp, e.slerp = function (t, a, n, r) {
	      var o,
	          l,
	          u,
	          e,
	          M,
	          i = a[0],
	          s = a[1],
	          c = a[2],
	          f = a[3],
	          D = n[0],
	          S = n[1],
	          I = n[2],
	          x = n[3];return l = i * D + s * S + c * I + f * x, 0 > l && (l = -l, D = -D, S = -S, I = -I, x = -x), 1 - l > 1e-6 ? (o = Math.acos(l), u = Math.sin(o), e = Math.sin((1 - r) * o) / u, M = Math.sin(r * o) / u) : (e = 1 - r, M = r), t[0] = e * i + M * D, t[1] = e * s + M * S, t[2] = e * c + M * I, t[3] = e * f + M * x, t;
	    }, e.sqlerp = function () {
	      var t = e.create(),
	          a = e.create();return function (n, r, o, l, u, M) {
	        return e.slerp(t, r, u, M), e.slerp(a, o, l, M), e.slerp(n, t, a, 2 * M * (1 - M)), n;
	      };
	    }(), e.invert = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          l = a[3],
	          u = n * n + r * r + o * o + l * l,
	          e = u ? 1 / u : 0;return t[0] = -n * e, t[1] = -r * e, t[2] = -o * e, t[3] = l * e, t;
	    }, e.conjugate = function (t, a) {
	      return t[0] = -a[0], t[1] = -a[1], t[2] = -a[2], t[3] = a[3], t;
	    }, e.length = u.length, e.len = e.length, e.squaredLength = u.squaredLength, e.sqrLen = e.squaredLength, e.normalize = u.normalize, e.fromMat3 = function (t, a) {
	      var n,
	          r = a[0] + a[4] + a[8];if (r > 0) n = Math.sqrt(r + 1), t[3] = .5 * n, n = .5 / n, t[0] = (a[5] - a[7]) * n, t[1] = (a[6] - a[2]) * n, t[2] = (a[1] - a[3]) * n;else {
	        var o = 0;a[4] > a[0] && (o = 1), a[8] > a[3 * o + o] && (o = 2);var l = (o + 1) % 3,
	            u = (o + 2) % 3;n = Math.sqrt(a[3 * o + o] - a[3 * l + l] - a[3 * u + u] + 1), t[o] = .5 * n, n = .5 / n, t[3] = (a[3 * l + u] - a[3 * u + l]) * n, t[l] = (a[3 * l + o] + a[3 * o + l]) * n, t[u] = (a[3 * u + o] + a[3 * o + u]) * n;
	      }return t;
	    }, e.str = function (t) {
	      return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
	    }, t.exports = e;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = {};o.create = function () {
	      var t = new r.ARRAY_TYPE(3);return t[0] = 0, t[1] = 0, t[2] = 0, t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(3);return a[0] = t[0], a[1] = t[1], a[2] = t[2], a;
	    }, o.fromValues = function (t, a, n) {
	      var o = new r.ARRAY_TYPE(3);return o[0] = t, o[1] = a, o[2] = n, o;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t;
	    }, o.set = function (t, a, n, r) {
	      return t[0] = a, t[1] = n, t[2] = r, t;
	    }, o.add = function (t, a, n) {
	      return t[0] = a[0] + n[0], t[1] = a[1] + n[1], t[2] = a[2] + n[2], t;
	    }, o.subtract = function (t, a, n) {
	      return t[0] = a[0] - n[0], t[1] = a[1] - n[1], t[2] = a[2] - n[2], t;
	    }, o.sub = o.subtract, o.multiply = function (t, a, n) {
	      return t[0] = a[0] * n[0], t[1] = a[1] * n[1], t[2] = a[2] * n[2], t;
	    }, o.mul = o.multiply, o.divide = function (t, a, n) {
	      return t[0] = a[0] / n[0], t[1] = a[1] / n[1], t[2] = a[2] / n[2], t;
	    }, o.div = o.divide, o.min = function (t, a, n) {
	      return t[0] = Math.min(a[0], n[0]), t[1] = Math.min(a[1], n[1]), t[2] = Math.min(a[2], n[2]), t;
	    }, o.max = function (t, a, n) {
	      return t[0] = Math.max(a[0], n[0]), t[1] = Math.max(a[1], n[1]), t[2] = Math.max(a[2], n[2]), t;
	    }, o.scale = function (t, a, n) {
	      return t[0] = a[0] * n, t[1] = a[1] * n, t[2] = a[2] * n, t;
	    }, o.scaleAndAdd = function (t, a, n, r) {
	      return t[0] = a[0] + n[0] * r, t[1] = a[1] + n[1] * r, t[2] = a[2] + n[2] * r, t;
	    }, o.distance = function (t, a) {
	      var n = a[0] - t[0],
	          r = a[1] - t[1],
	          o = a[2] - t[2];return Math.sqrt(n * n + r * r + o * o);
	    }, o.dist = o.distance, o.squaredDistance = function (t, a) {
	      var n = a[0] - t[0],
	          r = a[1] - t[1],
	          o = a[2] - t[2];return n * n + r * r + o * o;
	    }, o.sqrDist = o.squaredDistance, o.length = function (t) {
	      var a = t[0],
	          n = t[1],
	          r = t[2];return Math.sqrt(a * a + n * n + r * r);
	    }, o.len = o.length, o.squaredLength = function (t) {
	      var a = t[0],
	          n = t[1],
	          r = t[2];return a * a + n * n + r * r;
	    }, o.sqrLen = o.squaredLength, o.negate = function (t, a) {
	      return t[0] = -a[0], t[1] = -a[1], t[2] = -a[2], t;
	    }, o.inverse = function (t, a) {
	      return t[0] = 1 / a[0], t[1] = 1 / a[1], t[2] = 1 / a[2], t;
	    }, o.normalize = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          l = n * n + r * r + o * o;return l > 0 && (l = 1 / Math.sqrt(l), t[0] = a[0] * l, t[1] = a[1] * l, t[2] = a[2] * l), t;
	    }, o.dot = function (t, a) {
	      return t[0] * a[0] + t[1] * a[1] + t[2] * a[2];
	    }, o.cross = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = n[0],
	          e = n[1],
	          M = n[2];return t[0] = o * M - l * e, t[1] = l * u - r * M, t[2] = r * e - o * u, t;
	    }, o.lerp = function (t, a, n, r) {
	      var o = a[0],
	          l = a[1],
	          u = a[2];return t[0] = o + r * (n[0] - o), t[1] = l + r * (n[1] - l), t[2] = u + r * (n[2] - u), t;
	    }, o.hermite = function (t, a, n, r, o, l) {
	      var u = l * l,
	          e = u * (2 * l - 3) + 1,
	          M = u * (l - 2) + l,
	          i = u * (l - 1),
	          s = u * (3 - 2 * l);return t[0] = a[0] * e + n[0] * M + r[0] * i + o[0] * s, t[1] = a[1] * e + n[1] * M + r[1] * i + o[1] * s, t[2] = a[2] * e + n[2] * M + r[2] * i + o[2] * s, t;
	    }, o.bezier = function (t, a, n, r, o, l) {
	      var u = 1 - l,
	          e = u * u,
	          M = l * l,
	          i = e * u,
	          s = 3 * l * e,
	          c = 3 * M * u,
	          f = M * l;return t[0] = a[0] * i + n[0] * s + r[0] * c + o[0] * f, t[1] = a[1] * i + n[1] * s + r[1] * c + o[1] * f, t[2] = a[2] * i + n[2] * s + r[2] * c + o[2] * f, t;
	    }, o.random = function (t, a) {
	      a = a || 1;var n = 2 * r.RANDOM() * Math.PI,
	          o = 2 * r.RANDOM() - 1,
	          l = Math.sqrt(1 - o * o) * a;return t[0] = Math.cos(n) * l, t[1] = Math.sin(n) * l, t[2] = o * a, t;
	    }, o.transformMat4 = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = n[3] * r + n[7] * o + n[11] * l + n[15];return u = u || 1, t[0] = (n[0] * r + n[4] * o + n[8] * l + n[12]) / u, t[1] = (n[1] * r + n[5] * o + n[9] * l + n[13]) / u, t[2] = (n[2] * r + n[6] * o + n[10] * l + n[14]) / u, t;
	    }, o.transformMat3 = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2];return t[0] = r * n[0] + o * n[3] + l * n[6], t[1] = r * n[1] + o * n[4] + l * n[7], t[2] = r * n[2] + o * n[5] + l * n[8], t;
	    }, o.transformQuat = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = n[0],
	          e = n[1],
	          M = n[2],
	          i = n[3],
	          s = i * r + e * l - M * o,
	          c = i * o + M * r - u * l,
	          f = i * l + u * o - e * r,
	          D = -u * r - e * o - M * l;return t[0] = s * i + D * -u + c * -M - f * -e, t[1] = c * i + D * -e + f * -u - s * -M, t[2] = f * i + D * -M + s * -e - c * -u, t;
	    }, o.rotateX = function (t, a, n, r) {
	      var o = [],
	          l = [];return o[0] = a[0] - n[0], o[1] = a[1] - n[1], o[2] = a[2] - n[2], l[0] = o[0], l[1] = o[1] * Math.cos(r) - o[2] * Math.sin(r), l[2] = o[1] * Math.sin(r) + o[2] * Math.cos(r), t[0] = l[0] + n[0], t[1] = l[1] + n[1], t[2] = l[2] + n[2], t;
	    }, o.rotateY = function (t, a, n, r) {
	      var o = [],
	          l = [];return o[0] = a[0] - n[0], o[1] = a[1] - n[1], o[2] = a[2] - n[2], l[0] = o[2] * Math.sin(r) + o[0] * Math.cos(r), l[1] = o[1], l[2] = o[2] * Math.cos(r) - o[0] * Math.sin(r), t[0] = l[0] + n[0], t[1] = l[1] + n[1], t[2] = l[2] + n[2], t;
	    }, o.rotateZ = function (t, a, n, r) {
	      var o = [],
	          l = [];return o[0] = a[0] - n[0], o[1] = a[1] - n[1], o[2] = a[2] - n[2], l[0] = o[0] * Math.cos(r) - o[1] * Math.sin(r), l[1] = o[0] * Math.sin(r) + o[1] * Math.cos(r), l[2] = o[2], t[0] = l[0] + n[0], t[1] = l[1] + n[1], t[2] = l[2] + n[2], t;
	    }, o.forEach = function () {
	      var t = o.create();return function (a, n, r, o, l, u) {
	        var e, M;for (n || (n = 3), r || (r = 0), M = o ? Math.min(o * n + r, a.length) : a.length, e = r; M > e; e += n) {
	          t[0] = a[e], t[1] = a[e + 1], t[2] = a[e + 2], l(t, t, u), a[e] = t[0], a[e + 1] = t[1], a[e + 2] = t[2];
	        }return a;
	      };
	    }(), o.angle = function (t, a) {
	      var n = o.fromValues(t[0], t[1], t[2]),
	          r = o.fromValues(a[0], a[1], a[2]);o.normalize(n, n), o.normalize(r, r);var l = o.dot(n, r);return l > 1 ? 0 : Math.acos(l);
	    }, o.str = function (t) {
	      return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")";
	    }, t.exports = o;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = {};o.create = function () {
	      var t = new r.ARRAY_TYPE(4);return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(4);return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a;
	    }, o.fromValues = function (t, a, n, o) {
	      var l = new r.ARRAY_TYPE(4);return l[0] = t, l[1] = a, l[2] = n, l[3] = o, l;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t;
	    }, o.set = function (t, a, n, r, o) {
	      return t[0] = a, t[1] = n, t[2] = r, t[3] = o, t;
	    }, o.add = function (t, a, n) {
	      return t[0] = a[0] + n[0], t[1] = a[1] + n[1], t[2] = a[2] + n[2], t[3] = a[3] + n[3], t;
	    }, o.subtract = function (t, a, n) {
	      return t[0] = a[0] - n[0], t[1] = a[1] - n[1], t[2] = a[2] - n[2], t[3] = a[3] - n[3], t;
	    }, o.sub = o.subtract, o.multiply = function (t, a, n) {
	      return t[0] = a[0] * n[0], t[1] = a[1] * n[1], t[2] = a[2] * n[2], t[3] = a[3] * n[3], t;
	    }, o.mul = o.multiply, o.divide = function (t, a, n) {
	      return t[0] = a[0] / n[0], t[1] = a[1] / n[1], t[2] = a[2] / n[2], t[3] = a[3] / n[3], t;
	    }, o.div = o.divide, o.min = function (t, a, n) {
	      return t[0] = Math.min(a[0], n[0]), t[1] = Math.min(a[1], n[1]), t[2] = Math.min(a[2], n[2]), t[3] = Math.min(a[3], n[3]), t;
	    }, o.max = function (t, a, n) {
	      return t[0] = Math.max(a[0], n[0]), t[1] = Math.max(a[1], n[1]), t[2] = Math.max(a[2], n[2]), t[3] = Math.max(a[3], n[3]), t;
	    }, o.scale = function (t, a, n) {
	      return t[0] = a[0] * n, t[1] = a[1] * n, t[2] = a[2] * n, t[3] = a[3] * n, t;
	    }, o.scaleAndAdd = function (t, a, n, r) {
	      return t[0] = a[0] + n[0] * r, t[1] = a[1] + n[1] * r, t[2] = a[2] + n[2] * r, t[3] = a[3] + n[3] * r, t;
	    }, o.distance = function (t, a) {
	      var n = a[0] - t[0],
	          r = a[1] - t[1],
	          o = a[2] - t[2],
	          l = a[3] - t[3];return Math.sqrt(n * n + r * r + o * o + l * l);
	    }, o.dist = o.distance, o.squaredDistance = function (t, a) {
	      var n = a[0] - t[0],
	          r = a[1] - t[1],
	          o = a[2] - t[2],
	          l = a[3] - t[3];return n * n + r * r + o * o + l * l;
	    }, o.sqrDist = o.squaredDistance, o.length = function (t) {
	      var a = t[0],
	          n = t[1],
	          r = t[2],
	          o = t[3];return Math.sqrt(a * a + n * n + r * r + o * o);
	    }, o.len = o.length, o.squaredLength = function (t) {
	      var a = t[0],
	          n = t[1],
	          r = t[2],
	          o = t[3];return a * a + n * n + r * r + o * o;
	    }, o.sqrLen = o.squaredLength, o.negate = function (t, a) {
	      return t[0] = -a[0], t[1] = -a[1], t[2] = -a[2], t[3] = -a[3], t;
	    }, o.inverse = function (t, a) {
	      return t[0] = 1 / a[0], t[1] = 1 / a[1], t[2] = 1 / a[2], t[3] = 1 / a[3], t;
	    }, o.normalize = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = a[2],
	          l = a[3],
	          u = n * n + r * r + o * o + l * l;return u > 0 && (u = 1 / Math.sqrt(u), t[0] = n * u, t[1] = r * u, t[2] = o * u, t[3] = l * u), t;
	    }, o.dot = function (t, a) {
	      return t[0] * a[0] + t[1] * a[1] + t[2] * a[2] + t[3] * a[3];
	    }, o.lerp = function (t, a, n, r) {
	      var o = a[0],
	          l = a[1],
	          u = a[2],
	          e = a[3];return t[0] = o + r * (n[0] - o), t[1] = l + r * (n[1] - l), t[2] = u + r * (n[2] - u), t[3] = e + r * (n[3] - e), t;
	    }, o.random = function (t, a) {
	      return a = a || 1, t[0] = r.RANDOM(), t[1] = r.RANDOM(), t[2] = r.RANDOM(), t[3] = r.RANDOM(), o.normalize(t, t), o.scale(t, t, a), t;
	    }, o.transformMat4 = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = a[3];return t[0] = n[0] * r + n[4] * o + n[8] * l + n[12] * u, t[1] = n[1] * r + n[5] * o + n[9] * l + n[13] * u, t[2] = n[2] * r + n[6] * o + n[10] * l + n[14] * u, t[3] = n[3] * r + n[7] * o + n[11] * l + n[15] * u, t;
	    }, o.transformQuat = function (t, a, n) {
	      var r = a[0],
	          o = a[1],
	          l = a[2],
	          u = n[0],
	          e = n[1],
	          M = n[2],
	          i = n[3],
	          s = i * r + e * l - M * o,
	          c = i * o + M * r - u * l,
	          f = i * l + u * o - e * r,
	          D = -u * r - e * o - M * l;return t[0] = s * i + D * -u + c * -M - f * -e, t[1] = c * i + D * -e + f * -u - s * -M, t[2] = f * i + D * -M + s * -e - c * -u, t[3] = a[3], t;
	    }, o.forEach = function () {
	      var t = o.create();return function (a, n, r, o, l, u) {
	        var e, M;for (n || (n = 4), r || (r = 0), M = o ? Math.min(o * n + r, a.length) : a.length, e = r; M > e; e += n) {
	          t[0] = a[e], t[1] = a[e + 1], t[2] = a[e + 2], t[3] = a[e + 3], l(t, t, u), a[e] = t[0], a[e + 1] = t[1], a[e + 2] = t[2], a[e + 3] = t[3];
	        }return a;
	      };
	    }(), o.str = function (t) {
	      return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
	    }, t.exports = o;
	  }, function (t, a, n) {
	    var r = n(1),
	        o = {};o.create = function () {
	      var t = new r.ARRAY_TYPE(2);return t[0] = 0, t[1] = 0, t;
	    }, o.clone = function (t) {
	      var a = new r.ARRAY_TYPE(2);return a[0] = t[0], a[1] = t[1], a;
	    }, o.fromValues = function (t, a) {
	      var n = new r.ARRAY_TYPE(2);return n[0] = t, n[1] = a, n;
	    }, o.copy = function (t, a) {
	      return t[0] = a[0], t[1] = a[1], t;
	    }, o.set = function (t, a, n) {
	      return t[0] = a, t[1] = n, t;
	    }, o.add = function (t, a, n) {
	      return t[0] = a[0] + n[0], t[1] = a[1] + n[1], t;
	    }, o.subtract = function (t, a, n) {
	      return t[0] = a[0] - n[0], t[1] = a[1] - n[1], t;
	    }, o.sub = o.subtract, o.multiply = function (t, a, n) {
	      return t[0] = a[0] * n[0], t[1] = a[1] * n[1], t;
	    }, o.mul = o.multiply, o.divide = function (t, a, n) {
	      return t[0] = a[0] / n[0], t[1] = a[1] / n[1], t;
	    }, o.div = o.divide, o.min = function (t, a, n) {
	      return t[0] = Math.min(a[0], n[0]), t[1] = Math.min(a[1], n[1]), t;
	    }, o.max = function (t, a, n) {
	      return t[0] = Math.max(a[0], n[0]), t[1] = Math.max(a[1], n[1]), t;
	    }, o.scale = function (t, a, n) {
	      return t[0] = a[0] * n, t[1] = a[1] * n, t;
	    }, o.scaleAndAdd = function (t, a, n, r) {
	      return t[0] = a[0] + n[0] * r, t[1] = a[1] + n[1] * r, t;
	    }, o.distance = function (t, a) {
	      var n = a[0] - t[0],
	          r = a[1] - t[1];return Math.sqrt(n * n + r * r);
	    }, o.dist = o.distance, o.squaredDistance = function (t, a) {
	      var n = a[0] - t[0],
	          r = a[1] - t[1];return n * n + r * r;
	    }, o.sqrDist = o.squaredDistance, o.length = function (t) {
	      var a = t[0],
	          n = t[1];return Math.sqrt(a * a + n * n);
	    }, o.len = o.length, o.squaredLength = function (t) {
	      var a = t[0],
	          n = t[1];return a * a + n * n;
	    }, o.sqrLen = o.squaredLength, o.negate = function (t, a) {
	      return t[0] = -a[0], t[1] = -a[1], t;
	    }, o.inverse = function (t, a) {
	      return t[0] = 1 / a[0], t[1] = 1 / a[1], t;
	    }, o.normalize = function (t, a) {
	      var n = a[0],
	          r = a[1],
	          o = n * n + r * r;return o > 0 && (o = 1 / Math.sqrt(o), t[0] = a[0] * o, t[1] = a[1] * o), t;
	    }, o.dot = function (t, a) {
	      return t[0] * a[0] + t[1] * a[1];
	    }, o.cross = function (t, a, n) {
	      var r = a[0] * n[1] - a[1] * n[0];return t[0] = t[1] = 0, t[2] = r, t;
	    }, o.lerp = function (t, a, n, r) {
	      var o = a[0],
	          l = a[1];return t[0] = o + r * (n[0] - o), t[1] = l + r * (n[1] - l), t;
	    }, o.random = function (t, a) {
	      a = a || 1;var n = 2 * r.RANDOM() * Math.PI;return t[0] = Math.cos(n) * a, t[1] = Math.sin(n) * a, t;
	    }, o.transformMat2 = function (t, a, n) {
	      var r = a[0],
	          o = a[1];return t[0] = n[0] * r + n[2] * o, t[1] = n[1] * r + n[3] * o, t;
	    }, o.transformMat2d = function (t, a, n) {
	      var r = a[0],
	          o = a[1];return t[0] = n[0] * r + n[2] * o + n[4], t[1] = n[1] * r + n[3] * o + n[5], t;
	    }, o.transformMat3 = function (t, a, n) {
	      var r = a[0],
	          o = a[1];return t[0] = n[0] * r + n[3] * o + n[6], t[1] = n[1] * r + n[4] * o + n[7], t;
	    }, o.transformMat4 = function (t, a, n) {
	      var r = a[0],
	          o = a[1];return t[0] = n[0] * r + n[4] * o + n[12], t[1] = n[1] * r + n[5] * o + n[13], t;
	    }, o.forEach = function () {
	      var t = o.create();return function (a, n, r, o, l, u) {
	        var e, M;for (n || (n = 2), r || (r = 0), M = o ? Math.min(o * n + r, a.length) : a.length, e = r; M > e; e += n) {
	          t[0] = a[e], t[1] = a[e + 1], l(t, t, u), a[e] = t[0], a[e + 1] = t[1];
	        }return a;
	      };
	    }(), o.str = function (t) {
	      return "vec2(" + t[0] + ", " + t[1] + ")";
	    }, t.exports = o;
	  }]);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utility = __webpack_require__(5);

	var _obj = __webpack_require__(6);

	var _obj2 = _interopRequireDefault(_obj);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Plane = function (_Obj3D) {
	    _inherits(Plane, _Obj3D);

	    function Plane(GL, obj) {
	        _classCallCheck(this, Plane);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Plane).call(this));

	        _this.GL = GL;
	        _this.gl = GL.gl;
	        _this.obj = obj = obj || {};
	        _this.width = obj.width || 10.0;
	        _this.height = obj.height || 10.0;

	        var color = (0, _utility.colorTransform)(obj.color);
	        _this.verticesColors = new Float32Array([-_this.width / 2, +_this.height / 2, 0.0, color[0], color[1], color[2], +_this.width / 2, +_this.height / 2, 0.0, color[0], color[1], color[2], +_this.width / 2, -_this.height / 2, 0.0, color[0], color[1], color[2], -_this.width / 2, -_this.height / 2, 0.0, color[0], color[1], color[2]]);
	        _this.indices = new Uint8Array([0, 1, 2, 0, 2, 3]);
	        return _this;
	    }

	    return Plane;
	}(_obj2.default);

	exports.default = Plane;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	//get the context
	function getWebGLContext(canvas, err) {
	    // bind err
	    if (canvas.addEventListener) {
	        canvas.addEventListener("webglcontextcreationerror", function (event) {
	            err(event.statusMessage);
	        }, false);
	    }
	    //create context
	    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
	    var context = null;
	    for (var ii = 0; ii < names.length; ++ii) {
	        try {
	            context = canvas.getContext(names[ii], err);
	        } catch (e) {}
	        if (context) {
	            break;
	        }
	    }
	    return context;
	};

	//init shader
	function initShaders(gl, vshader, fshader) {
	    var program = createProgram(gl, vshader, fshader);
	    if (!program) {
	        console.log('Failed to create program');
	        return false;
	    }
	    gl.useProgram(program);
	    gl.program = program;

	    // init shader variable
	    gl.uPMatrix = gl.getUniformLocation(program, "uPMatrix");
	    gl.uMVMatrix = gl.getUniformLocation(program, "uMVMatrix");

	    gl.aPosition = gl.getAttribLocation(gl.program, 'aPosition');
	    gl.aColor = gl.getAttribLocation(gl.program, 'aColor');
	    return true;
	}

	//create program
	function createProgram(gl, vshader, fshader) {
	    // Create shader object
	    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
	    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
	    if (!vertexShader || !fragmentShader) {
	        return null;
	    }
	    // Create a program object
	    var program = gl.createProgram();
	    if (!program) {
	        return null;
	    }
	    // Attach the shader objects
	    gl.attachShader(program, vertexShader);
	    gl.attachShader(program, fragmentShader);
	    // Link the program object
	    gl.linkProgram(program);
	    // Check the result of linking
	    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	    if (!linked) {
	        var error = gl.getProgramInfoLog(program);
	        console.log('Failed to link program: ' + error);
	        gl.deleteProgram(program);
	        gl.deleteShader(fragmentShader);
	        gl.deleteShader(vertexShader);
	        return null;
	    }
	    return program;
	}

	//loadShader
	function loadShader(gl, type, source) {
	    // Create shader object
	    var shader = gl.createShader(type);
	    if (shader == null) {
	        console.log('unable to create shader');
	        return null;
	    }
	    // Set the shader program
	    gl.shaderSource(shader, source);
	    // Compile the shader
	    gl.compileShader(shader);
	    // Check the result of compilation
	    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	    if (!compiled) {
	        var error = gl.getShaderInfoLog(shader);
	        console.log('Failed to compile shader: ' + error);
	        gl.deleteShader(shader);
	        return null;
	    }
	    return shader;
	}

	function colorTransform(colorStr) {
	    var color = [0, 0, 0];
	    if (typeof colorStr == 'string') {
	        if (colorStr.indexOf('#') !== -1) {
	            var _color = colorStr.substring(1);
	            if (_color.length == 3) {
	                color = [];
	                for (var i = 0; i < _color.length; i++) {
	                    var key = _color.charAt(i);
	                    color.push(parseInt(key + key, 16) / 255);
	                }
	            } else if (_color.length == 6) {
	                color = [];
	                for (var i = 0; i < _color.length; i += 2) {
	                    var key = _color.charAt(i);
	                    var key2 = _color.charAt(i + 1);
	                    color.push(parseInt(key + key2, 16) / 255);
	                }
	            }
	        }
	    }
	    return color;
	}

	exports.getWebGLContext = getWebGLContext;
	exports.initShaders = initShaders;
	exports.createProgram = createProgram;
	exports.loadShader = loadShader;
	exports.colorTransform = colorTransform;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _mat = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Obj3D = function () {
	    function Obj3D() {
	        _classCallCheck(this, Obj3D);

	        this.opearteID = 0;
	        this.operate = [];
	        this.opearteBuild = {};
	    }

	    _createClass(Obj3D, [{
	        key: 'translate',
	        value: function translate(x, y, z) {
	            var id = this.opearteID = this.opearteID;
	            this.operate.push({
	                id: id++,
	                name: 'translate',
	                value: [x || 0, y || 0, z || 0]
	            });
	            return this;
	        }
	    }, {
	        key: 'rotate',
	        value: function rotate(rad, axis) {
	            var _axis = null;
	            if (axis instanceof Array && axis.length == 3) {
	                _axis = axis;
	            } else {
	                switch (axis) {
	                    case 'x':
	                        _axis = [1, 0, 0];
	                        break;
	                    case 'y':
	                        _axis = [0, 1, 0];
	                        break;
	                    case 'z':
	                        _axis = [0, 0, 1];
	                        break;
	                }
	            }

	            if (_axis) {
	                var id = this.opearteID = this.opearteID;
	                this.operate.push({
	                    id: id++,
	                    name: 'rotate',
	                    value: [rad, _axis]
	                });
	            }
	            return this;
	        }
	    }, {
	        key: 'scale',
	        value: function scale(x, y, z) {
	            var id = this.opearteID = this.opearteID;
	            this.operate.push({
	                id: id++,
	                name: 'scale',
	                value: [x || 1, y || 1, z || 1]
	            });
	            return this;
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var gl = this.gl;
	            var mvMatrix = this.GL.camera.mvMatrix;

	            // 顶点/颜色缓冲区操作
	            var vertexColorBuffer = gl.createBuffer();
	            var FSIZE = this.verticesColors.BYTES_PER_ELEMENT;
	            gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
	            gl.bufferData(gl.ARRAY_BUFFER, this.verticesColors, gl.STATIC_DRAW);
	            gl.vertexAttribPointer(gl.aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
	            gl.enableVertexAttribArray(gl.aPosition);
	            gl.vertexAttribPointer(gl.aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
	            gl.enableVertexAttribArray(gl.aColor);

	            // 顶点索引缓冲区
	            var indexBuffer = gl.createBuffer();
	            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

	            // set mv
	            if (this.opearteBuild.ID === this.opearteID && this.opearteBuild.start === mvMatrix.toString()) {
	                // for cache , in no new opearte just return the old mvMatrix
	                mvMatrix = this.opearteBuild.result;
	            } else {
	                var start = mvMatrix.toString();
	                for (var i in this.operate) {
	                    var type = this.operate[i].name;
	                    var value = this.operate[i].value;
	                    switch (type) {
	                        case 'translate':
	                            var mvNMatrix = _mat.mat4.create();
	                            _mat.mat4.translate(mvNMatrix, mvMatrix, value);
	                            mvMatrix = mvNMatrix;
	                            break;
	                        case 'rotate':
	                            var mvNMatrix = _mat.mat4.create();
	                            _mat.mat4.rotate(mvNMatrix, mvMatrix, value[0], value[1]);
	                            mvMatrix = mvNMatrix;
	                            break;
	                        case 'scale':
	                            var mvNMatrix = _mat.mat4.create();
	                            _mat.mat4.scale(mvNMatrix, mvMatrix, value);
	                            mvMatrix = mvNMatrix;
	                            break;
	                    }
	                }
	                this.opearteBuild = {
	                    ID: this.opearteID,
	                    result: mvMatrix,
	                    start: start
	                };
	            }

	            gl.uniformMatrix4fv(this.gl.uMVMatrix, false, mvMatrix);
	            gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
	        }
	    }]);

	    return Obj3D;
	}();

	exports.default = Obj3D;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utility = __webpack_require__(5);

	var _obj = __webpack_require__(6);

	var _obj2 = _interopRequireDefault(_obj);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Wall = function (_Obj3D) {
	    _inherits(Wall, _Obj3D);

	    function Wall(GL, obj) {
	        _classCallCheck(this, Wall);

	        console.log(obj.path);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Wall).call(this));

	        _this.GL = GL;
	        _this.gl = GL.gl;
	        _this.obj = obj = obj || {};
	        _this.width = obj.thickness || 0.20;
	        _this.height = obj.height || 3.0;

	        var color = (0, _utility.colorTransform)(obj.color);

	        _this.verticesColors = new Float32Array([-_this.width / 2, +_this.height / 2, 0.10, color[0], color[1], color[2], +_this.width / 2, +_this.height / 2, 0.10, color[0], color[1], color[2], +_this.width / 2, -_this.height / 2, 0.10, color[0], color[1], color[2], -_this.width / 2, -_this.height / 2, 0.10, color[0], color[1], color[2]]);

	        _this.indices = new Uint8Array([0, 1, 2, 0, 2, 3]);
	        return _this;
	    }

	    return Wall;
	}(_obj2.default);

	exports.default = Wall;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var VSHADER_SOURCE = 'attribute vec4 aPosition;\n' + 'attribute vec4 aColor;\n' + 'uniform mat4 uMVMatrix;\n' + 'uniform mat4 uPMatrix;\n' + 'varying vec4 vColor;\n' + 'void main() {\n' + '  gl_Position = uPMatrix * uMVMatrix * aPosition;\n' + '  vColor = aColor;\n' + '}\n';

	var FSHADER_SOURCE = '#ifdef GL_ES\n' + 'precision mediump float;\n' + '#endif\n' + 'varying vec4 vColor;\n' + 'void main() {\n' + '  gl_FragColor = vColor;\n' + '}\n';

	exports.VSHADER_SOURCE = VSHADER_SOURCE;
	exports.FSHADER_SOURCE = FSHADER_SOURCE;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * this file is try to solve the path and outline
	 * if you give a certain path with width , it will return the path of the outline
	 * @author Mofei Zhu <hello@zhuwenlong.com>
	 **/

	function pathExtend(paths, width) {
	    var width = width || 40;
	    var harfWidth = width / 2;
	    var quarterWidth = harfWidth / 2;

	    /**
	     * judeg the new segment is cross the old line
	     **/
	    var newPoint = [];
	    for (var i = 0; i < paths.length; i++) {
	        if (i >= 3) {
	            // judeg cross
	            var headSegment = [paths[i - 1], paths[i]];
	            for (var j = 1; j <= i - 2; j++) {
	                var oldSegment = [paths[j - 1], paths[j]];
	                var iC = isCross(headSegment, oldSegment, true);
	                if (iC) {
	                    var point = [iC.x, iC.y];
	                    newPoint[i] = newPoint[i] || [];
	                    newPoint[i].push(point);
	                    newPoint[j] = newPoint[j] || [];
	                    newPoint[j].push(point);
	                }
	            }
	        }
	    }

	    /**
	     * insert the point to the path
	     */
	    for (var i = newPoint.length - 1; i >= 0; i--) {
	        if (newPoint[i] && newPoint[i].length >= 2) {
	            var newOrder = sortPoint(paths[i - 1], newPoint[i]);
	            newPoint[i] = newOrder;
	        }

	        if (newPoint[i]) {
	            for (var j in newPoint[i]) {
	                paths.splice(i, 0, newPoint[i][j]);
	            }
	        }
	    }

	    // get all the cross point
	    var crossPoint = {};
	    for (var i = 0; i < paths.length; i++) {
	        var x = paths[i][0];
	        var y = paths[i][1];
	        var key = x + '|' + y;

	        crossPoint[key] = crossPoint[key] || [];
	        if (paths[i - 1]) {
	            crossPoint[key].push([paths[i - 1][0], paths[i - 1][1]]);
	        };
	        if (paths[i + 1]) {
	            paths[i + 1] && crossPoint[key].push([paths[i + 1][0], paths[i + 1][1]]);
	        }
	    }

	    var cross = {};
	    // if the road is X way (two ways cross and the cross point is not on the end of each way)
	    for (var i in crossPoint) {
	        if (crossPoint[i].length !== 4) {
	            continue;
	        }

	        cross[i] = cross[i] || [];

	        var startPoint = crossPoint[i][0];
	        var thisPoint = [Number(i.split('|')[0]), Number(i.split('|')[1])];
	        var nextPoint = crossPoint[i][2];
	        var vectorys = getVectorByThreePoint(startPoint, thisPoint, nextPoint, width);
	        cross[i].push([thisPoint[0] + vectorys.toBisector[0], thisPoint[1] + vectorys.toBisector[1]]);
	        cross[i].push([thisPoint[0] - vectorys.toBisector[0], thisPoint[1] - vectorys.toBisector[1]]);

	        var startPoint = crossPoint[i][0];
	        var thisPoint = [Number(i.split('|')[0]), Number(i.split('|')[1])];
	        var nextPoint = crossPoint[i][3];
	        var vectorys = getVectorByThreePoint(startPoint, thisPoint, nextPoint, width);
	        cross[i].push([thisPoint[0] + vectorys.toBisector[0], thisPoint[1] + vectorys.toBisector[1]]);
	        cross[i].push([thisPoint[0] - vectorys.toBisector[0], thisPoint[1] - vectorys.toBisector[1]]);
	    }

	    // deal with every cross (X,T,L);
	    var isLoop = paths[0][0] == paths[paths.length - 1][0] && paths[0][1] == paths[paths.length - 1][1];
	    for (var i = 0; i < paths.length; i++) {
	        if (isLoop && paths.length - 1 == i) {
	            continue;
	        }
	        // break
	        var startPoint = paths[i - 1] ? paths[i - 1] : isLoop ? paths[paths.length - 2] : paths[i];
	        var thisPoint = paths[i];
	        var nextPoint = paths[i + 1] ? paths[i + 1] : isLoop ? paths[1] : paths[i];

	        var key = paths[i][0] + '|' + paths[i][1];
	        if (crossPoint[key].length == 4) {
	            continue;
	        }
	        cross[key] = cross[key] || [];

	        var vectorys = getVectorByThreePoint(startPoint, thisPoint, nextPoint, width);

	        cross[key].push([thisPoint[0] + vectorys.toBisector[0], thisPoint[1] + vectorys.toBisector[1]]);
	        cross[key].push([thisPoint[0] - vectorys.toBisector[0], thisPoint[1] - vectorys.toBisector[1]]);
	    }

	    // get the outline path
	    var outlines = [];
	    for (var i = 0; i < paths.length - 1; i++) {
	        /*
	            v3 -------  v2
	            v4 |         | v1
	                 |         |
	            v5 -------  v6
	         */
	        var v1, v2, v3, v4, v5, v6;

	        var key = paths[i][0] + '|' + paths[i][1];
	        var keyNext = paths[i + 1][0] + '|' + paths[i + 1][1];
	        v1 = paths[i];
	        v4 = paths[i + 1];
	        if (cross[key].length == 4) {
	            var v1PointssortByV4 = sortPoint(v4, [cross[key][0], cross[key][1], cross[key][2], cross[key][3]]);
	            v2 = v1PointssortByV4[2];
	            v6 = v1PointssortByV4[3];
	        } else {
	            v2 = cross[key][0];
	            v6 = cross[key][1];
	        }

	        if (cross[keyNext].length == 4) {
	            var v4PointssortByV1 = sortPoint(v1, [cross[keyNext][0], cross[keyNext][1], cross[keyNext][2], cross[keyNext][3]]);
	            v3 = v4PointssortByV1[2];
	            v5 = v4PointssortByV1[3];
	        } else {
	            v3 = cross[keyNext][0];
	            v5 = cross[keyNext][1];
	        }

	        if (isCross([v3, v2], [v5, v6])) {
	            var temp = v5;
	            v5 = v3;
	            v3 = temp;
	        }

	        var _outlines = [];
	        _outlines.push(v1, v2, v3, v4, v5, v6);
	        _outlines = _outlines.map(function (item) {
	            return item.map(function (si) {
	                return si.toFixed(2);
	            });
	        });
	        outlines.push(_outlines);
	    }
	    return outlines;
	}

	function getVectorByThreePoint(startPoint, thisPoint, nextPoint, width) {

	    var vCToSX = startPoint ? startPoint[0] - thisPoint[0] : 0;
	    var vCToSY = startPoint ? startPoint[1] - thisPoint[1] : 0;
	    var vCToS = [vCToSX, vCToSY];

	    var vCToNX = nextPoint ? nextPoint[0] - thisPoint[0] : 0;
	    var vCToNY = nextPoint ? nextPoint[1] - thisPoint[1] : 0;
	    var vCToN = [vCToNX, vCToNY];

	    var vCtoSCrossvCToN = vCToS[0] * vCToN[0] + vCToS[1] * vCToN[1];
	    var mCToSmvCToN = Math.sqrt((vCToS[0] * vCToS[0] + vCToS[1] * vCToS[1]) * (vCToN[0] * vCToN[0] + vCToN[1] * vCToN[1]));
	    var red = mCToSmvCToN == 0 ? 0 : Math.PI - Math.acos(vCtoSCrossvCToN / mCToSmvCToN);

	    if (red === 0) {
	        var k = vCToS[1] / vCToS[0] || vCToN[1] / vCToN[0];
	        var _red = Math.atan(k) + Math.PI / 2;
	        if (_red || Math.abs(k) == Infinity) {
	            var x = width / 2 * Math.cos(_red);
	            var y = width / 2 * Math.sin(_red);
	        } else {
	            var x = 0;
	            var y = width / 2;
	        }

	        return {
	            toStart: [0, 0],
	            toNext: [0, 0],
	            toBisector: [x, y]
	        };
	    }

	    var useWidth = width / Math.sin(red);

	    var dCrossToStart = getDistenceByTwoPoint(thisPoint, startPoint);
	    var sCrossToStart = useWidth / 2 / dCrossToStart;
	    var vCrossToStartX = (startPoint[0] - thisPoint[0]) * sCrossToStart + thisPoint[0];
	    var vCrossToStartY = (startPoint[1] - thisPoint[1]) * sCrossToStart + thisPoint[1];
	    var vCrossToStartEnd = [vCrossToStartX, vCrossToStartY];
	    var vCrossToStart = [vCrossToStartEnd[0] - thisPoint[0], vCrossToStartEnd[1] - thisPoint[1]];

	    var dCrossToNext = getDistenceByTwoPoint(thisPoint, nextPoint);
	    var sCrossToNext = useWidth / 2 / dCrossToNext;
	    var vdCrossToNextX = (nextPoint[0] - thisPoint[0]) * sCrossToNext + thisPoint[0];
	    var vCrossToNextY = (nextPoint[1] - thisPoint[1]) * sCrossToNext + thisPoint[1];
	    var vCrossToNextEnd = [vdCrossToNextX, vCrossToNextY];
	    var vCrossToNext = [vCrossToNextEnd[0] - thisPoint[0], vCrossToNextEnd[1] - thisPoint[1]];

	    var vCrossToStartAddNext = [vCrossToStart[0] + vCrossToNext[0], vCrossToStart[1] + vCrossToNext[1]];
	    return {
	        toStart: vCrossToStart,
	        toNext: vCrossToNext,
	        toBisector: vCrossToStartAddNext
	    };
	}

	/**
	 * get the vertical and the vertiacl ends by give k and point
	 * @param  {Number} k      the line's k
	 * @param  {Array} center the line's end which you want draw the vertical
	 * @param  {Number} width  How width the new line is
	 * @return {Array}
	 */
	function getVerticalEnds(k, center, width) {
	    var x = center[0];
	    var y = center[1];
	    var rad = Math.atan(k);
	    var dX = width * Math.sin(rad);
	    var dY = width * Math.cos(rad);

	    var _dX = dX / 2;
	    var _dY = dY / 2;
	    var _x1 = x - _dX;
	    var _y1 = y - _dY;
	    var _x2 = x + _dX;
	    var _y2 = y + _dY;
	    return [[_x1, _y1], [_x2, _y2]];
	}

	/**
	 * sort a list of array
	 * @param  {Array} startEnd [description]
	 * @param  {Array} points   [description]
	 * @return {Array}          [description]
	 */
	function sortPoint(startEnd, points) {
	    points.sort(function (a, b) {
	        var startX = startEnd[0];
	        var startY = startEnd[1];
	        var dA = Math.sqrt(Math.pow(a[0] - startX, 2) + Math.pow(a[1] - startY, 2), 2);
	        var dB = Math.sqrt(Math.pow(b[0] - startX, 2) + Math.pow(b[1] - startY, 2), 2);
	        return dB - dA;
	    });
	    return points;
	}

	/**
	 * @method isCross
	 * @param line1/line2 {Array} the first/second line's two end, e.g [[1,1],[2,2]]
	 * @trueCross [bool] make sure the cross is not on the end
	 * @return bool
	 **/
	function isCross(line1, line2, trueCross) {
	    var line1Equation = getEquationByTwoPoint(line1[0], line1[1]);
	    var line2Equation = getEquationByTwoPoint(line2[0], line2[1]);

	    var verticalCount = 0;
	    if (Math.abs(line1Equation.k) == Infinity) verticalCount++;
	    if (Math.abs(line2Equation.k) == Infinity) verticalCount++;

	    if (verticalCount == 0) {
	        var x = (line2Equation.b - line1Equation.b) / (line1Equation.k - line2Equation.k);
	        var y = line1Equation.k * x + line1Equation.b;

	        var pointInSegment1 = isPointInSegment([x, y], line1);
	        var pointInSegment2 = isPointInSegment([x, y], line2);

	        if (pointInSegment1 && pointInSegment2) {
	            var onTheEnd = false;
	            if (pointInSegment1.x == line1[0][0] && pointInSegment1.y == line1[0][1]) {
	                onTheEnd = true;
	            }
	            if (pointInSegment1.x == line1[1][0] && pointInSegment1.y == line1[1][1]) {
	                onTheEnd = true;
	            }
	            if (pointInSegment1.x == line2[0][0] && pointInSegment1.y == line2[0][1]) {
	                onTheEnd = true;
	            }
	            if (pointInSegment1.x == line2[1][0] && pointInSegment1.y == line2[1][1]) {
	                onTheEnd = true;
	            }
	            if (trueCross) {
	                if (onTheEnd) {
	                    return false;
	                }
	            }
	            return pointInSegment1;
	        } else {
	            return false;
	        }
	    } else if (verticalCount == 1) {
	        var maxY, minY, x, y;
	        if (Math.abs(line1Equation.k) == Infinity) {
	            x = line1Equation.x;
	            y = line2Equation.k * x + line2Equation.b;
	            maxY = Math.max(line1[0][1], line1[1][1]);
	            minY = Math.min(line1[0][1], line1[1][1]);
	        } else {
	            x = line2Equation.x;
	            y = line1Equation.k * x + line1Equation.b;
	            maxY = Math.max(line2[0][1], line2[1][1]);
	            minY = Math.min(line2[0][1], line2[1][1]);
	        }
	        if (y >= minY && y <= maxY) {
	            var onTheEnd = false;
	            if (x == line1[0][0] && y == line1[0][1]) {
	                onTheEnd = true;
	            }
	            if (x == line1[1][0] && y == line1[1][1]) {
	                onTheEnd = true;
	            }
	            if (x == line2[0][0] && y == line2[0][1]) {
	                onTheEnd = true;
	            }
	            if (x == line2[1][0] && y == line2[1][1]) {
	                onTheEnd = true;
	            }
	            if (trueCross) {
	                if (onTheEnd) {
	                    return false;
	                }
	            }
	            return {
	                x: x, y: y
	            };
	        } else {
	            return false;
	        }
	    } else if (verticalCount == 2) {
	        return false;
	    }
	}

	function isPointInSegment(point, segment) {
	    var x = point[0];
	    var y = point[1];
	    var point1X = segment[0][0];
	    var point1Y = segment[0][1];
	    var point2X = segment[1][0];
	    var point2Y = segment[1][1];
	    var minX = Math.min(point1X, point2X);
	    var maxX = Math.max(point1X, point2X);
	    var minY = Math.min(point1Y, point2Y);
	    var maxY = Math.max(point1Y, point2Y);
	    var isXCross = x >= minX && x <= maxX;
	    var isYCross = y >= minY && y <= maxY;

	    if (isXCross && isYCross) {
	        return {
	            x: x, y: y
	        };
	    } else {
	        return false;
	    }
	}

	/**
	 * @method getEquationByTwoPoint
	 * @param point1/point2 {Array}
	 * @return {k, b}
	 **/
	function getEquationByTwoPoint(point1, point2) {
	    var point1X = point1[0];
	    var point1Y = point1[1];
	    var point2X = point2[0];
	    var point2Y = point2[1];

	    var lineDx = point2X - point1X;
	    var lineDy = point2Y - point1Y;
	    var k = lineDy / lineDx;

	    var b = point2Y - k * point2X;

	    var x = Math.abs(k) == Infinity ? point1X : null;
	    return {
	        k: k, b: b, x: x
	    };
	}

	function getDistenceByTwoPoint(point1, point2) {
	    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2), 2);
	}

	exports.default = pathExtend;

/***/ }
/******/ ]);