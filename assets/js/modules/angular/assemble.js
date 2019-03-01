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

import type { AngularModule } from 'angular';

import config from './config';
import run from './run';

import bodyController from './controllers/bodyController';
import comicController from './controllers/comicController';
import titleController from './controllers/titleController';

import colorService from './services/colorService';
import comicService from './services/comicService';
import eventFactory from './services/eventFactory';
import eventService from './services/eventService';
import messageReportingService from './services/messageReportingService';
import styleService from './services/styleService';

import donutDirective from './directives/donutDirective';
import onErrorDirective from './directives/onErrorDirective';
import qcAddItemDirective from './directives/qcAddItemDirective';
import qcChangeLogDirective from './directives/qcChangeLogDirective';
import qcComicDirective from './directives/qcComicDirective';
import qcComicNavDirective from './directives/qcComicNavDirective';
import qcDateDirective from './directives/qcDateDirective';
import qcEditComicDataDirective from './directives/qcEditComicDataDirective';
import qcExtraDirective from './directives/qcExtraDirective';
import qcExtraNavDirective from './directives/qcExtraNavDirective';
import qcItemDetailsDirective from './directives/qcItemDetailsDirective';
import qcNavDirective from './directives/qcNavDirective';
import qcNewsDirective from './directives/qcNewsDirective';
import qcRibbonDirective from './directives/qcRibbonDirective';
import qcSetPublishDateDirective from './directives/qcSetPublishDateDirective';
import qcSetTaglineDirective from './directives/qcSetTaglineDirective';
import qcSettingsDirective from './directives/qcSettingsDirective';
import qcSetTitleDirective from './directives/qcSetTitleDirective';

export default function (app: AngularModule) {
	config(app);
	run(app);

	bodyController(app);
	comicController(app);
	titleController(app);

	colorService(app);
	comicService(app);
	eventFactory(app);
	eventService(app);
	messageReportingService(app);
	styleService(app);

	donutDirective(app);
	onErrorDirective(app);
	qcAddItemDirective(app);
	qcChangeLogDirective(app);
	qcComicDirective(app);
	qcComicNavDirective(app);
	qcDateDirective(app);
	qcEditComicDataDirective(app);
	qcExtraDirective(app);
	qcExtraNavDirective(app);
	qcItemDetailsDirective(app);
	qcNavDirective(app);
	qcNewsDirective(app);
	qcRibbonDirective(app);
	qcSetPublishDateDirective(app);
	qcSetTaglineDirective(app);
	qcSettingsDirective(app);
	qcSetTitleDirective(app);
}
