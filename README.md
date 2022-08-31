# Questionable Content Extensions User Script [![Build Status](https://travis-ci.org/Questionable-Content-Extensions/client.svg?branch=master)](https://travis-ci.org/Questionable-Content-Extensions/client) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.svg)](http://gruntjs.com/)

## Getting Started

To build this project, you can make use of a [Docker](https://www.docker.com/) container, which will take care of setting the build environment up for you (recommended) or, you can install the build environment on your own computer.

### Building using Docker

Install [Docker](https://www.docker.com/) if you don't already have it on your system. (If you're not familiar with Docker from before, reading the [Getting Started](https://www.docker.com/get-started) documentation is recommended to get a feel for what it is about.)

Once Docker is installed, clone this repository, then run the build.ps1 file. If you're not using Powershell, run the commands from build.ps1 manually in your own shell.

After having run the commands, you should have files created at `dist\qc-ext.user.js`. This file can be opened in Greasemonkey or Tampermonkey directly.

Whenever you've made changes and want to incorporate them into the user script, simply run the build script again.

### Building on your own computer

This project requires [Node.js®](https://nodejs.org/) and [Ruby](https://www.ruby-lang.org/). Install them on your system in whatever manner is appropriate for your operating system, clone this repository, then run the following commands in the repository directory:

```shell
gem install compass      # If you don't have compass installed already
npm install -g grunt-cli # If you don't have grunt installed already
npm install              # To install all the grunt plugins we use
grunt                    # To build our script
```

After having run the commands above, you should have files created at `dist\qc-ext.user.js`. This file can be opened in Greasemonkey or Tampermonkey directly.

Whenever you've made changes and want to incorporate them into the user script, simply run `grunt` again.
