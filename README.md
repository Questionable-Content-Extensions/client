# Questionable Content Extensions User Script [![Build Status](https://travis-ci.org/Questionable-Content-Extensions/client.svg?branch=master)](https://travis-ci.org/Questionable-Content-Extensions/client) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.svg)](http://gruntjs.com/)

## Getting Started

To build this project, you can make use of a [Vagrant virtual machine build environment](https://www.vagrantup.com/) which will take care of setting the build environment up for you (recommended) or, you can install the build environment on your own computer.

### Building using Vagrant

Install [Vagrant](https://www.vagrantup.com/) if you don't already have it on your system. (If you're not familiar with Vagrant from before, reading the [Getting Started](https://www.vagrantup.com/docs/getting-started/) documentation is recommended to get a feel for what it is about.)

Once Vagrant is installed, clone this repository, then run the following commands in the repository directory:

```shell
vagrant up  # To initialize the Vagrant virtual machine (this will take a while the first time)
vagrant ssh # To log into the virtual machine
grunt build # To build our script
```

After having run the commands above, you should have files created at `dist\qc-ext.user.js` and `dist\qc-ext.min.user.js` within the repository. These files can be opened in Greasemonkey or Tampermonkey directly.

Whenever you've made changes and want to incorporate them into the user script, simply run `grunt build` in the Vagrant VM again.

When you're done developing, simply log off the virtual machine (`exit`) and run `vagrant suspend` or `vagrant halt`. To resume work later, just repeat the sequence of commands shown above. Should you want to remove the virtual machine, run `vagrant destroy`.

### Building on your own computer

This project requires [Node.js®](https://nodejs.org/) and [Ruby](https://www.ruby-lang.org/). Install them on your system in whatever manner is appropriate for your operating system, clone this repository, then run the following commands in the repository directory:

```shell
gem install compass      # If you don't have compass installed already
npm install -g grunt-cli # If you don't have grunt installed already
npm install              # To install all the grunt plugins we use
grunt build              # To build our script
```

After having run the commands above, you should have files created at `dist\qc-ext.user.js` and `dist\qc-ext.min.user.js` within the repository. These files can be opened in Greasemonkey or Tampermonkey directly.

Whenever you've made changes and want to incorporate them into the user script, simply run `grunt build` again.

