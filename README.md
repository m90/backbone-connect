# backbone-connect

[![Build Status](https://travis-ci.org/m90/backbone-connect.svg?branch=master)](https://travis-ci.org/m90/backbone-connect)

> react-redux inspired Backbone.js/React bindings

### Installation from npm

```sh
$ npm install backbone-connect
```

### Usage

This module tries to mimic the behavior of `react-redux` (minus the redux store) so it might be a good idea to start with reading [its documentation](http://redux.js.org/docs/basics/UsageWithReact.html) to gain understanding of how separating presentational and container components works.

### API

#### `<Provider />`

The `<Provider />` component lets you inject a Backbone Model or Collection into your component tree:

```jsx
import {Provider} from 'backbone-connect';
import {SomeContainerComponent, SomeOtherContainerComponent} from './components';
import {AppModel} from './models';

const model = new AppModel();

export const TopLevelComponent = () => (
    <Provider model={model}>
        <SomeContainerComponent />
        <SomeOtherContainerComponent />
    </Provider>
);
```
It is important to note that no matter if you pass a Backbone Collection or a Backbone Model to the `Provider` you will always need to attach it to the `model` prop.

#### `connect(mapModelToProps, ...renderEvents)`

`connect` lets you define the relationship between the Model in your components' context and its props by passing a `mapModelToProps` function:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {Model} from 'backbone';
import {connect, Provider} from 'backbone-connect';

const Presenter = ({
    counter
    , handleClick
}) => (
    <div>
        <p>{counter}</p>
        <button onClick={handleClick}>Increase</button>
    </div>
);

const mapModelToProps = (json, model) => ({
    counter: json.counter
    , handleClick(){
        model.set('counter', json.counter);
    }
});

const ContainerComponent = connect(mapModelToProps)(Presenter);
const model = new Model({counter: 1});

const ParentComponent = () => (
    <Provider model={model}>
        <ContainerComponent />
    </Provider>
);

ReactDOM.render(<ParentComponent />, document.querySelector('#host'));
```

`mapModelToProps` receives following arguments:

1. `toJSON()` version of the Model
2. the Model/Collection itself
3. the container component's own props

```jsx
const mapModelToProps = (json, model, ownProps) => ({
    headline: ownProps.headline
    , counter: json.counter
    , increaseCounter(){
        model.set('counter', json.counter + 1);
    }
});
```

By default `connect` listens to `change` events for a Model or `change update` for a Collection. In case you need different behavior you can pass an arbitrary list of event names when calling the function. Each of these events will then trigger a re-evaluation:

```jsx
const ContainerComponent = connect(mapModelToProps, 'sync', 'remove', 'customevent')(Presenter);
```

### License
MIT © [Frederik Ring](http://www.frederikring.com)
