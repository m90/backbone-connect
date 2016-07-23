import React, {PropTypes} from 'react';
import assert from 'assert';
import {mount} from 'enzyme';
import {Model, Collection} from 'backbone';

import Provider from './../src/provider.jsx';

const TestComponent = (props, {model}) => (
	<div id='data'>{model.get('data')}</div>
);
TestComponent.contextTypes = {model: PropTypes.instanceOf(Model)};

const CollectionComponent = (props, {model}) => (
	<div id='data'>
		{model.map((el, i) => {
			return <p key={i}>{el.get('a')}</p>;
		})}
	</div>
);
CollectionComponent.contextTypes = {model: PropTypes.instanceOf(Collection)};

describe('provider.jsx', () => {
	describe('<Provider />', () => {
		it('injects the passed Backbone Model into the tree\'s context', () => {
			const model = new Model({data: 'Zalgo he comes'});
			const mountedComponent = mount(
				<Provider model={model}>
					<TestComponent />
				</Provider>
			);
			assert.strictEqual(
				mountedComponent.find('#data').text()
				, 'Zalgo he comes'
			);
		});
		it('injects the passed Backbone Collection into the tree\'s context', () => {
			const collection = new Collection([{a: 1}, {a: 2}, {a: 9}]);
			const mountedComponent = mount(
				<Provider model={collection}>
					<CollectionComponent />
				</Provider>
			);
			assert.strictEqual(mountedComponent.find('p').length, 3);
			assert.strictEqual(mountedComponent.find('#data').text(), '129');
		});
	});
});
