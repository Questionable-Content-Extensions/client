# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added ✨

-   Add the ability to lock comic navigation to an item. Closes [#33](https://github.com/Questionable-Content-Extensions/client/issues/33)

### Fixed 🐛

-   Fix Storybook tests after upgrading from 6.5 to 7.4. Fixes [#78](https://github.com/Questionable-Content-Extensions/client/issues/78)

## [1.1.0] - 2023-09-10

### Added ✨

-   Add guest comic/non-canon pills to `ComicList`
-   Add Storybook link to README
-   Added list of comics an item is featured in. Closes [#19](https://github.com/Questionable-Content-Extensions/client/issues/19)
-   Added feature and setting for whether to show the current comic's tagline as its tooltip. Closes [#47](https://github.com/Questionable-Content-Extensions/client/issues/47)
-   Added feature and setting for being able to navigate to random comics by item. Closes [#20](https://github.com/Questionable-Content-Extensions/client/issues/20)

### Changed 🔧

-   Upgraded all dependencies to their latest versions and made the necessary changes to make things work the same as before

### Fixed 🐛

-   Don't show "last strip" button in item navigation bar when said strip is the current strip
-   The logic for which exclusion setting takes precedence was backwards, so if you had set both "skip non-canon comics" and "skip guest comics," it would only skip guest comics, but not non-canon comics. Fixes [#36](https://github.com/Questionable-Content-Extensions/client/issues/36)
-   Single-frame flicker at the end of dialog close animation removed. Fixes [#70](https://github.com/Questionable-Content-Extensions/client/issues/70)

## [1.0.0][] - 2023-09-09

> Hello! It has once again been a while, but this time, it's a big one! I've been meaning to do it for a long time, but I finally got around to rewrite the extension from scratch using React as the framework rather than AngularJS v1. While I was at it, I also updated/upgraded everything else about the script that I could, and it's much more modern and user friendly now.
>
> Since this is a rewrite, the change log below will be mostly _added_ features rather than changed or fixed ones. Old features that have been migrated into the new version won't be mentioned unless changed significantly in the rewrite.

### Added ✨

-   Add Storybookjs
-   Added `GoToComicDialog` for choosing a specific comic from a list
-   Added ko-fi donation link in bottom of `SettingsDialog`

### Changed 🔧

-   In coordination with the server, the API has been optimized to transfer a lot less data in each request.
-   Make `debug` logging dynamic rather than chosen at startup

### Fixed 🐛

-   Make `shortcut` take-over code work properly everywhere

### Removed 🗑

-   Removed small/large ribbon setting; ribbon is always small now.

## [0.6.2][] - 2022-08-31

> It's been a while! And this release isn't really one of improvement, but rather necessity. For the longest time, the Questionable Content Extensions has used Heroku's free plan as its backend, because this is a hobby project, and I don't really have the means to pay for dedicated hosting and bandwidth for it, as I make no money off this project, and I don't want it to be a financial burden. [Heroku/Salesforce has finally decided to remove their free tier](https://blog.heroku.com/next-chapter), which is neither surprising nor unexpected, but that naturally means that I have to use a different solution.
>
> For the time being, I'm going to go back to self-hosting, as I did before I discovered Heroku and switched to it. We'll just have to see whether it makes an impact on my costs or not. In a more positive turn of events, the self-hosted server appears to have much better performance than Heroku did, so that's a plus.
>
> Just in case someone's feeling generous or want to demonstrate gratitude for this thing I've made, I'm just going to leave this here as well. 😊
>
> [![Buy Me a Coffee at ko-fi.com](https://cdn.ko-fi.com/cdn/kofi2.png?v=3 'height:36px')](https://ko-fi.com/ilyvion)

### Changed 🔧

-   Move to Docker from Vagrant
-   Format files according to Prettier standard.
-   Better handling of error communicating with server
-   Accept colors with and without `#` prefix
-   Run `dist` with the build script
-   Change link from Heroku to local server
-   Update copyright end year

### Fixed 🐛

-   Fix field spelling

## [0.6.1][] - 2019-12-08

### Fixed 🐛

-   Better fix for missing sidebar. More idiomatic fix for Issue [#37](https://github.com/Questionable-Content-Extensions/client/issues/37). It uses jQuery within the proper file, just before adding the sidebar base. It also directly tests the DOM to see if the "small-2" column is missing, rather than just guessing using the URL. Fixes [#37](https://github.com/Questionable-Content-Extensions/client/issues/37)

## [0.6.0][] - 2019-03-08

> This release, like the previous one, has been mostly about code quality and features for editors and me, the developer. I'm hoping that I can now start putting in more features for the end-user as we move towards version 0.7. If you have ideas for new features, or you have any problems with the extension as it is, don't hesitate to [tell us about them][issues]! While I have quite a lot of ideas left to implement, I'd also love to implement ideas that aren't just my own.

### Added ✨

-   Add support for the new item image system and for image uploading
-   Add edit log view for editors
-   Add flags for indicating whether a comic is lacking certain features
-   Add loading indicators for the comic image. Implements the comic image of [#14](https://github.com/Questionable-Content-Extensions/client/issues/14).
-   Add updating indicators for the item details dialog
-   Add updating indicators and/or disable controls for editor actions
-   Add loading indicators for edit log. Closes [#14](https://github.com/Questionable-Content-Extensions/client/issues/14)
-   Add ItemService to avoid loading data multiple times
-   Report version to server. Closes [#29](https://github.com/Questionable-Content-Extensions/client/issues/29)
-   Create LICENSE

### Changed 🔧

-   Use async where possible
-   Do events for loading item data
-   Supports using the correct image format data from the server, which closes [#17](https://github.com/Questionable-Content-Extensions/client/issues/17)
-   Update copyright year
-   Rename ComicDataControllerBase to EventHandlingControllerBase
-   Separate out code checking from building. To speed up building simple fixes and amendments (Flow and ESLint are slow)
-   Move more code to ItemService, where it belongs. Closes [#31](https://github.com/Questionable-Content-Extensions/client/issues/31)
-   Organize the existing CSS
-   Extract inline styles to proper style classes. Closes [#32](https://github.com/Questionable-Content-Extensions/client/issues/32)
-   Update copyright year also for HTML templates
-   Update build packages
-   Fully transition to using events for maintenance mode

### Fixed 🐛

-   Fix various minor bugs
-   Ensure maintenance mode is handled correctly everywhere. Closes [#27](https://github.com/Questionable-Content-Extensions/client/issues/27)
-   Handle errors at all in the edit log dialog
-   Set $inject on SettingsController so the code keeps working uglified/minified
-   Ensure that random comic navigation respects exclusion settings. Closes [#18](https://github.com/Questionable-Content-Extensions/client/issues/18)
-   Fix indentation in constants.js
-   Undo checkboxes and turn off update indicator when updates fail
-   Fix server/client API mismatch
-   Due to requiring generated assets, building must happen before checking

## [0.5.3][] - 2019-03-01

### Added ✨

-   Added upgrade path for settings saved with GM4 shim

### Changed 🔧

-   Replaced JSHint and JSCS with ESLint
-   Upgraded codebase to use ES6 modules instead of implied file order and allow using up to ES2017 features
-   Begin transition to using Flow for type checking
-   Switch to new server address
-   Use Flow
-   Refactor code to use classes
-   Improve build system

### Fixed 🐛

-   Fix change log version comparison issue
-   (Attempted to) Fix Travis build
-   Fix issue where settings weren't being saved

### Removed 🗑

-   Removed GM4 shim now that we're using native GM4 functions

## [0.5.2][] - 2018-10-03

### Added ✨

-   Add shim to support GM 4.0 (PR [#23](https://github.com/Questionable-Content-Extensions/client/pull/23))

### Changed 🔧

-   Turn off maximum line length code style requirement
-   Don't reinvent the wheel — use Angular's date formatting. Also, since the date formatting is now done at the template level rather than on comic data load, changing the 12h/24h time setting doesn't require a full refresh of the comic data in order to reformat.
-   Set approximateDate to false during load to hide "(Approximately)" text
-   Ignore .tmp directory
-   Improve script installation/update change log handling

### Fixed 🐛

-   Fix build errors
-   Fix [#25](https://github.com/Questionable-Content-Extensions/client/issues/25)

## [0.5.1][] - 2017-04-08

### Added ✨

-   Add support for showing the comic strip publish date
-   Add support for setting the comic strip publish date
-   Add support for approximate publish dates
-   Add a ribbon indicating comic status for non-canon and guest strips. Closes [#4](https://github.com/Questionable-Content-Extensions/client/issues/4)
-   Show an indicator when the script is set to development mode

### Changed 🔧

-   Have our $http service always ask for JSON data
-   Deal better with server errors and maintenance
-   Make it possible to hit ENTER to navigate in the comic navigation widget
-   Add change log dialog that shows up on install and update

### Fixed 🐛

-   Reduce scope of overzealous border removal style. Fixes [#16](https://github.com/Questionable-Content-Extensions/client/issues/16)

### Removed 🗑

-   Remove unnecessary CSS logic from allItems header

## [0.5.0][] - 2017-03-30

### Added ✨

-   Show locations an item has visited/been shown together with
-   Set up support for using Vagrant to build our user script
-   Add navigation control, which lets you navigate to any specific comic #

### Changed 🔧

-   Update Grunt version and Grunt plugin versions
-   Make Travis use Ruby v2.4.1
-   Have VersionEye watch 'develop' branch instead of 'master'
-   Make "Show all members" behave much nicer than before. It now shows the cast/locations/storylines in the comic strip separate from the non-present cast/locations/storylines, and out of the way. (Also, fixes [#8](https://github.com/Questionable-Content-Extensions/client/issues/8) for real this time.)

### Fixed 🐛

-   Show all members should always work, even when a comic has no data. Fixes [#8](https://github.com/Questionable-Content-Extensions/client/issues/8)
-   Make the button the correct size

## [0.4.1][] - 2016-12-26

### Fixed 🐛

-   Fix invalid editor token causing an error in the comic load routine

## [0.4.0][] - 2016-12-26

### Added ✨

-   Add in missing notifications for locations, storylines, titles and taglines
-   Put comic number in site title for better browser navigation experience. Resolves [#11](https://github.com/Questionable-Content-Extensions/client/issues/11)

### Changed 🔧

-   Refactor extra-comic navigation into directive
-   Extract constant for tagline requirement threshold
-   When edit mode is enabled, include editor token on comic data request
-   Update non-color style to work with new page design
-   Refresh comic data when editor mode enabled
-   Changing an item's color now updates the UI immediately

### Fixed 🐛

-   Fix create-release script
-   Fix for dynamic news on QC frontpage
-   Fix indentation issues
-   Fix bug introduced regarding editorData from the web service
-   Save settings regardless of how the setting dialog is closed. Fixes [#3](https://github.com/Questionable-Content-Extensions/client/issues/3)
-   Fixed [#13](https://github.com/Questionable-Content-Extensions/client/issues/13) and hopefully also fixed [#12](https://github.com/Questionable-Content-Extensions/client/issues/12)

### Removed 🗑

-   Transfer TODO.txt to issues and delete it

## [0.3.3][] - 2016-08-19

### Changed 🔧

-   Update our visual style to better match new page design/layout

## [0.3.2][] - 2016-08-19

### Added ✨

-   Allow filtering quick-add dropdown by type of item.

### Fixed 🐛

-   Fix issue with getting latest comic # on homepage
-   Fix script to work with new page design/layout

## [0.3.1][] - 2016-03-23

### Fixed 🐛

-   Fix issue with next/previous comic calculation when server reports null/unknown

## [0.3.0][] - 2016-03-18

### Added ✨

-   Add "friend list" to cast info: Who's seen the most together with whom

### Changed 🔧

-   Use navigation data for next and previous comic from the webservice. Previously, the next and previous comic was just simple arithmetic, but this new method ensures that the next and previous comics respect the "skip guest" and "skip non-canon" settings.
-   Show different messages for different kinds of items

### Fixed 🐛

-   Don't interfere with Firefox' Alt+Left/Alt+Right navigation. Fixes [#2](https://github.com/Questionable-Content-Extensions/client/issues/2).
-   Deal with the two special cases of no next or no previous comic from the web service.
-   Editor mode: Show taglines missing only for comics >= 3133 and missing location

### Removed 🗑

-   Remove no longer used page.html template

## [0.2.1][] - 2016-03-13

### Fixed 🐛

-   Create special case for Firefox when it comes to using the "shortcut.js" script already in the page because it's not willing to work as you'd expect it to.

### Removed 🗑

-   Remove all dependencies on unsafeWindow (found ways around using it)

## [0.2.0][] - 2016-03-13

### Added ✨

-   Add some keyboard shortcuts to make edit mode easier to use
-   Add "tagline" support to the comic

### Changed 🔧

-   Position the "no image" elements more centrally
-   Better choice of word doesn't imply it's the last time we'll ever see them again
-   Doing some minor user interface improvements before first public release
-   Show proper error message dialog instead of just logging to console

## [0.1.2][] - 2016-03-12

### Added ✨

-   Add a developmentMode flag to let you easily switch between development and production server
-   Added item details dialog
-   Added donut/radial graph for showing how many % of comics items have participated in
-   Add script for easily making releases

### Changed 🔧

-   Show "Loading..." text when data for the next comic is loading rather than keep showing the old comic's news
-   Made default grunt task be 'build' instead of 'watch'
-   Move 'createTintOrShade' function from comicService to colorService (where it should've been in the first place)

### Fixed 🐛

-   Disable left/right directional button navigation in input boxes (mostly only useful for edit mode)
-   Fix item-group-button position issue

## [0.1.0][] - 2016-03-10

### Added ✨

-   Initial commit of existing source code
-   Add VersionEye dependency tracking to README.md
-   Update README.md and TODO.txt with information on Firefox issues

### Fixed 🐛

-   Attempt to fix Travis build

[0.6.2]: https://github.com/Questionable-Content-Extensions/client/compare/0.6.1...0.6.2
[0.6.1]: https://github.com/Questionable-Content-Extensions/client/compare/0.6.0...0.6.1
[0.6.0]: https://github.com/Questionable-Content-Extensions/client/compare/0.5.3...0.6.0
[0.5.3]: https://github.com/Questionable-Content-Extensions/client/compare/0.5.2...0.5.3
[0.5.2]: https://github.com/Questionable-Content-Extensions/client/compare/0.5.1...0.5.2
[0.5.1]: https://github.com/Questionable-Content-Extensions/client/compare/0.5.0...0.5.1
[0.5.0]: https://github.com/Questionable-Content-Extensions/client/compare/0.4.1...0.5.0
[0.4.1]: https://github.com/Questionable-Content-Extensions/client/compare/0.4.0...0.4.1
[0.4.0]: https://github.com/Questionable-Content-Extensions/client/compare/0.3.3...0.4.0
[0.3.3]: https://github.com/Questionable-Content-Extensions/client/compare/0.3.2...0.3.3
[0.3.2]: https://github.com/Questionable-Content-Extensions/client/compare/0.3.1...0.3.2
[0.3.1]: https://github.com/Questionable-Content-Extensions/client/compare/0.3...0.3.1
[0.3.0]: https://github.com/Questionable-Content-Extensions/client/compare/0.2.1...0.3
[0.2.1]: https://github.com/Questionable-Content-Extensions/client/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/Questionable-Content-Extensions/client/compare/0.1.2...0.2.0
[0.1.2]: https://github.com/Questionable-Content-Extensions/client/compare/0.1.0...0.1.2
[0.1.0]: https://github.com/Questionable-Content-Extensions/client/releases/tag/0.1.0
[issues]: https://github.com/Questionable-Content-Extensions/client/issues
[1.0.0]: https://github.com/Questionable-Content-Extensions/client/compare/0.6.2...1.0.0
[Unreleased]: https://github.com/Questionable-Content-Extensions/client/compare/1.1.0...HEAD
[1.1.0]: https://github.com/Questionable-Content-Extensions/client/compare/1.0.0...1.1.0
