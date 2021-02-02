import React from 'react';

import * as shared_vars from './shared_vars';

import * as GameThings from './GameThings';

import './css/watch.css';


export default class Watch extends GameThings.SocketfulComponent {
    constructor() {
        super();
        Object.assign(this.state, {/* ... */});
        this.outerName = "watchContent";
    };
    componentDidMount() {
        super.componentDidMount(); // first line
        
        // this.socket.on(...)...;
        
        this.setState({stage: 0}); // last line
    };
    // add back componentWillUnmount in unlikely event that stage must be reset
    render_helper(data, stage) {
        switch (stage) {
            default: return null;
            case 0: return "Watch content!";
        };
    };
};
