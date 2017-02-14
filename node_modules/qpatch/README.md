qpatch
======

"Patch" JS Classes using node's std callbacks to use Q promises

### Example

```js
var qClass = require('qpatch');

var newClass = qClass(someOldClass, ['methods_to_exclude', '...']);

// newClass' methods now return promises instead of accepting callbacks

```
