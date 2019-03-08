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

declare module greasemonkey {
	declare type GMInfoScriptObject = {
		description: string;
		excludes: string[];
		includes: string[];
		matches: string[];
		name: string;
		namespace: string;
		resources: any;
		//run-at: string;
		version: string;
	}

	declare type GMInfoObject = {
		script: GMInfoScriptObject;
		scriptMetaStr: string;
		scriptHandler: string;
		version: string;
	}

	declare class GMXHRResult extends XMLHttpRequest {
		responseHeaders: string;
		context?: any;
	}

	declare class GMXHRProgressResult extends GMXHRResult {
		lengthComputable: boolean;
		loaded: number;
		total: number;
	}

	declare type GMXHRDetails = {
		binary?: boolean;
		context?: any;
		data?: string;
		headers?: {};
		method: "GET" | "POST" | "HEAD" | "PUT" | "PATCH" | "DELETE";
		overrideMimeType?: string;
		password?: string;
		synchronous?: boolean;
		timeout?: number;
		upload?: any;
		url: string;
		user?: string;

		onabort?: (result: GMXHRResult) => void;
		onerror?: (result: GMXHRResult) => void;
		onload?: (result: GMXHRResult) => void;
		onprogress?: (result: GMXHRProgressResult) => void;
		onreadystatechange?: (result: GMXHRProgressResult) => void;
		ontimeout?: (result: GMXHRResult) => void;
	}

	declare type GMObject = {
		info: GMInfoObject;

		deleteValue(name: string): Promise<any>;
		getValue<T: string | number | boolean> (name: string, defaultValue: ?T): Promise<T>;
	listValues(): Promise<string[]>;
	setValue < T: string | number | boolean > (name: string, value: T): Promise<any>;

	getResourceUrl(resourceName: string): Promise<string>;

	notification(text: string, title: string, image: ?string, onclick: ?() => void): void;
	setClipboard(text: string): void;
	openInTab(url: string, open_in_background: ?boolean): void;

	xmlHttpRequest(details: GMXHRDetails): void;
}

declare module.exports: GMObject;
}
