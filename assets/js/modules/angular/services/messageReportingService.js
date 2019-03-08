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
import $ from 'jquery';

import type { AngularModule, $Log, $Timeout } from 'angular';

function escapeHtml(text: string): string {
	return text.replace(/["&'/<>]/g, function (a) {
		return {
			'"': '&quot;',
			'&': '&amp;',
			'\'': '&#39;',
			'/': '&#47;',
			'<': '&lt;',
			'>': '&gt;'
		}[a];
	});
}

type MessageType = 'danger' | 'warning';
type Message = { type: MessageType, message: string };

export class MessageReportingService {
	$log: $Log;
	$timeout: $Timeout;

	messageQueue: Message[];
	isProcessing: boolean;

	constructor($log: $Log, $timeout: $Timeout) {
		this.$log = $log;
		this.$timeout = $timeout;

		this.messageQueue = [];
		this.isProcessing = false;
	}

	_processMessages() {
		this.isProcessing = true;

		let nextMessage = this.messageQueue.shift();
		if (typeof nextMessage === 'undefined') {
			this.isProcessing = false;
			return;
		}

		const unique = Math.random().toString(36).slice(-5);

		const messageHtml = '<div class="alert alert-' +
			nextMessage.type + '" ' +
			'id="' + unique + '" ' +
			'style="display: none;" ' +
			'role="alert">' +
			escapeHtml(nextMessage.message) +
			'</div>';

		$('#messageSeat').append(messageHtml);
		const messageElement = $('#' + unique);
		messageElement.slideDown();

		const removeMessage = () => {
			messageElement.slideUp(
				() => {
					messageElement.remove();
					this._processMessages();
				});
		};

		const timeoutHandle = this.$timeout(removeMessage, 5000, false);
		messageElement.click(() => {
			this.$timeout.cancel(timeoutHandle);
			removeMessage();
		});
	}

	reportMessage(type: MessageType, message: string) {
		this.messageQueue.push({ type: type, message: message });
		if (!this.isProcessing) { this._processMessages(); }
	}

	reportError(message: string) {
		this.reportMessage('danger', message);
	}
	
	reportWarning(message: string) {
		this.reportMessage('warning', message);
	}
}

export default function (app: AngularModule) {
	app.service('messageReportingService', ['$log', '$timeout',
		function ($log: $Log, $timeout: $Timeout) {
			$log.debug('START messageReportingService()');
			const messageReportingService = new MessageReportingService($log, $timeout);
			$log.debug('END messageReportingService()');
			return messageReportingService;
		}]);
}
