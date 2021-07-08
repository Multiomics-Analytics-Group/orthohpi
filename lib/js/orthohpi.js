import '../js-build/phluid.bundle.js';

import * as orthohpi from './orthohpi/_index.js';

globalThis.orthohpi = orthohpi;

window.addEventListener('load', function() {
 window.app = new orthohpi.App(document.querySelector('#orthohpi'))
});