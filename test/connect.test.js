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
		it('connects the passed component with a model in the context', () => {
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
		it('connects the passed component with a model on the component\'s props', () => {
			const model = new Model({count: 0});
			const mountedComponent = mount(
				<ContainerComponent model={model} />
			);
			assert.strictEqual(mountedComponent.find('#counter').text(), '0');
			mountedComponent.find('#counter').simulate('click');
			assert.strictEqual(mountedComponent.find('#counter').text(), '1');
			mountedComponent.find('#counter').simulate('click');
			assert.strictEqual(mountedComponent.find('#counter').text(), '2');
		});
		it('gives access to the container component\'s own props', () => {
			const model = new Model({count: 0});
			const mapModelAndSelfToProps = (model, ownProps) => {
				return {
					count: model.get('count')
					, handleClick: () => {
						model.set(
							'count', model.get('count') + ownProps.increment
						);
					}
				};
			};
			const DoubleComponent = connect(mapModelAndSelfToProps)(DumbComponent);
			const mountedComponent = mount(
				<Provider model={model}>
					<DoubleComponent increment={2} />
				</Provider>
			);
			assert.strictEqual(mountedComponent.find('#counter').text(), '0');
			mountedComponent.find('#counter').simulate('click');
			assert.strictEqual(mountedComponent.find('#counter').text(), '2');
			mountedComponent.find('#counter').simulate('click');
			assert.strictEqual(mountedComponent.find('#counter').text(), '4');
		});
		it('can override the model events that trigger a rerendering', () => {
			const model = new Model({count: 0});
			const CustomComponent = connect(mapModelToProps, 'sync', 'custom')(DumbComponent);
			const mountedComponent = mount(
				<Provider model={model}>
					<CustomComponent />
				</Provider>
			);
			assert.strictEqual(mountedComponent.find('#counter').text(), '0');
			mountedComponent.find('#counter').simulate('click');
			assert.strictEqual(mountedComponent.find('#counter').text(), '0');
			model.trigger('sync');
			assert.strictEqual(mountedComponent.find('#counter').text(), '1');
			mountedComponent.find('#counter').simulate('click');
			assert.strictEqual(mountedComponent.find('#counter').text(), '1');
			model.trigger('custom');
			assert.strictEqual(mountedComponent.find('#counter').text(), '2');
		});
		it('throws when trying to connect a component where no model is available', () => {
			const model = new Model();
			const passThru = (m, p) => ({...m, ...p});
			const ThrowingComponent = connect(passThru)(DumbComponent);
			assert.throws(() => {
				mount(<ThrowingComponent />);
			});
			const ModelComponent = connect(passThru)(DumbComponent);
			assert.doesNotThrow(() => {
				mount(
					<Provider model={model}>
						<ModelComponent />
					</Provider>
				);
			});
			assert.doesNotThrow(() => {
				mount(
					<ModelComponent model={model} />
				);
			});
		});
	});
});
