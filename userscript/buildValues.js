/*
 * Copyright (C) 2016-2022 Alexander Krivács Schrøder <alexschrod@gmail.com>
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

const currentYear = new Date().getFullYear()
const licenseBanner = `/* 
 * Copyright (C) 2016-${currentYear} Alexander Krivács Schrøder <alexschrod@gmail.com>
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
 */`

const userscriptHeader = `\
// ==UserScript==
// @name         <%=name%>
// @namespace    https://questionablextensions.net/
// @version      <%=version%>
// @author       Alexander Krivács Schrøder
// @description  <%=description%>
// @homepage     https://questionablextensions.net/
// @icon         https://questionablextensions.net/images/icon.png
// @updateURL    https://questionablextensions.net/releases/qc-ext.latest.meta.js
// @downloadURL  https://questionablextensions.net/releases/qc-ext.latest.user.js
// @supportURL   https://github.com/Questionable-Content-Extensions/client/issues
// @match        *://*.questionablecontent.net/
// @match        *://*.questionablecontent.net/index.php
// @match        *://*.questionablecontent.net/view.php*
// @require      <%=react-js%>
// @require      <%=react-dom-js%>
// @connect      questionablextensions.net
// @connect      questionablecontent.herokuapp.com
// @connect      localhost
// @grant        GM.openInTab
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @noframes
// ==/UserScript==`

const pjson = require('./package.json')

const userscriptHeaderVariables = {
    version: pjson.version,
    development: {
        name: 'Questionable Content Extensions Development Script',
        description:
            'Development mode for Questionable Content Extensions Script. ' +
            'Loads the script directly from the last output of `npm start` on page refresh.',
        'react-js': 'https://unpkg.com/react@17/umd/react.development.js',
        'react-dom-js':
            'https://unpkg.com/react-dom@17/umd/react-dom.development.js',
        version: pjson.version + '+development',
    },
    production: {
        name: 'Questionable Content Single-Page Application with Extra Features',
        description:
            'Converts questionablecontent.net into a single-page application and adds ' +
            'extra features, such as character, location and storyline navigation.',
        'react-js': 'https://unpkg.com/react@17/umd/react.production.min.js',
        'react-dom-js':
            'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    },
}

module.exports = { licenseBanner, userscriptHeader, userscriptHeaderVariables }
