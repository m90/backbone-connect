import {Component, PropTypes, Children} from 'react';
import {Model, Collection} from 'backbone';

class Provider extends Component{
	constructor(...args){
		super(...args);
		this.model = this.props.model;
	}
	getChildContext(){
		return {
			model: this.model
		};
	}
	render(){
		return Children.only(this.props.children);
	}
}
Provider.propTypes = {
	children: PropTypes.any
	, model: PropTypes.oneOfType([
		PropTypes.instanceOf(Model)
		, PropTypes.instanceOf(Collection)
	])
};
Provider.childContextTypes = {
	model: PropTypes.oneOfType([
		PropTypes.instanceOf(Model)
		, PropTypes.instanceOf(Collection)
	])
};

export default Provider;
