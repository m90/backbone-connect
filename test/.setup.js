import {jsdom} from 'jsdom';

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('<!doctype html><html><body><div id="mount-point"></div></body></html>', {
	url: 'http://localhost'
});
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
	if (typeof global[property] === 'undefined') {
		exposedProperties.push(property);
		global[property] = document.defaultView[property];
	}
});

global.navigator = {
	userAgent: 'node.js'
};
