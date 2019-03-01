// @flow
/*
 * Copyright (C) 2016-2018 Alexander Krivács Schrøder <alexschrod@gmail.com>
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

import type { AngularModule, $Log } from 'angular';

// Parts based on code from:
// http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c

function hue2rgb(p, q, t) {
	if (t < 0) {
		t += 1;
	}

	if (t > 1) {
		t -= 1;
	}

	if (t < 1 / 6) {
		return p + (q - p) * 6 * t;
	}

	if (t < 1 / 2) {
		return q;
	}

	if (t < 2 / 3) {
		return p + (q - p) * (2 / 3 - t) * 6;
	}

	return p;
}

type HSLValue = [number, number, number];
type RGBValue = [number, number, number];
type HSVValue = [number, number, number];

export class ColorService {
	$log: $Log;

	constructor($log: $Log) {
		this.$log = $log;
	}

	/**
	 * Converts an RGB color value to HSL. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h, s, and l in the set [0, 1].
	 *
	 * @param   {number}  r       The red color value
	 * @param   {number}  g       The green color value
	 * @param   {number}  b       The blue color value
	 * @return  {HSLValue}        The HSL representation
	 */
	rgbToHsl(r: number, g: number, b: number): HSLValue {
		r /= 255;
		g /= 255;
		b /= 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0;
		let s;
		const l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // Achromatic
		} else {
			const d = max - min;

			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;

				case g:
					h = (b - r) / d + 2;
					break;

				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}

		return [h, s, l];
	}

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h, s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   {number}  h       The hue
	 * @param   {number}  s       The saturation
	 * @param   {number}  l       The lightness
	 * @return  {RGBValue}        The RGB representation
	 */
	hslToRgb(h: number, s: number, l: number): RGBValue {
		let r;
		let g;
		let b;

		if (s === 0) {
			r = g = b = l; // Achromatic
		} else {
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;

			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return [
			Math.round(r * 255),
			Math.round(g * 255),
			Math.round(b * 255)
		];
	}


	/**
	 * Converts an RGB color value to HSV. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h, s, and v in the set [0, 1].
	 *
	 * @param   {number}  r       The red color value
	 * @param   {number}  g       The green color value
	 * @param   {number}  b       The blue color value
	 * @return  {HSVValue}        The HSV representation
	 */
	rgbToHsv(r: number, g: number, b: number): HSVValue {
		r = r / 255;
		g = g / 255;
		b = b / 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0;
		let s;
		const v = max;

		const d = max - min;

		s = max === 0 ? 0 : d / max;

		if (max === min) {
			h = 0; // Achromatic
		} else {
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;

				case g:
					h = (b - r) / d + 2;
					break;

				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}

		return [h, s, v];
	}

	/**
	 * Converts an HSV color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
	 * Assumes h, s, and v are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   {number}  h       The hue
	 * @param   {number}  s       The saturation
	 * @param   {number}  v       The value
	 * @return  {RGBValue}        The RGB representation
	 */
	hsvToRgb(h: number, s: number, v: number) {
		let r = 0;
		let g = 0;
		let b = 0;

		const i = Math.floor(h * 6);
		const f = h * 6 - i;
		const p = v * (1 - s);
		const q = v * (1 - f * s);
		const t = v * (1 - (1 - f) * s);

		switch (i % 6) {
			case 0:
				r = v;
				g = t;
				b = p;
				break;

			case 1:
				r = q;
				g = v;
				b = p;
				break;

			case 2:
				r = p;
				g = v;
				b = t;
				break;

			case 3:
				r = p;
				g = q;
				b = v;
				break;

			case 4:
				r = t;
				g = p;
				b = v;
				break;

			case 5:
				r = v;
				g = p;
				b = q;
				break;
		}

		return [
			Math.round(r * 255),
			Math.round(g * 255),
			Math.round(b * 255)
		];
	}

	hexColorToRgb(hexColor: string): RGBValue {
		if (hexColor.charAt(0) === '#') {
			hexColor = hexColor.substring(1); // Strip #
		}
		const rgb = parseInt(hexColor, 16); // Convert rrggbb to decimal
		const r = rgb >> 16 & 0xff;         // Extract red
		const g = rgb >> 8 & 0xff;          // Extract green
		const b = rgb & 0xff;               // Extract blue
		return [r, g, b];
	}

	rgbToHexColor(r: number, g: number, b: number): string {
		return '#' + ((1 << 24) + (r << 16) + (g << 8) + b)
			.toString(16).slice(1);
	}

	getRgbRelativeLuminance(r: number, g: number, b: number): number {
		return 0.2126 * r + 0.7152 * g + 0.0722 * b; // Per ITU-R BT.709
	}

	createTintOrShade(hexColor: string, iterations?: number): string {
		if (typeof iterations === 'undefined') {
			iterations = 1;
		}

		let rgb = this.hexColorToRgb(hexColor);
		const hsl = this.rgbToHsl(rgb[0], rgb[1], rgb[2]);

		const tint = hsl[2] < 0.5;

		for (let i = iterations; i > 0; i--) {
			// If it's a dark color, make it lighter
			// and vice versa.
			if (tint) {
				// Increase the lightness by
				// 50% (tint)
				hsl[2] = (hsl[2] + 1) / 2;
			} else {
				// Decrease the lightness by
				// 50% (shade)
				hsl[2] /= 2;
			}
		}

		rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2]);
		return this.rgbToHexColor(rgb[0], rgb[1], rgb[2]);
	}
}

export default function (app: AngularModule) {
	app.service('colorService', ['$log',
		function ($log: $Log) {
			$log.debug('START colorService()');
			const colorService = new ColorService($log);
			$log.debug('END colorService()');
			return colorService;
		}]);
}
