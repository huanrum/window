import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import LoginReact from './Login.jsx';
import AboutReact from './About.jsx';
import MainReact from './Main.jsx';
import Book from './modules/Book.jsx';
import Food from './modules/Food.jsx';
import Sport from './modules/Sport.jsx';

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/login" component={LoginReact}/>
        <Route path="/about" component={AboutReact}/>
        <Route path="/" title="Home" component={MainReact}>
            <Route path="/food" title="Food" component={Food}/>
            <Route path="/sport" title="Sport" component={Sport}/>
            <Route path="/book" title="Book" component={Book}/>
        </Route>
    </Router>
), document.body);