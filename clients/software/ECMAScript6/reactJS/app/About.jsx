import React from 'react';
import { Link } from 'react-router';

export default class AboutReact extends React.Component {
    render() {
        return (
            <div className="main-about">
                <div>About</div>
                <Link to="/">Go</Link>
            </div>
        );
    }
}