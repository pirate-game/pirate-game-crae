import React from 'react';

import io from 'socket.io-client';

import * as shared_vars from './shared_vars';

import * as GameThings from './GameThings';

import './css/join.css';


const wsPattern  = /^\s*$/; // any number of whitespace characters
const keyPattern = /^[0-9a-f]{6}$/; // six characters 0 to 9 or a to f
const squarePattern = /^[A-G][1-7]$/; // a character A to G, followed by a digit 1 to 7


export default class Join extends shared_vars.ThemeDependentComponent {
    constructor() {
        super();
        Object.assign(this.state, {stage: -1, popUps: new GameThings.PopUps_data()});
        
        this.push_popUp = p => this.setState(state => {
            state.popUps.push(p);
            return state;
        });
        
        this.add_popUp = p => this.setState(state => {
            state.popUps.addPopUp(p);
            return state;
        });
        
        this.remove_popUp = () => this.setState(state => {
            state.popUps.pop();
            return state;
        });
        
        this.default_btn = {
            text: "Okay!",
            onClick: this.remove_popUp
        };
        
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
        const key = document.getElementById("gameKey").value.toLowerCase(); // ignore uppercase'ness
        this.remove_popUp();
        if (!wsPattern.test(name)) {
            if (keyPattern.test(key)) {
                this.push_popUp(GameThings.waitingPopUp);
                this.socket.emit('attempt_join', name, key);
                this.name = name;
            } else {
                this.add_popUp({
                    title: "Invalid Key",
                    textLines: ['Please correctly type the key you have been given. It should be 6 hexadecimal digits e.g. "face42".'],
                    btn: this.default_btn
                });
            };
        } else {
            this.add_popUp({
                    title: "Invalid Name",
                    textLines: ["Maybe put some non-whitespace characters in your name?", "Maybe?"],
                    btn: this.default_btn
                });
        };
    };
};
