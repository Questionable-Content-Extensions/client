/*
 * Copyright (C) 2016, 2017 Alexander Krivács Schrøder <alexschrod@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global constants, console */

var qcExt;

(function(qcExt) {
	'use strict';

	// Add our modal windows
	$('body').prepend('<qc-settings></qc-settings>');
	$('body').prepend('<qc-edit-comic-data></qc-edit-comic-data>');
	$('body').prepend('<qc-item-details></qc-item-details>');
	$('body').prepend('<qc-change-log></qc-change-log>');
	
	// Take control over the page's title
	$('title').replaceWith('<title ng-controller="titleController as t">' +
		'{{t.title}}</title>');

	/**
	 * Adds a CSS <link> element to the <head> of the document.
	 *
	 * @param {string} href - URL to the CSS document
	 */
	function addCss(href) {
		$('head').prepend(
			'<link rel="stylesheet" type="text/css" href="' + href + '">'
			);
	}

	/**
	 * Adds an inline CSS <style> element to the <head> of the document.
	 *
	 * @param {string} style - The inline CSS document
	 */
	function addStyle(style) {
		$('head').append($('<style type="text/css">' + style + '</style>'));
	}

	// Bootstrap
	addCss(constants.baseUrl + 'style/bootstrap.min.css');

	// Font Awesome
	addCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/' +
		'font-awesome.min.css');

	// Style adder function
	addStyle(qcExt.variables.css.style);

	// Take over the comic link
	// For some reason, Jeph didn't use id="strip" on the comic <img> on
	// the front page. Whyyy????
	// (In other words, we have to use this method instead of just '#strip'.)
	var comicImg = $('img[src*="/comics/"]');
	var comicAnchor = comicImg.parent('a');

	if (comicAnchor.length !== 1) {
		comicImg.wrap($('<a href="" />'));
		comicAnchor = comicImg.parent('a');
	}

	$('body').append($('<div ui-view></div>'));
	
	// To avoid triggering a flash of the comic "reloading", do in-place DOM
	// manipulation instead of replacing the whole thing with a template.
	// Fixes issue #13
	var comicDirective = $('<qc-comic></qc-comic>');
	comicAnchor.before(comicDirective);
	comicAnchor.detach().appendTo(comicDirective);
	comicAnchor.attr('ng-href', 'view.php?comic={{c.comicService.nextComic}}');
	comicImg.attr('ng-src', 'http://questionablecontent.net/comics/' +
		'{{c.comicService.comic}}.{{c.comicService.comicExtension}}');
	comicImg.attr('ng-click', 'c.next($event)');
	comicImg.attr('on-error', 'c.comicService.canFallback() ' +
		'&& c.comicService.tryFallback()');
	
	// #comicDirective.attr('id', 'comic-anchor');
	comicDirective.append($('<qc-ribbon></qc-ribbon>'));

	var comicImage = comicImg.get(0);
	var comicLinkUrl = comicImage.src;

	comicLinkUrl = comicLinkUrl.split('/');
	var comic = parseInt(comicLinkUrl[comicLinkUrl.length - 1].split('.')[0]);

	qcExt.app.constant('startComic', comic);

	// Figure out what the latest comic # is based on the URL in the
	// "Latest/Last" navigation button.
	var latestUrl = $('#comicnav a').get(3).href;
	var latestComic = parseInt(latestUrl.split('=')[1]);
	if (isNaN(latestComic)) {
		latestComic = comic;
	}
	
	if (qcExt.settings.showDebugLogs) {
		console.debug('Running QC Extensions v' + GM_info.script.version);
		console.debug('Latest URL:', latestUrl, 'Latest Comic:', latestComic);
	}

	qcExt.app.constant('latestComic', latestComic);

	$('body #comicnav')
		.replaceWith('<qc-nav random-comic="randomComic"></qc-nav>');
	
	if ($('#news, #newspost').prev().prop('tagName') === 'QC-NAV') {
		// There's no date section: Insert our own
		$('#news, #newspost').before('<qc-date></qc-date>');
	} else {
		// There's a date section: Replace with our own
		$('#news, #newspost').prev().replaceWith('<qc-date></qc-date>');
	}
	
	$('#news, #newspost').replaceWith('<qc-news></qc-news>');

	comicDirective.parent().siblings('.small-2').prepend('<qc-extra></qc-extra>');

	// Set a base (required by Angular's html5Mode)
	$('head').append('<base href="' + window.location.origin + '/">');

	// Set up ng-controller for <body>
	$('body').attr('ng-controller', 'bodyController as b');
	
	// Fixed positioned element covering the whole page used to show messages
	// See the messageReportingService for details.
	$('body').append('<div id="messageSeat"></div>');
})(qcExt || (qcExt = {}));
