/// <reference path="polyfills.d.ts" />

// Make it so we can use various array functions on NodeLists
NodeList.prototype.forEach = Array.prototype.forEach;

Array.prototype.equals = function (array) {
	// if the other array is a falsy value, return
	if (!array) {
		return false;
	}


	var length = this.length;
	// compare lengths - can save a lot of time
	if (length !== array.length) {
		return false;
	}

	for (var i = 0; i < length; i++) {
		// Check if we have nested arrays
		if (this[i] instanceof Array && array[i] instanceof Array) {
			// recurse into the nested arrays
			if (!this[i].equals(array[i])) {
				return false;
			}
		}
		else if (this[i] !== array[i]) {
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;
		}
	}
	return true;
};

if (![].includes) {
	Array.prototype.includes = function(searchElement) {
		var O = Object(this);
		var len = parseInt(O.length) || 0;
		if (len === 0) {
			return false;
		}
		var n = parseInt(arguments[1]) || 0;
		var k;
		if (n >= 0) {
			k = n;
		} else {
			k = len + n;
			if (k < 0) {k = 0;}
		}
		var currentElement;
		while (k < len) {
			currentElement = O[k];
			if (searchElement === currentElement ||
				(searchElement !== searchElement && currentElement !== currentElement)) {
				return true;
			}
			k++;
		}
		return false;
	};
}