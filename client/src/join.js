import React from 'react';

import * as shared_vars from './shared_vars';

import * as GameThings from './GameThings';

import './css/join.css';


export default class Join extends GameThings.SocketfulComponent {
    constructor() {
        super();
        Object.assign(this.state, {/* ... */});
        this.outerName = "joinContent";

        this.attemptJoin = this.attemptJoin.bind(this);
    };
    componentDidMount() {
        super.componentDidMount(); // first line
        
        this.socket.on('no_such_game', () => {
            document.getElementById("gameKey").value = "";
            this.remove_popUp();
            this.add_popUp({
                title: "No Such Game",
                textLines: ["You've probably mistyped your key. Try again."],
                btn: this.default_btn
            });
        });
        
        this.socket.on('name_taken', () => {
            document.getElementById("pirateName").value = "";
            this.remove_popUp();
            this.add_popUp({
                title: "Name Taken",
                textLines: ["Great minds think alike! (And fools' seldom differ!)",
                            "Someone's taken your name already. Choose another one."],
                btn: this.default_btn
            });
        });
        
        this.socket.on('game_unavailable', () => {
            document.getElementById("gameKey").value = "";
            this.remove_popUp();
            this.add_popUp({
                title: "Game Unavailable",
                textLines: ["Unfortunately for you, this probably means they've started without you. :("],
                btn: this.default_btn
            });
        });
        
        this.socket.on('join_rejected', () => {
            document.getElementById("pirateName").value = "";
            document.getElementById("gameKey").value = "";
            this.remove_popUp();
            this.add_popUp({
                title: "Join Rejected",
                textLines: ["You have not been allowed to join that game (yet). Maybe they don't like your Pirate Name? Or, maybe they can't stand how you always beat them!"],
                btn: this.default_btn
            });
        });
        
        this.socket.on('prepare_board', () => {
            this.remove_popUp();
            this.setState({stage: 1});
        });
        
        this.setState({stage: 0}); // last line
    };
    // add back componentWillUnmount in unlikely event that stage must be reset
    render_helper(data, stage) {
        switch (stage) {
            default: return null;
            case 0: return <div>
                <div className="inputsDiv">
                    <h2 id="nameH2">{data.nameQ}</h2>
                    <input type="text" id="pirateName" maxLength="172" />
                    <h2>{data.gameQ}</h2>
                    <input type="text" id="gameKey" maxLength="6" />
                </div>
                <button id="join" onClick={this.attemptJoin}>Join</button>
            </div>;
            case 1: return "GAME STARTED!";
        };
    };
    attemptJoin() {
        const name = document.getElementById("pirateName").value;
        const key = document.getElementById("gameKey").value.toLowerCase(); // ignore uppercase'ness
        this.remove_popUp();
        if (!shared_vars.wsPattern.test(name)) {
            if (shared_vars.keyPattern.test(key)) {
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
