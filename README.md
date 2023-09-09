# Questionable Content Extensions Userscript

[![CI](https://github.com/Questionable-Content-Extensions/client/actions/workflows/CI.yml/badge.svg)](https://github.com/Questionable-Content-Extensions/client/actions/workflows/CI.yml)

Questionable Content Extensions Userscript is the client-half of the Questionable Content Extensions stack. You can find the server-half [in this sibling repository](https://github.com/Questionable-Content-Extensions/client). The project also has [its own website](https://questionablextensions.net/).

Questionable Content Extensions is a project to add additional features to the [Questionable Content](http://questionablecontent.net/) comic. The way it does this is by adding additional features to the webcomic. The extension has the following main features:

It turns the site into a single-page application, so that navigating between comics doesn't require a full page reload. This makes reading the comic much more pleasant by requiring less bandwidth and thus being speedier/snappier.

It adds additional navigation based on who's in the comics and where they're taking place.

## Getting Started

### Using the usercript

In Firefox or Chrome, install [Greasemonkey](https://addons.mozilla.org/en-CA/firefox/addon/greasemonkey/) or [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
You can then install the userscript by installing by going [here](https://questionablextensions.net/releases/qc-ext.latest.user.js).

### Building the userscript

To build this project, you can install the build environment on your own computer, or you can make use of a [Docker](https://www.docker.com/) container, which will take care of setting the build environment up for you.

#### Building on your own computer

This project requires [Node.js®](https://nodejs.org/). Currently we're targeting Node v18.x, but it should most likely work with later versions too.

Install it on your system in whatever manner is appropriate for your operating system, clone this repository, then run the following commands in the repository directory:

```shell
npm install
npm build-userscript
```

This will produce two files in the `/dist` directory of this repository, `qc-ext.user.js`, which is a production build version of the user script and
`qc-ext-dev.user.js`, which is a development build version of the user script. For doing development, you'll want to install the latter file in your userscript browser extension.

#### Developing on your own computer

Because of the way this project is set up (based on ideas and code from [siefkenj/react-userscripts](https://github.com/siefkenj/react-userscripts/)), you don't have to re-build and re-install the script each time you make a change. Instead, build the script as described above and install `qc-ext-dev.user.js` in the browser once. Then, run the following command:

```shell
npm run start
```

Much like it works in a regular React project, this command will continuously rebuild the project as the code changes. In Chromium based browsers, the page will refresh automatically when this happens, in Firefox you must refresh manually.

#### Building using Docker

> **NOTE**: While testing, I've been having various issues using Docker for this purpose. Just be aware that while the instructions below should work in theory, you might run into the same issues I did, and may find it more productive to either develop directly on your own system, or make use of something like VSCode's dev-containers.

Install [Docker](https://www.docker.com/) if you don't already have it on your system. (If you're not familiar with Docker from before, reading the [Getting Started](https://www.docker.com/get-started) documentation is recommended to get a feel for what it is about.)

Once Docker is installed, clone this repository, then run the following command:

```shell
docker build -t qcext-client .
```

You'll want to re-run this command if you change anything outside of `src`. To avoid having to re-run it when something inside `src` changes, we mount `src` as a volume inside the container.

Once completed, you can run

```shell
docker run \
    --mount "type=bind,source=${PWD}/src,target=/app/src" \
    --mount "type=bind,source=${PWD}/dist,target=/app/dist" \
    --rm -it \
    qcext-client \
    build-userscript
```

which will produce two files in the `/dist` directory of this repository, `qc-ext.user.js`, which is a production build version of the user script and
`qc-ext-dev.user.js`, which is a development build version of the user script. For doing development, you'll want to install the latter file in your userscript browser extension.

#### Developing using Docker

Because of the way this project is set up (based on ideas and code from [siefkenj/react-userscripts](https://github.com/siefkenj/react-userscripts/)), you don't have to re-build and re-install the script each time you make a change. Instead, build the script as described above and install `qc-ext-dev.user.js` in the browser once. Then, run the following command:

```shell
docker run \
    --mount "type=bind,source=${PWD}/src,target=/app/src" \
    -p 8124:8124 \
    --rm -it \
    qcext-client \
    start
```

Much like it works in a regular React project, this command will continuously rebuild the project as the code changes. In Chromium based browsers, the page will refresh automatically when this happens, in Firefox you must refresh manually.

If you're experiencing that it does not detect file changes, try uncommenting the commented out configuration near the end of `config-overrides.js` to see if it helps.

<!-- <hr>
<ol>
  <li id="footnote-recommended">Using Docker means you don't have to make any changes to your own computer besides installing Docker, which may help prevent "cluttering" up your computer with things you don't use otherwise.</li>
</ol> -->
