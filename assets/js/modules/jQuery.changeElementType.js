// @flow
// Found at: https://gist.github.com/etienned/2934516
/*! License unknown */

import $ from 'jquery';

$.fn.changeElementType = function (newType) {
	const newElements = [];
	this.each(function () {
		const attrs = {};
		$.each(this.attributes, function (idx, attr) {
			attrs[attr.nodeName] = attr.nodeValue;
		});
		$(this).replaceWith(function () {
			const newElement = $('<' + newType + '/>', attrs);
			newElements.push(newElement.get()[0]);
			return newElement.append($(this).contents());
		});
	});
	return $(newElements);
};
