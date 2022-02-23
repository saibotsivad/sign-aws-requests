# changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

Change categories are:

* `Added` for new features.
* `Changed` for changes in existing functionality.
* `Deprecated` for once-stable features removed in upcoming releases.
* `Removed` for deprecated features removed in this release.
* `Fixed` for any bug fixes.
* `Security` to invite users to upgrade in case of vulnerabilities.

---

## [2.2.0](https://github.com/saibotsivad/sign-aws-requests/compare/v2.1.0...v2.2.0) - 2022-02-23
### Added
- TypeScript definitions. Hopefully I got them right...

## [2.1.0](https://github.com/saibotsivad/sign-aws-requests/compare/v2.0.0...v2.1.0) - 2022-02-23
### Added
- If you pass in an object as `body` on the request, it'll convert it to a string and return `bodyString` with `authorization`.
- If you pass in `formencode: true` to the `options` and an object as `body` when signing a request, the `bodyString` will be Form URL encoded.

## [2.0.0](https://github.com/saibotsivad/sign-aws-requests/compare/v1.0.1...v2.0.0) - 2022-02-21
### Changed
- BREAKING CHANGE: All in on type=module now, remapped package.json fields.
- Updated all dev dependencies

## [1.0.1](https://github.com/saibotsivad/sign-aws-requests/compare/v1.0.0...v1.0.1) - 2020-01-31
### Changed
* Commit built dist files to github.
### Fixed
* Re-build before publishing to npm.

## [1.0.0](https://github.com/saibotsivad/sign-aws-requests/compare/v0.0.0...v1.0.0) - 2020-01-31
Initial release.
