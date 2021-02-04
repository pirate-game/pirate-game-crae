import React from 'react';

import * as shared_vars from './shared_vars';

import * as GameThings from './GameThings';

import './css/watch.css';


export default class Watch extends GameThings.SocketfulComponent {
    constructor() {
        super();
        Object.assign(this.state, {/* ... */});
        this.outerName = "watchContent";
        
        this.attemptWatch = this.attemptWatch.bind(this);
    };
    componentDidMount() {
        super.componentDidMount(); // first line
        
        this.socket.on('no_such_game', () => {
            document.getElementById("gameKey").value = "";
            this.add_popUp({
                title: "No Such Game",
                textLines: ["You've probably mistyped your key. Try again."],
                btn: this.default_btn
            }, true); // true removes any previous
        });
        
        this.socket.on('start_game', () => {
            this.remove_popUp();
            this.setState({stage: 2}); // there is no stage 1 for Watch
        });
        
        this.setState({stage: 0}); // last line
    };
    // add back componentWillUnmount in unlikely event that stage must be reset
    render_helper(data, stage) {
        switch (stage) {
            default: return null;
            case 0: return <div>
                <h2 id="watchQ" style={{marginTop: 0}}>{data.watchQ}</h2>
                <input type="text" id="gameKey" maxLength="6" />
                <button className="niceButton" onClick={this.attemptWatch}>Watch</button>
            </div>;
            case 2: return "GAME STARTED!";
        };
    };
    attemptWatch() {
        const key = document.getElementById("gameKey").value;
        if (shared_vars.keyPattern.test(key)) {
            this.push_popUp(GameThings.waitingPopUp, true); // true removes any previous
            this.socket.emit('attempt_watch', key);
        } else {
            this.add_popUp({
                title: "Invalid Key",
                textLines: ['Please correctly type the key you have been given. It should be 6 hexadecimal digits e.g. "face42".'],
                btn: this.default_btn
            }, true); // true removes any previous
        };
    };
};
