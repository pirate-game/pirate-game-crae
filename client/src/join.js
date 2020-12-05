import React from 'react';

import io from 'socket.io-client';

import * as shared_vars from './shared_vars';

import * as GameThings from './GameThings';

let theJoin = null;

export default class Join extends React.Component {
    constructor() {
        super();
        
        this.state = {content: null};
    };
    componentDidMount() {
        theJoin = this;
        
        this.socket = io();
        
        this.setState({content: null}); // last line
    };
    componentWillUnmount() {        
        
        if (this.socket.connected) this.socket.disconnect();
        
    };
    render() {
        return <p>Join Content</p>;
    };
};
