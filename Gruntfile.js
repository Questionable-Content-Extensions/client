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

/* global module, require */

const resolve = require('rollup-plugin-node-resolve');
const commonJs = require('rollup-plugin-commonjs');
const virtual = require('rollup-plugin-virtual');
const babel = require('rollup-plugin-babel');

const licenseBanner = require('./licenseBanner');
const userScriptBanner = require('./userScriptBanner');

const baseFileName = 'qc-ext';

module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			css: {
				files: [
					'**/*.sass',
					'**/*.scss'
				],
				tasks: ['build']
			},
			js: {
				files: [
					'assets/js/**/*.js',
					'Gruntfile.js'
				],
				tasks: ['build']
			},
			templates: {
				files: [
					'templates/*.*'
				],
				tasks: ['build']
			}
		},
		compass: {
			dist: {
				options: {
					sassDir: 'assets/sass',
					cssDir: 'assets/generated',
					outputStyle: 'compressed'
				}
			}
		},
		eslint: {
			target: [
				'assets/js/**/*.js',
				'*.js',
				'scripts/*.js'
			]
		},
		concat: {
			options: {
				separator: '',
				stripBanners: true
			},
			variables: {
				src: [
					'assets/templates/variables.pre.template',
					'assets/generated/css.variables.pass1.js',
					'assets/generated/html.variables.pass1.js',
					'assets/templates/variables.post.template'
				],
				dest: 'assets/generated/variables.pass2.js'
			},
			source: {
				options: {
					banner: `${licenseBanner}\n${userScriptBanner}\n`
				},
				src: [
					'assets/generated/rollup.js'
				],
				dest: `dist/${baseFileName}.user.js`
			}
		},
		uglify: {
			options: {
				banner: licenseBanner + '\n' + userScriptBanner
			},
			target: {
				files: {
					[`dist/${baseFileName}.min.user.js`]: [`dist/${baseFileName}.user.js`]
				}
			}
		},
		filesToJavascript: {
			css: {
				options: {
					inputFilesFolder: 'assets/generated',
					inputFileExtension: 'css',
					outputBaseFile: 'assets/templates/variables.empty.template',
					outputBaseFileVariable: 'variables.css',
					outputFile: 'assets/generated/css.variables.pass1.js'
				}
			},
			htmlTemplates: {
				options: {
					inputFilesFolder: 'assets/generated',
					inputFileExtension: 'html',
					outputBaseFile: 'assets/templates/variables.empty.template',
					outputBaseFileVariable: 'variables.html',
					outputFile: 'assets/generated/html.variables.pass1.js'
				}
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'assets/generated/navigation.html': 'assets/templates/navigation.html',
					'assets/generated/extra.html': 'assets/templates/extra.html',
					'assets/generated/extraNav.html': 'assets/templates/extraNav.html',
					'assets/generated/settings.html': 'assets/templates/settings.html',
					'assets/generated/editComicData.html': 'assets/templates/editComicData.html',
					'assets/generated/editLog.html': 'assets/templates/editLog.html',
					'assets/generated/addItem.html': 'assets/templates/addItem.html',
					'assets/generated/setTitle.html': 'assets/templates/setTitle.html',
					'assets/generated/setTagline.html': 'assets/templates/setTagline.html',
					'assets/generated/setPublishDate.html': 'assets/templates/setPublishDate.html',
					'assets/generated/donut.html': 'assets/templates/donut.html',
					'assets/generated/ribbon.html': 'assets/templates/ribbon.html',
					'assets/generated/itemDetails.html': 'assets/templates/itemDetails.html',
					'assets/generated/comicNav.html': 'assets/templates/comicNav.html',
					'assets/generated/changeLog.html': 'assets/templates/changeLog.html',
					'assets/generated/date.html': 'assets/templates/date.html',
					'assets/generated/comic.html': 'assets/templates/comic.html'
				}
			}
		},
		rollup: {
			options: {
				pureExternalImports: true,
				plugins: [
					babel(),
					virtual({
						'jquery': 'export default jQuery',
						'angular': 'export default angular',
						'greasemonkey': 'export default GM'
					}),
					resolve({
						browser: true
					}),
					commonJs()
				]
			},
			main: {
				files: {
					'assets/generated/rollup.js': 'assets/js/app.js'
				}
			}
		},
		flow: {
			options: {
				server: false
			},
			files: ['assets/js/**/*.js']
		},
		babel: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'assets/generated/babel.js': 'assets/js/app.js'
				}
			}
		}
	});

	// Load the Grunt tasks.
	require('load-grunt-tasks')(grunt);

	// Register the tasks.
	grunt.registerTask('default', ['build', 'check', 'uglify']);
	grunt.registerTask('build', [
		'compass',            // Compile CSS
		'htmlmin',            // Minify HTML templates
		'filesToJavascript',  // Convert HTML templates to JS variables
		'concat:variables',   // Create finished variable.pass2.js file
		'rollup:main',        // Rollup all the javascript files into one
		'concat:source',      // Add banner to rollup result
	]);

	grunt.registerTask('check', [
		'flow',               // Type-checking
		'eslint',             // Check for lint
	]);
};
