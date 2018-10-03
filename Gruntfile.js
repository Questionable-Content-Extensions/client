/* 
 * Copyright (C) 2016 Alexander Krivács Schrøder <alexschrod@gmail.com>
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
                    'assets/js/*.js',
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
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                verbose: true
            },
            all: ['Gruntfile.js', 'assets/js/*.js']
        },
        jscs: {
            src: 'assets/js/*.js',
            options: {
                config: '.jscsrc',
                fix: false
            }
        },
        concat: {
            options: {
                separator: '',
                stripBanners: true
            },
            variables: {
                src: [
                    'assets/generated/css.variables.pass1.js',
                    'assets/generated/angular.variables.pass1.js',
                    'assets/templates/variables.post.template'
                ],
                dest: 'assets/generated/variables.pass2.js'
            },
            source: {
                options: {
                    banner: '<%= pkg.licenseBanner %>\n<%= pkg.userscriptBanner %>'
                },
                src: [
                    'assets/js/gm4-shim.js',
                    'assets/js/constants.js',
                    'assets/generated/variables.pass2.js',
                    'assets/js/settings.js',
                    'assets/js/module.js',
                    'assets/js/module.*.js',
                    'assets/js/dom-operations.js',
                    'assets/js/config.js',
                    'assets/js/qc-ext-*.js',
                    'assets/js/bootstrap.js'
                ],
                dest: 'dist/qc-ext.user.js'
            }
        },
        uglify: {
            options: {
                mangle: {
                    except: ['jQuery', 'angular', 'GM_setValue', 'GM_getValue', 'GM_deleteValue', 'GM_xmlhttprequest', 'unsafeWindow'],
                    screwIE8: true
                },
                banner: '<%= pkg.licenseBanner %>\n<%= pkg.userscriptBanner %>'
            },
            target: {
                files: {
                    'dist/qc-ext.min.user.js': ['dist/qc-ext.user.js']
                }
            }
        },
        filesToJavascript: {
            css: {
                options: {
                    inputFilesFolder: 'assets/generated',
                    inputFileExtension: 'css',
                    outputBaseFile: 'assets/templates/variables.pre.template',
                    outputBaseFileVariable: 'qcExt.variables.css',
                    outputFile: 'assets/generated/css.variables.pass1.js'
                }
            },
            angularTemplates: {
                options: {
                    inputFilesFolder: 'assets/generated',
                    inputFileExtension: 'html',
                    outputBaseFile: 'assets/templates/variables.empty.template',
                    outputBaseFileVariable: 'qcExt.variables.angularTemplates',
                    outputFile: 'assets/generated/angular.variables.pass1.js'
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
                    'assets/generated/addItem.html': 'assets/templates/addItem.html',
                    'assets/generated/setTitle.html': 'assets/templates/setTitle.html',
                    'assets/generated/setTagline.html': 'assets/templates/setTagline.html',
                    'assets/generated/setPublishDate.html': 'assets/templates/setPublishDate.html',
                    'assets/generated/donut.html': 'assets/templates/donut.html',
                    'assets/generated/ribbon.html': 'assets/templates/ribbon.html',
                    'assets/generated/itemDetails.html': 'assets/templates/itemDetails.html',
                    'assets/generated/comicNav.html': 'assets/templates/comicNav.html',
                    'assets/generated/changeLog.html': 'assets/templates/changeLog.html',
                    'assets/generated/date.html': 'assets/templates/date.html'
                }
            }
        }
    });

    // Load the Grunt tasks.
    require('load-grunt-tasks')(grunt);

    // Register the tasks.
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', [
        'jshint',             // Check for lint
        'jscs',               // Check code style
        'compass',            // Compile CSS
        'htmlmin',            // Minify HTML templates
        'filesToJavascript',  // Convert HTML templates to JS variables
        'concat:variables',   // Create finished variable.pass2.js file
        'concat:source',      // Concatenate all the javascript files into one
        'uglify',             // Minify the javascript
    ]);
};
