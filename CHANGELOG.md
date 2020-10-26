# Change Log
All notable changes to the "vscode-commit-reminder" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] Oct 26, 2020
### Added
    - New config option intervalUnit, defaults to minutes
### Changed
    - Renamed output channel from VSCode Commit Reminder > Commit Reminder
### Misc
    - Updated dependencies

## [0.2.1] Aug 20, 2020
### Misc
    - Updated dependencies

## [0.2.0] Jul 4, 2020
### Added
    - New config option minimumFileChanges, defaults to 2
    - New config option minimumChanges, defaults to 10 (insertions + deletions)
### Changed
    - Moved error logs to output channel
### Misc
    - Updated dependencies

## [0.1.1] Jun 19, 2020
### Added
    - Added this changelog
### Changed
    - Bump dependency to fix initial interval message

## [0.1.0] Jun 19, 2020
### Fixed
    - Fixed interval minutes from last update

## [0.0.3] Jun 19, 2020
### Added
    - Check for git repo when config is changed
### Changed
    - rootPath to workspaceFolders
### ⚠️ Warning
    - Do NOT use this version since I messed the configurable minutes up and will spam messages every 5 seconds

## [0.0.2] Jun 17, 2020
### Changed
    - Updated dependencies
    - Minimum vscode version from 1.40.0 to 1.46.0
### Fixed
    - Check if workspace is a git repo
    - Moved error message from popup to console

## [0.0.1] Dec 13, 2019
### Added
    - Initial Release
