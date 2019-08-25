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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.scss */ \"./src/style.scss\");\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_0__);\n\nvar leftDoorBtn = document.getElementById(\"door-left\");\nvar rightDoorBtn = document.getElementById(\"door-right\");\nvar passwordForm = document.getElementById(\"password-form\");\nvar pictureTrigger = document.querySelector('.picture-trigger');\nvar formResponse = document.querySelector('.form-response');\n\nfunction setHeaders(pw) {\n  var headers = new Headers({\n    Authorization: \"Basic \" + btoa(\"Admin\" + \":\" + pw)\n  });\n  console.log(headers);\n  return headers;\n} // Login form authentication\n\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  var form = document.getElementById('login-form');\n  console.log(form);\n\n  if (form) {\n    form.addEventListener(\"submit\", function (e) {\n      e.preventDefault();\n      var headers = setHeaders(document.getElementById('pass').value);\n      fetch(\"/api/garage/authenticate\", {\n        method: 'GET',\n        headers: headers\n      }).then(function (response) {\n        if (response.status === 200) {\n          return response.json();\n        } else {\n          return \"Feil passord...\";\n        }\n      }).then(function (response) {\n        if (response.status === \"valid\") {\n          formResponse.innerHTML = \"Flott, sender deg videre...\";\n          window.location.href = '/authenticated';\n        } else {\n          formResponse.innerHTML = response;\n        }\n      });\n    });\n  }\n});\nvar existingPass = localStorage.getItem(\"garasjepass\");\nvar password = \"\";\nvar rightDoorClosed = 0;\nvar rightDoorOpen = 0;\nvar leftDoorClosed = 0;\nvar leftDoorOpen = 0;\n\nif (existingPass) {\n  //passwordForm.style.display = \"none\";\n  password = existingPass;\n}\n\nif (leftDoorBtn) {\n  var intIsZero = function intIsZero(_int) {\n    if (_int === 0) {\n      return true;\n    }\n\n    if (_int === 1) {\n      return false;\n    }\n  };\n\n  var takePicture = function takePicture() {\n    fetch(\"api/garage/picture\", {\n      method: 'GET',\n      headers: headers\n    }).then(function (response) {\n      return response.json();\n    }).then(function (json) {\n      setTimeout(function () {\n        setPicture();\n      }, 200);\n    });\n  };\n\n  var setPicture = function setPicture() {\n    var t = new Date().getTime();\n    var url = \"url(/images/garage.jpg?t=\" + t + \")\";\n    var backgroundDiv = document.getElementById(\"background\");\n    backgroundDiv.style.backgroundImage = url;\n  };\n  /* fetch(\"api/door/right/status\", {\n    method: 'GET',\n    headers: headers\n  }) .then(function(response) {\n    console.log(parseInt(response.state, 10));\n    rightState = parseInt(response.state, 10);\n    setButtonState(rightDoorBtn, rightState);\n    return response.json();\n  });\n   */\n\n\n  var setButtonState = function setButtonState(button, state) {\n    console.log(button, state);\n\n    if (state === 1) {\n      button.setAttribute('checked', 'checked');\n    } else {\n      button.removeAttribute('checked');\n    }\n  };\n\n  var toggleDoor = function toggleDoor(side) {\n    var passwordValue = document.getElementById(\"pass\").value;\n\n    if (existingPass) {\n      password = existingPass;\n    } else {\n      password = passwordValue;\n    }\n\n    fetch(\"api/door/\" + side, {\n      method: 'GET',\n      headers: headers\n    }).then(function (response) {\n      console.log(response);\n      localStorage.setItem('garasjepass', password);\n      return response.json();\n    });\n  };\n\n  leftDoorBtn.addEventListener(\"click\", function (evt) {\n    toggleDoor(\"left\");\n  });\n  rightDoorBtn.addEventListener(\"click\", function (evt) {\n    toggleDoor(\"right\");\n  });\n  pictureTrigger.addEventListener(\"click\", function (evt) {\n    takePicture();\n  });\n  fetch(\"api/doors/status\", {\n    method: 'GET',\n    headers: headers\n  }).then(function (response) {\n    return response.json();\n  }).then(function (json) {\n    console.log(json);\n    rightDoorOpen = intIsZero(parseInt(json.rightDoorOpen, 10));\n    rightDoorClosed = intIsZero(parseInt(json.rightDoorClosed, 10));\n    leftDoorClosed = intIsZero(parseInt(json.leftDoorClosed, 10));\n    leftDoorOpen = intIsZero(parseInt(json.leftDoorOpen, 10));\n\n    if (rightDoorClosed && !rightDoorOpen) {\n      setButtonState(rightDoorBtn, 1);\n    }\n\n    if (rightDoorOpen && !rightDoorClosed) {\n      setButtonState(rightDoorBtn, 0);\n    }\n\n    var result = \"rightDoorOpen: \" + rightDoorOpen + \"<br>rightDoorClosed: \" + rightDoorClosed + \"<br>leftDoorClosed: \" + leftDoorClosed + \"<br>leftDoorOpen: \" + leftDoorOpen;\n    document.querySelector('.result').innerHTML = result;\n  });\n  setPicture();\n}\n\n//# sourceURL=webpack:///./src/main.js?");

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