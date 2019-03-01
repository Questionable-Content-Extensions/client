/* global require, process */

const fs = require('fs');

const readStream = fs.createReadStream('dist/qc-ext.user.js', {
	flags: 'r',
	encoding: 'utf-8',
	fd: null,
	mode: 0o666,
	bufferSize: 64 * 1024
});

const USER_SCRIPT_END_MARKER = '==/UserScript==';

let userScriptBanner = '';
readStream.on('data', function(data) {
	userScriptBanner += data;

	const scriptEndIndex = userScriptBanner.indexOf(USER_SCRIPT_END_MARKER);

	if (scriptEndIndex > -1) {
		readStream.destroy();
		userScriptBanner = userScriptBanner.substr(0, scriptEndIndex + USER_SCRIPT_END_MARKER.length + 1);
		fs.writeFile('dist/qc-ext.meta.js', userScriptBanner, (err) => {
			if (err) {
				console.error(err); // eslint-disable-line no-console
				return process.exit(1);
			}
		});
	}
});
