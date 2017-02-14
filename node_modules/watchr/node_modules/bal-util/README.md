
<!-- TITLE/ -->

# [Benjamin Lupton's](http://balupton.com) Utility Functions

<!-- /TITLE -->


<!-- BADGES/ -->

[![Build Status](https://img.shields.io/travis/balupton/bal-util/master.svg)](http://travis-ci.org/balupton/bal-util "Check this project's build status on TravisCI")
[![NPM version](https://img.shields.io/npm/v/bal-util.svg)](https://npmjs.org/package/bal-util "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/bal-util.svg)](https://npmjs.org/package/bal-util "View this project on NPM")
[![Dependency Status](https://img.shields.io/david/balupton/bal-util.svg)](https://david-dm.org/balupton/bal-util)
[![Dev Dependency Status](https://img.shields.io/david/dev/balupton/bal-util.svg)](https://david-dm.org/balupton/bal-util#info=devDependencies)<br/>
[![Gratipay donate button](https://img.shields.io/gratipay/balupton.svg)](https://www.gratipay.com/balupton/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Common utility functions for Node.js used and maintained by Benjamin Lupton

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

## Install

### [NPM](http://npmjs.org/)
- Use: `require('bal-util')`
- Install: `npm install --save bal-util`

### [Browserify](http://browserify.org/)
- Use: `require('bal-util')`
- Install: `npm install --save bal-util`
- CDN URL: `//wzrd.in/bundle/bal-util@2.4.3`

### [Ender](http://ender.jit.su/)
- Use: `require('bal-util')`
- Install: `ender add bal-util`

<!-- /INSTALL -->


## Usage
Best off looking at source, it's well documented, and there are plenty of tests



## Future
We're in the process of abstracting the pieces of bal-util out into their own modules. So far, we've done the following:

- [ambi](https://github.com/bevry/ambi) < `balUtilFlow.fireWithOptionalCallback`
- [binaryextensions](https://github.com/bevry/binaryextensions) < `balUtilPaths.binaryExtensions`
- [eachr](https://github.com/bevry/eachr) < `balUtilFlow.each`
- [event-emitter-grouped](https://github.com/bevry/event-emitter-grouped) < `balUtilEvents.EventEmitterEnhanced`
- [extendr](https://github.com/bevry/extendr) < `balUtilFlow.(extend|clone|etc)`
- [extract-opts](https://github.com/bevry/extract-opts) < `balUtilFlow.extractOptsAndCallback`
- [getsetdeep](https://github.com/bevry/getsetdeep) < `balUtilFlow.(get|set)Deep`
- [ignorefs](https://github.com/bevry/ignorefs) < `balUtilPaths.isIgnoredPath`
- [ignorepatterns](https://github.com/bevry/ignorepatterns/blob/master/HISTORY.md) < `balUtilPaths.ignoreCommonPatterns`
- [istextorbinary](https://github.com/bevry/istextorbinary) < `balUtilPaths.(isTextSync|isText|getEncodingSync|getEncoding)`
- [safecallback](https://github.com/bevry/safecallback) < `balUtilFlow.safeCallback`
- [safefs](https://github.com/bevry/safefs) < `balUtilPaths.(openFile|closeFile|etc)`
- [safeps](https://github.com/bevry/safeps) < `balUtilModules`
- [taskgroup](https://github.com/bevry/taskgroup) < `balUtilFlow.Group`
- [textextensions](https://github.com/bevry/textextensions) < `balUtilPaths.textExtensions`
- [typechecker](https://github.com/bevry/typechecker) < `balUtilTypes`


<!-- CONTRIBUTE/ -->

## Contribute

[Discover how you can contribute by heading on over to the `CONTRIBUTING.md` file.](https://github.com/balupton/bal-util/blob/master/CONTRIBUTING.md#files)

<!-- /CONTRIBUTE -->


<!-- HISTORY/ -->

## History
[Discover the change history by heading on over to the `HISTORY.md` file.](https://github.com/balupton/bal-util/blob/master/HISTORY.md#files)

<!-- /HISTORY -->


<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- Benjamin Lupton <b@lupton.cc> (https://github.com/balupton)

### Sponsors

No sponsors yet! Will you be the first?

[![Gratipay donate button](https://img.shields.io/gratipay/balupton.svg)](https://www.gratipay.com/balupton/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

### Contributors

These amazing people have contributed code to this project:

- [Benjamin Lupton](https://github.com/balupton) <b@lupton.cc> — [view contributions](https://github.com/balupton/bal-util/commits?author=balupton)
- [Sean Fridman](https://github.com/sfrdmn) <fridman@mail.sfsu.edu> — [view contributions](https://github.com/balupton/bal-util/commits?author=sfrdmn)

[Become a contributor!](https://github.com/balupton/bal-util/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Licensed under the incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT license](http://creativecommons.org/licenses/MIT/)

Copyright &copy; 2011+ Benjamin Lupton <b@lupton.cc> (http://balupton.com)

<!-- /LICENSE -->


