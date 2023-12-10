/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/libs/map.js":
/*!*************************!*\
  !*** ./src/libs/map.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const lat = 20.265807663544592 ;\r\n    const lng = -97.96311110164913;\r\n    const map = L.map('map').setView([lat, lng], 22);\r\n    var greenIcon = L.icon({\r\n        iconUrl: \"assets/Grupo 1.jpg\",\r\n    \r\n        iconSize:     [55, 55], // size of the icon\r\n    // point of the icon which will correspond to marker's location\r\n        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor\r\n    });\r\n    let marker\r\n    const geocoderService = L.esri.Geocoding.geocodeService();\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(map);\r\n\r\n    marker = new L.marker([lat, lng], {\r\n        draggable: true, //Puedes mover\r\n        autoPan: true,\r\n        icon: greenIcon,\r\n    }).addTo(map);\r\n\r\n    \r\n    marker.on('moveend', function (e) { //Este es escuchador\r\n        marker = e.target\r\n        const position = marker.getLatLng()\r\n\r\n        map.panTo(new L.LatLng(position.lat, position.lng))\r\n\r\n        //: OBTENER LA INFROMACION DE LA DIRECCION FISICA\r\n        geocoderService.reverse().latlng(position, 13).run(function (error, result) {\r\n\r\n\r\n            marker.bindPopup(result.address.LongLabel)\r\n\r\n\r\n        })\r\n    })\r\n})();\n\n//# sourceURL=webpack://spc-integradora/./src/libs/map.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/libs/map.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;