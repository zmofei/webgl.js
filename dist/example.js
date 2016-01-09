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
/***/ function(module, exports) {

	'use strict';

	var gl = new GL('webgl');

	var plane = gl.Plane({
	    width: 100,
	    height: 100,
	    color: '#eee'
	});

	var plane2 = gl.Plane({
	    width: 5,
	    height: 5,
	    color: '#ddd'
	}).translate(0, 0, -2).scale(2, 2, 2);

	var plane3 = gl.Plane({
	    width: 2,
	    height: 2,
	    color: '#f00'
	}).translate(0, 0, -4).rotate(45 * Math.PI / 180, [1, 1, 0]);

	var wall = gl.Wall({
	    path: [[-4, 0], [4, 0]],
	    color: '#ccc'
	});

/***/ }
/******/ ]);