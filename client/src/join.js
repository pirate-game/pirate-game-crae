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
        this.squareClicked = this.squareClicked.bind(this);
        this.fillItMyself = this.fillItMyself.bind(this);
        this.fillRandomly = this.fillRandomly.bind(this);
    };
    componentDidMount() {
        super.componentDidMount(); // first line
        
        // Stage 0:
        
        this.socket.on('no_such_game', () => {
            document.getElementById("gameKey").value = "";
            this.add_popUp({
                title: "No Such Game",
                textLines: ["You've probably mistyped your key. Try again."],
                btn: this.default_btn
            }, true); // true removes any previous
        });
        
        this.socket.on('name_taken', () => {
            document.getElementById("pirateName").value = "";
            this.add_popUp({
                title: "Name Taken",
                textLines: ["Great minds think alike! (And fools' seldom differ!)",
                            "Someone's taken your name already. Choose another one."],
                btn: this.default_btn
            }, true); // true removes any previous
        });
        
        this.socket.on('game_unavailable', () => {
            document.getElementById("gameKey").value = "";
            this.add_popUp({
                title: "Game Unavailable",
                textLines: ["Unfortunately for you, this probably means they've started without you. :("],
                btn: this.default_btn
            }, true); // true removes any previous
        });
        
        this.socket.on('join_rejected', () => {
            document.getElementById("pirateName").value = "";
            document.getElementById("gameKey").value = "";
            this.add_popUp({
                title: "Join Rejected",
                textLines: ["You have not been allowed to join that game (yet). Maybe they don't like your Pirate Name? Or, maybe they can't stand how you always beat them!"],
                btn: this.default_btn
            }, true); // true removes any previous
        });
        
        this.socket.on('prepare_board', () => {
            this.remove_popUp();
            this.setState({board: {}, doneSquares: [], stage: 1});
        });
        
        // Stage 1:
        
        
        
        
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
                <button id="join" className="niceButton" onClick={this.attemptJoin}>Join</button>
            </div>;
            case 1: return <React.Fragment>
                <GameThings.SymbolBoard callback={this.squareClicked}
                    board={this.state.board}
                    done={this.state.doneSquares}
                    data={data} />
                <div id="fillInBoard" className="stage1PopUp">
                    <h3>Fill in the Board</h3>
                    <hr />
                    <p>Would you like to fill in your Board yourself, or have it done for you, randomly?</p>
                    <button className="niceButton" id="leftBtn" onClick={this.fillItMyself}>Fill&nbsp;it<br />Myself</button>
                    <button className="niceButton" id="rightBtn" onClick={this.fillRandomly}>Randomly</button>
                </div>
            </React.Fragment>;
            case 2: return <React.Fragment>
                <GameThings.SymbolBoard callback={this.squareClicked}
                    board={this.state.board}
                    done={this.state.doneSquares}
                    data={data} />
                <p>STAGE 2</p>
            </React.Fragment>;
        };
    };
    attemptJoin() {
        const name = document.getElementById("pirateName").value;
        const key = document.getElementById("gameKey").value.toLowerCase(); // ignore uppercase'ness
        if (!shared_vars.wsPattern.test(name)) {
            if (shared_vars.keyPattern.test(key)) {
                this.push_popUp(GameThings.waitingPopUp, true); // true removes any previous
                this.name = name;
                this.gameKey = key;
                this.socket.emit('attempt_join', key, name);
            } else {
                this.add_popUp({
                    title: "Invalid Key",
                    textLines: ['Please correctly type the key you have been given. It should be 6 hexadecimal digits e.g. "face42".'],
                    btn: this.default_btn
                }, true); // true removes any previous
            };
        } else {
            this.add_popUp({
                title: "Invalid Name",
                textLines: ["Maybe put some non-whitespace characters in your name?", "Maybe?"],
                btn: this.default_btn
            }, true); // true removes any previous
        };
    };
    fillItMyself() {
        // ...
        this.boardReady();
    };
    fillRandomly() {
        // ...
        this.boardReady();
    };
    boardReady() {
        this.setState(state => {
            this.socket.emit('board_ready', this.gameKey, this.name);
            state.stage = 2;
            return state;
        });
    };
    squareClicked(square) {
        // test
        this.setState(state => {
            this.state.doneSquares.push("A1");
            this.state.board["B4"] = "goToZero";
            this.socket.emit('board_ready', this.gameKey, this.name);
            return state;
        });
    };
};
