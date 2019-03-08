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

/* global module */

const userScriptBanner =
`// ==UserScript==
// @name         Questionable Content Single-Page Application with Extra Features
// @namespace    https://questionablextensions.net/
// @version      <%= pkg.version %>
// @author       Alexander Krivács Schrøder
// @description  Converts questionablecontent.net into a single-page application and adds extra features, such as character, location and storyline navigation.
// @homepage     https://questionablextensions.net/
// @icon         https://questionablextensions.net/images/icon.png
// @icon64       https://questionablextensions.net/images/icon64.png
// @updateURL    https://questionablextensions.net/releases/qc-ext.latest.meta.js
// @downloadURL  https://questionablextensions.net/releases/qc-ext.latest.user.js
// @supportURL   https://github.com/Questionable-Content-Extensions/client/issues
// @match        *://*.questionablecontent.net/
// @match        *://*.questionablecontent.net/index.php
// @match        *://*.questionablecontent.net/view.php*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.1/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js
// @require      https://questionablextensions.net/scripts/angular.custom.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.18/angular-ui-router.min.js
// @connect      questionablextensions.net
// @connect      questionablecontent.herokuapp.com
// @connect      localhost
// @grant        GM.openInTab
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @noframes
// ==/UserScript==`;

module.exports = userScriptBanner;
