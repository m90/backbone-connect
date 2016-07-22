import React, {PropTypes} from 'react';
import assert from 'assert';
import {mount} from 'enzyme';
import {Model} from 'backbone';

import Provider from './../src/provider.jsx';
import connect from './../src/connect.jsx';

const DumbComponent = ({
	count
	, handleClick
}) => (
	<button
		id='counter'
		onClick={handleClick}
	>
		{count}
	</button>
);
DumbComponent.propTypes = {
	count: PropTypes.number
	, handleClick: PropTypes.func
};

const mapModelToProps = (model) => {
	return {
		count: model.get('count')
		, handleClick: () => {
			model.set('count', model.get('count') + 1);
		}
	};
};

const ContainerComponent = connect(mapModelToProps)(DumbComponent);

describe('connect.jsx', () => {
	describe('connect(mapModelToProps, ...renderEvents)', () => {
		it('connects the passed component with the model', () => {
			const model = new Model({count: 0});
			const mountedComponent = mount(
				<Provider model={model}>
					<ContainerComponent />
				</Provider>
			);
			assert.strictEqual(mountedComponent.find('#counter').text(), '0');
			mountedComponent.find('#counter').simulate('click');
			assert.strictEqual(mountedComponent.find('#counter').text(), '1');
			mountedComponent.find('#counter').simulate('click');
			assert.strictEqual(mountedComponent.find('#counter').text(), '2');
		});
	});
});
