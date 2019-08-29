/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.scss */ \"./src/style.scss\");\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_0__);\n //var socket = io();\n\nvar pictureTrigger = document.querySelector(\".picture-trigger\");\nvar formResponse = document.querySelector(\".form-response\");\nvar form = document.getElementById(\"login-form\");\nvar toggleLeft = document.querySelector(\".garage-door-toggle--left\");\nvar toggleRight = document.querySelector(\".garage-door-toggle--right\");\nvar toggles = {\n  left: toggleLeft,\n  right: toggleRight\n};\nvar authenticated = false;\n\nfunction setHeaders(pw) {\n  var headers = new Headers({\n    Authorization: \"Basic \" + btoa(\"Admin\" + \":\" + pw)\n  });\n  return headers;\n} // Login form authentication\n\n\nif (form) {\n  authenticatePass();\n  form.addEventListener(\"submit\", function (e) {\n    e.preventDefault();\n    authenticatePass();\n  });\n}\n\nfunction authenticatePass() {\n  var inputPassValue = document.getElementById(\"pass\").value;\n  console.log(inputPassValue);\n\n  if (!inputPassValue) {\n    inputPassValue = localStorage.getItem(\"garage-pass\");\n  }\n\n  if (!inputPassValue) {\n    return;\n  }\n\n  var headers = setHeaders(inputPassValue);\n  fetch(\"/api/garage/authenticate\", {\n    method: \"GET\",\n    headers: headers\n  }).then(function (response) {\n    if (response.status === 200) {\n      return response.json();\n    } else {\n      return \"Feil passord...\";\n    }\n  }).then(function (response) {\n    if (response.status === \"valid\") {\n      authenticated = true;\n      formResponse.innerHTML = \"Flott, sender deg videre...\";\n      localStorage.setItem(\"garage-pass\", inputPassValue);\n      window.location.href = \"/authenticated\";\n    } else {\n      formResponse.innerHTML = response;\n    }\n  });\n}\n\nvar existingPass = localStorage.getItem(\"garasjepass\");\nvar password = \"\";\n\nif (existingPass) {\n  //passwordForm.style.display = \"none\";\n  password = existingPass;\n}\n\nif (!form) {\n  var getDoorState = function getDoorState(doorOpenSensor, doorClosedSensor) {\n    if (doorOpenSensor && !doorClosedSensor) {\n      return \"open\";\n    }\n\n    if (!doorOpenSensor && doorClosedSensor) {\n      return \"closed\";\n    }\n\n    if (!doorOpenSensor && !doorClosedSensor) {\n      return \"between\";\n    }\n\n    if (doorOpenSensor && doorClosedSensor) {\n      return \"fatal error\";\n    }\n  };\n\n  var getStatus = function getStatus() {\n    fetch(\"api/doors/status\", {\n      method: \"GET\",\n      headers: headers\n    }).then(function (response) {\n      return response.json();\n    }).then(function (json) {\n      console.log(json);\n      rightDoorStatus = getDoorState(json.leftDoorOpen, json.leftDoorClosed);\n      leftDoorStatus = getDoorState(json.rightDoorOpen, json.rightDoorClosed);\n      setDoorClass(\"left\", leftDoorStatus);\n      setDoorClass(\"right\", rightDoorStatus);\n      var result = \"leftDoor: \" + leftDoorStatus + \"<br>rightDoor: \" + rightDoorStatus;\n      updatePicture();\n    });\n  };\n\n  var takePicture = function takePicture() {\n    fetch(\"api/garage/picture\", {\n      method: \"GET\",\n      headers: headers\n    }).then(function (response) {\n      return response.json();\n    }).then(function (json) {\n      setTimeout(function () {\n        updatePicture();\n      }, 200);\n    });\n  };\n\n  var updatePicture = function updatePicture() {\n    var t = new Date().getTime();\n    var url = \"./images/garage.jpg?t=\" + t;\n    var image = document.getElementById(\"image\");\n    image.src = url;\n  };\n\n  var toggleDoor = function toggleDoor(side) {\n    fetch(\"api/door/\" + side + \"/toggle\", {\n      method: \"GET\",\n      headers: headers\n    }).then(function (response) {\n      console.log(response);\n      return response.json();\n    }).then(function (json) {\n      console.log(json);\n\n      if (json.success === \"true\") {\n        setTimeout(function () {\n          getStatus();\n          takePicture();\n        }, 25000);\n      }\n    });\n  };\n\n  var headers = setHeaders(localStorage.getItem(\"garage-pass\"));\n  var rightDoorStatus;\n  var leftDoorStatus; // 1. get state from api for both buttons\n  // 2. attach event listeners\n  // 3. Toggle click -> add opening / closing class\n  // 4. Listen to socket, and get remove opening/closing classes + add closed / open class\n\n  toggleLeft.addEventListener(\"click\", function (evt) {\n    if (leftDoorStatus === \"closed\" || leftDoorStatus === \"closing\") {\n      setDoorClass(\"left\", \"opening\");\n      leftDoorStatus = \"opening\";\n    } else {\n      setDoorClass(\"left\", \"closing\");\n      leftDoorStatus = \"closing\";\n    }\n\n    toggleDoor(\"left\");\n  });\n  toggleRight.addEventListener(\"click\", function (evt) {\n    if (rightDoorStatus === \"closed\" || rightDoorStatus === \"closing\") {\n      setDoorClass(\"right\", \"opening\");\n      rightDoorStatus = \"opening\";\n    } else {\n      setDoorClass(\"right\", \"closing\");\n      rightDoorStatus = \"closing\";\n    }\n\n    toggleDoor(\"right\");\n  });\n\n  if (pictureTrigger) {\n    pictureTrigger.addEventListener(\"click\", function (evt) {\n      takePicture();\n    });\n  }\n\n  getStatus();\n}\n/* socket.on(\"state-change\", function(status) {\n  document.querySelector(\".socket-info\").innerHTML = status;\n}); */\n\n\nfunction setDoorClass(side, state) {\n  if (state === \"closed\") {\n    toggles[side].classList.remove(\"opening\", \"closing\", \"open\");\n    toggles[side].classList.add(\"closed\");\n    toggles[side].querySelector(\".status\").innerHTML = getNbReadableState(state);\n  }\n\n  if (state === \"open\") {\n    toggles[side].classList.remove(\"opening\", \"closing\", \"closed\");\n    toggles[side].classList.add(\"open\");\n    toggles[side].querySelector(\".status\").innerHTML = getNbReadableState(state);\n  }\n\n  if (state === \"closing\") {\n    toggles[side].classList.remove(\"opening\", \"open\", \"closed\");\n    toggles[side].classList.add(\"closing\");\n    toggles[side].querySelector(\".status\").innerHTML = getNbReadableState(state);\n  }\n\n  if (state === \"opening\") {\n    toggles[side].classList.remove(\"closing\", \"open\", \"closed\");\n    toggles[side].classList.add(\"opening\");\n    toggles[side].querySelector(\".status\").innerHTML = getNbReadableState(state);\n  }\n}\n\nfunction getNbReadableState(state) {\n  switch (state) {\n    case \"closed\":\n      return \"Lukket\";\n\n    case \"open\":\n      return \"Åpen\";\n\n    case \"closing\":\n      return \"Lukker...\";\n\n    case \"opening\":\n      return \"Åpner...\";\n  }\n}\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/style.scss?");

/***/ })

/******/ });