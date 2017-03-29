import React from 'react';
import { Link } from 'react-router';

export default class LoginReact extends React.Component {
    render() {
        return (
            <div className="main-login show-dialog">
                <form className="content">
                    <div className="contnet-item">
                        <label className="title">Name</label><input />
                    </div>
                    <div className="contnet-item">
                        <label className="title">Password</label><input type="password" />
                    </div>
                    <div className="text-align-center">
                        <Link to="/">Login</Link>
                    </div>
                </form>
            </div>
        );
    }
}