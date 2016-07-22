import React, {PropTypes} from 'react';
import assert from 'assert';
import {mount} from 'enzyme';
import {Model} from 'backbone';

import Provider from './../src/provider.jsx';

const TestComponent = (props, {model}) => (
	<div id='data'>{model.get('data')}</div>
);
TestComponent.contextTypes = {model: PropTypes.instanceOf(Model)};

describe('provider.jsx', () => {
	describe('<Provider />', () => {
		it('injects the passed model into the tree\'s context', () => {
			const model = new Model({data: 'Zalgo he comes'});
			const mountedComponent = mount(
				<Provider model={model}>
					<TestComponent />
				</Provider>
			);
			assert(mountedComponent.find('#data').text(), 'Zalgo he comes');
		});
	});
});
