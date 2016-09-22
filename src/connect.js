import React, {Component, PropTypes} from 'react';
import {Model, Collection} from 'backbone';

const connect = (mapModelToProps, ...renderEvents) => {
	return (ComposedComponent) => {
		const displayName = ComposedComponent.displayName || 'Component';
		class ContainerComponent extends Component{
			constructor(props, context, ...rest){
				if (!context.model && !props.model){
					throw new Error(
						`Could not find "model" in either the context or props of "${displayName}".`
					);
				}
				super(props, context, ...rest);
				this.model = this.props.model || this.context.model;
				this.eventString = renderEvents.length
					? renderEvents.join(' ')
					: this.model instanceof Collection
						? 'change update'
						: 'change';
				this.model.on(this.eventString, () => this.forceUpdate());
			}
			componentWillUnmount(){
				this.model.off(this.eventString);
			}
			render(){
				const mappedProps = mapModelToProps(
					this.model.toJSON()
					, this.model
					, this.props
				);
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
		ContainerComponent.displayName = `BackboneConnect(${displayName})`;
		return ContainerComponent;
	};
};

export default connect;
