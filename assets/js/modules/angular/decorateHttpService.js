// @flow
/*
 * Copyright (C) 2016-2019 Alexander Krivács Schrøder <alexschrod@gmail.com>
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

import GM from 'greasemonkey';
import angular from 'angular';
import $ from 'jquery';

// TODO: Since we're not using the original service at all, we might
// as well completely replace it rather than decorate it...
// http://www.bennadel.com/blog/
// 2927-overriding-core-and-custom-services-in-angularjs.htm
export default function ($provide: any) {

	// Let's take over $http and make it use Greasemonkey's cross-domain
	// XMLHTTPRequests instead of the browser's.
	$provide.decorator('$http', function () {

		// START Code bits borrowed from angular
		// (see angular's license for details)
		const APPLICATION_JSON = 'application/json';
		const JSON_START = /^\[|^\{(?!\{)/;
		const JSON_ENDS = {
			'[': /]$/,
			'{': /}$/
		};
		const JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/;

		const DEFAULT_HEADERS = {
			Accept: APPLICATION_JSON,
			'X-QCExt-Version': GM.info.script.version
		};

		function isJsonLike(str) {
			const jsonStart = str.match(JSON_START);

			return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
		}

		function isString(value) {
			return typeof value === 'string';
		}

		function fromJson(json) {
			return isString(json) ? JSON.parse(json) : json;
		}

		function defaultHttpResponseTransform(data, headers) {
			if (!isString(data)) {
				return data;
			}

			// Strip json vulnerability protection prefix
			// and trim whitespace
			const tempData = data.replace(JSON_PROTECTION_PREFIX, '')
				.trim();

			if (!tempData) {
				return data;
			}

			const contentType = headers('Content-Type');

			if (contentType &&
				contentType.indexOf(APPLICATION_JSON) === 0 ||
				isJsonLike(tempData)) {
				data = fromJson(tempData);
			}

			return data;
		}

		// END Code bits borrowed from angular

		function getHeaderFunction(headers) {
			const keyedHeaders = {};

			angular.forEach(headers, function (value) {
				const splitValue = value.trim().split(':', 2);

				if (splitValue.length < 2) {
					return;
				}

				keyedHeaders[splitValue[0].trim()] =
					splitValue[1].trim();
			});

			return function (key) {
				return keyedHeaders[key] || null;
			};
		}

		const injector = (angular: any).injector(['ng']);
		const $q = injector.get('$q');
		const ourHttp = {
			get: function (url, config) {
				config = config || {};

				let headers: any = DEFAULT_HEADERS;
				if (config.headers) {
					headers = $.extend({}, DEFAULT_HEADERS, config.headers);
				}
				return $q(function (resolve, reject) {
					GM.xmlHttpRequest({
						method: 'GET',
						url: url,
						headers: headers,
						onload: function (gmResponse) {
							const headers = getHeaderFunction(
								gmResponse.responseHeaders
									.split('\n'));
							let responseData = gmResponse.response;

							responseData = defaultHttpResponseTransform(
								responseData, headers);
							const response = {
								data: responseData,
								status: gmResponse.status,
								headers: headers,
								config: config,
								statusText: gmResponse.statusText
							};

							resolve(response);
						},
						onerror: function (gmResponse) {
							const headers = getHeaderFunction(gmResponse
								.responseHeaders.split('\n'));
							let responseData = gmResponse.response;

							responseData = defaultHttpResponseTransform(
								responseData, headers);
							const response = {
								data: responseData,
								status: gmResponse.status,
								headers: headers,
								config: config,
								statusText: gmResponse.statusText
							};

							reject(response);
						}
					});
				});
			},
			post: function (url, data, config) {
				config = config || {};
				const contentType = 'contentType' in config ? config.contentType : APPLICATION_JSON;
				const dataTransform = 'dataTransform' in config ? config.dataTransform : (d) => JSON.stringify(d);

				let headers: any = DEFAULT_HEADERS;
				if (config.headers) {
					headers = $.extend({}, DEFAULT_HEADERS, config.headers);
				}
				if (contentType) {
					headers['Content-Type'] = contentType;
				}

				return $q(function (resolve, reject) {
					GM.xmlHttpRequest({
						method: 'POST',
						url: url,
						data: dataTransform(data),
						headers,
						onload: function (gmResponse) {
							const headers = getHeaderFunction(
								gmResponse.responseHeaders
									.split('\n'));
							let responseData = gmResponse.response;

							responseData = defaultHttpResponseTransform(
								responseData, headers);
							const response = {
								data: responseData,
								status: gmResponse.status,
								headers: headers,
								config: config,
								statusText: gmResponse.statusText
							};

							resolve(response);
						},
						onerror: function (gmResponse) {
							const headers = getHeaderFunction(gmResponse
								.responseHeaders.split('\n'));
							let responseData = gmResponse.response;

							responseData = defaultHttpResponseTransform(
								responseData, headers);
							const response = {
								data: responseData,
								status: gmResponse.status,
								headers: headers,
								config: config,
								statusText: gmResponse.statusText
							};

							reject(response);
						}
					});
				});
			}
		};

		/* Methods/properties to implement for full compatibility:
		 *     pendingRequests
		 *     delete
		 *     head
		 *     jsonp
		 *     post
		 *     put
		 *     patch
		 *     defaults
		 */

		return ourHttp;
	});
}
