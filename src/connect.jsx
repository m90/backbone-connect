import React, {Component, PropTypes} from 'react';
import {Model, Collection} from 'backbone';

const connect = (mapModelToProps, ...renderEvents) => {
	const eventString = renderEvents.length
		? renderEvents.join(' ')
		: 'change';
	return (ComposedComponent) => {
		class ContainerComponent extends Component{
			constructor(props, context, ...rest){
				if (!context.model && !props.model){
					throw new Error(
						`Could not find "model" in either the context or props of "${ComposedComponent.displayName}".`
					);
				}
				super(props, context, ...rest);
				this.model = this.props.model || this.context.model;
				this.model.on(eventString, () => this.forceUpdate());
			}
			componentWillUnmount(){
				this.model.off(eventString);
			}
			render(){
				const mappedProps = mapModelToProps(this.model, this.props);
				return (
					<ComposedComponent {...mappedProps} />
				);
			}
		}
		ContainerComponent.contextTypes = {
			model: PropTypes.oneOfType([
				PropTypes.instanceOf(Model)
				, PropTypes.instanceOf(Collection)
			])
		};
		ContainerComponent.propTypes = {
			model: PropTypes.oneOfType([
				PropTypes.instanceOf(Model)
				, PropTypes.instanceOf(Collection)
			])
		};
		ContainerComponent.displayName = `backboneConnect(${eventString})(${ComposedComponent.displayName})`;
		return ContainerComponent;
	};
};

export default connect;
