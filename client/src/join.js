import React from 'react';

import io from 'socket.io-client';

import * as shared_vars from './shared_vars';

import * as GameThings from './GameThings';

import './css/join.css';

export default class Join extends shared_vars.ThemeDependentComponent {
    constructor() {
        super();
        Object.assign(this.state, {stage: -1, popUps: new GameThings.PopUps_data()});
        
        this.attemptJoin = this.attemptJoin.bind(this);
    };
    componentDidMount() {
        super.componentDidMount(); // first line
        
        this.socket = io();
        
        this.setState({content: null}); // last line
    };
    componentWillUnmount() {
        super.componentWillUnmount(); // first line
        
        // resetting this.state.stage is unnecessary (I think)
        // do NOT call this.setState; set normally
        
        if (this.socket.connected) this.socket.disconnect();
    };
    render() {
        let content = shared_vars.defaultLoading;
        const data = this.state.data;
        if (data) {
            switch (this.stage) {

                // case -1: do nothing

                case 0: content = <div>
                    <div className="inputsDiv">
                        <h2 id="nameH2">{data.nameQ}</h2>
                        <input type="text" id="pirateName" maxLength="172" />
                        <h2>{data.gameQ}</h2>
                        <input type="text" id="gameKey" maxLength="6" />
                    </div>
                    <button id="join" onClick={this.attemptJoin}>Join</button>
                </div>; break;

                case 1: /* content = null; */ break;

                case 2: /* content = null; */ break;

                case 3: /* content = null; */ break;

            };
        };
        return <React.Fragment>
            <div id="joinContent">{content}</div>
            <GameThings.PopUps popUps={this.state.popUps} />
        </React.Fragment>;
    };
    attemptJoin() {
        const name = document.getElementById("pirateName").value;
        const key = document.getElementById("gameKey").value;
        if (namePattern.test(name) && !exclPattern.test(name)) {
            if (keyPattern.test(key)) {
                // clear popUps
                // display waiting
                this.socket.emit('attempt_join', name, key);
                this.name = name;
            } else {
                hidePopUps();
                // clear popUps
                // display invalid key
            };
        } else {
            // clear popUps
            // display invalid name
        };
    };
};
