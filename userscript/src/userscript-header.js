/*
 * Copyright (C) 2022 Alexander Krivács Schrøder <alexschrod@gmail.com>
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

// ==UserScript==
// @name            Questionable Content Extensions
// @namespace       https://questionablextensions.net/
// @version         1.0
// @author          Alexander Krivács Schrøder
// @description     Questionable Content Extensions Script
// @match           *://*.questionablecontent.net/
// @match           *://*.questionablecontent.net/index.php
// @match           *://*.questionablecontent.net/view.php*
// @connect         questionablextensions.net
// @connect         questionablecontent.herokuapp.com
// @connect         localhost
// @grant           GM.openInTab
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.xmlHttpRequest
// @noframes
// ==/UserScript==

function start() {