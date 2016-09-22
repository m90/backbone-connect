import React, {PropTypes} from 'react';
import assert from 'assert';
import {mount} from 'enzyme';
import {Model, Collection} from 'backbone';

import Provider from './../src/provider';
import connect from './../src/connect';

const DumbComponent = ({
	count
	, handleClick
}) => (
	<button
		className='counter'
		onClick={handleClick}
	>
		{count}
	</button>
);
DumbComponent.propTypes = {
	count: PropTypes.number
	, handleClick: PropTypes.func
};

const CounterList = (props) => (
	<div>
		{props.counters.map((counter, i) => (
			<DumbComponent
				key={i}
				count={counter.count}
				handleClick={props.handleClick}
			/>
		))}
	</div>
);
CounterList.displayName = 'CounterList';
CounterList.propTypes = {
	counters: PropTypes.array
	, handleClick: PropTypes.func
};

const mapModelToProps = (json, model) => {
	return {
		count: json.count
		, handleClick: () => {
			model.set('count', json.count + 1);
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
			assert.strictEqual(mountedComponent.find('.counter').text(), '0');
			mountedComponent.find('.counter').simulate('click');
			assert.strictEqual(mountedComponent.find('.counter').text(), '1');
			mountedComponent.find('.counter').simulate('click');
			assert.strictEqual(mountedComponent.find('.counter').text(), '2');
		});
		it('connects the passed component with a Backbone Collection', () => {
			const collection = new Collection([{count: 0}]);
			const mapModelToProps = (json) => ({
				counters: json
				, handleClick: Function.prototype
			});
			const ContainerComponent = connect(mapModelToProps, 'add')(CounterList);
			const mountedComponent = mount(
				<Provider model={collection}>
					<ContainerComponent />
				</Provider>
			);
			assert.strictEqual(mountedComponent.find('.counter').length, 1);
			collection.add({counter: 1});
			assert.strictEqual(mountedComponent.find('.counter').length, 2);
		});
		it('connects the passed component with a model on the component\'s props', () => {
			const model = new Model({count: 0});
			const mountedComponent = mount(
				<ContainerComponent model={model} />
			);
			assert.strictEqual(mountedComponent.find('.counter').text(), '0');
			mountedComponent.find('.counter').simulate('click');
			assert.strictEqual(mountedComponent.find('.counter').text(), '1');
			mountedComponent.find('.counter').simulate('click');
			assert.strictEqual(mountedComponent.find('.counter').text(), '2');
		});
		it('gives access to the container component\'s own props', () => {
			const model = new Model({count: 0});
			const mapModelAndSelfToProps = (json, model, ownProps) => {
				return {
					count: json.count
					, handleClick: () => {
						model.set(
							'count', json.count + ownProps.increment
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
			assert.strictEqual(mountedComponent.find('.counter').text(), '0');
			mountedComponent.find('.counter').simulate('click');
			assert.strictEqual(mountedComponent.find('.counter').text(), '2');
			mountedComponent.find('.counter').simulate('click');
			assert.strictEqual(mountedComponent.find('.counter').text(), '4');
		});
		it('can override the model events that trigger a rerendering', () => {
			const model = new Model({count: 0});
			const CustomComponent = connect(mapModelToProps, 'sync', 'custom')(DumbComponent);
			const mountedComponent = mount(
				<Provider model={model}>
					<CustomComponent />
				</Provider>
			);
			assert.strictEqual(mountedComponent.find('.counter').text(), '0');
			mountedComponent.find('.counter').simulate('click');
			assert.strictEqual(mountedComponent.find('.counter').text(), '0');
			model.trigger('sync');
			assert.strictEqual(mountedComponent.find('.counter').text(), '1');
			mountedComponent.find('.counter').simulate('click');
			assert.strictEqual(mountedComponent.find('.counter').text(), '1');
			model.trigger('custom');
			assert.strictEqual(mountedComponent.find('.counter').text(), '2');
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
		it('uses the model passed in the props when it is passed one both in context and in props', () => {
			const model = new Model({count: 0});
			const innerModel = new Model({count: 47});
			const mountedComponent = mount(
				<Provider model={model}>
					<ContainerComponent model={innerModel} />
				</Provider>
			);
			assert(mountedComponent.text().indexOf('47') > -1);
		});
	});
});
