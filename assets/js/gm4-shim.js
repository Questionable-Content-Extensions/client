/*
Functions copied from https://gist.github.com/arantius/3123124
The MIT License (MIT)

Copyright (c) 2014 Anthony Lieuallen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
*/

/*jshint unused:false, esversion: 6, latedef: false*/

if (typeof GM !== 'undefined' && typeof GM_getValue === 'undefined') {
	if (typeof GM_info === 'undefined') { const GM_info = GM.info; }
	var GM_xmlhttpRequest = GM.xmlHttpRequest;
	var storagePrefix = GM.info.script.name.replace(/[^A-Z]*/g, '') + '-';

	// The following functions all use local storage, and thus could be accessed
	// by the host. They are also restricted to a single domain.

	var GM_deleteValue = function(aKey) {
		'use strict';

		localStorage.removeItem(storagePrefix + aKey);
	};

	var GM_getValue = function(aKey, aDefault) {
		'use strict';

		var aValue = localStorage.getItem(storagePrefix + aKey);
		if (null === aValue && 'undefined' !== typeof aDefault) { return aDefault; }
		return aValue;
	};

	var GM_listValues = function() {
		'use strict';

		var prefixLen = storagePrefix.length;
		var values = [];
		for (var i = 0; i < localStorage.length; i++) {
			var k = localStorage.key(i);
			if (k.substr(0, prefixLen) === storagePrefix) {
				values.push(k.substr(prefixLen));
			}
		}
		return values;
	};

	var GM_setValue = function(aKey, aVal) {
		'use strict';

		localStorage.setItem(storagePrefix + aKey, aVal);
	};
}
