// TODO(gdi2290): switch to DLLs

// Polyfills

// import 'ie-shim'; // Internet Explorer 9 support
// import 'core-js/es6';

// Add parts of es6 which are necessary for your project or your browser support requirements.
// This first set is minimum set required by Angular2 itself.
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/reflect';

// This one I'm adding myself...
// import 'es6-promise';
// import {polyfill as assign_polyfill} from 'es6-object-assign';
// import {polyfill as promise_polyfill} from 'es6-promise';

// promise_polyfill();
// assign_polyfill();

// require('es6-object-assign').polyfill();
// import obj_assign = require('es6-object-assign');
// obj_assign.polyfill();

// These appear to go beyond what Angular requires?
// import 'core-js/es6/weak-map';
// import 'core-js/es6/weak-set';
// import 'core-js/es6/typed';

// see issue https://github.com/AngularClass/angular2-webpack-starter/issues/709
import 'core-js/es6/promise';

import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

// Typescript emit helpers polyfill.  Enables use of no-emit-helpers option in tsconfig.json.
import 'ts-helpers';


if ('production' === ENV) {
  // Production
} else {
  // Development
  Error.stackTraceLimit = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}
