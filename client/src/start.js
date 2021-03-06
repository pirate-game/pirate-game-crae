import React from 'react';

import * as shared_vars from './shared_vars';

import * as GameThings from './GameThings';

import './css/start.css';



export default class Start extends GameThings.SocketfulComponent {
    constructor() {
        super();
        Object.assign(this.state, {gameKey: null});
        this.outerName = "startContent";
        
        this.crossCallback = (player, index) => {
            this.socket.emit('remove_player', this.state.gameKey, player);
            this.setState(state => {
                state.allPlayers.removeIndex(index);
                return state;
            });
        };
        
        this.assembleCrew = this.assembleCrew.bind(this);
        this.prepare_boards = this.prepare_boards.bind(this);
        this.stage1done = this.stage1done.bind(this);
        this.nextSquare = this.nextSquare.bind(this);
        this.doNextSquare = this.doNextSquare.bind(this);
        this.tooSlowToChoose = this.tooSlowToChoose.bind(this);
    };
    componentDidMount() {
        super.componentDidMount(); // first line
        
        // Stage 0:
        
        this.socket.on('key', key => this.setState({gameKey: key}));
        
        this.socket.on('request_join', name => {
            this.setState(state => {
                state.allPlayers.push(name);
                return state;
            });
        });
        
        this.socket.on('show_provisional_crew', () => this.push_popUp(
            <div className="popUp crewAssembledPopUp"><div>
                    <h3>{this.state.data.playersName} Assembled</h3>
                    <hr />
                    <div>
                        <p style={{display: 'inline-block', width: 'calc(100% - 190px)'}}>Those currently in the game are below. You can remove them with the crosses.</p>
                        <div style={{display: 'inline-block'}}>
                            <button className="niceButton" onClick={this.prepare_boards}>Start<br />Game</button>
                            <button className="niceButton" onClick={()=>{this.socket.emit('change_crew', this.state.gameKey); this.remove_popUp();}}>Change<br />{this.state.data.playersName}</button>
                        </div>
                    </div>
                    <GameThings.NiceList elems={this.state.allPlayers} callback={this.crossCallback} style={{maxHeight: 'calc(100vh - 400px)'}} />
            </div></div>, true) // optional true removes the previous popups i.e. the waiting popup
        );
        
        // Stage 1:
        
        this.socket.on('board_ready', player => {
            this.setState(state => {
                state.readyPlayers.push(player);
                state.unreadyPlayers.remove(player);
                return state;
            });
        });

        // Stage 2:
        
        // Stage 3:
        
        
        
        this.setState({stage: 0, allPlayers: new GameThings.List_data()}); // last lines
        
        this.socket.emit('request_key');
    };
    // add back componentWillUnmount in unlikely event that stage must be reset
    render_helper(data, stage) {
        switch (stage) {
                
            default: return null;
                
            case 0: return <div style={{position: 'relative', minHeight: 'calc(100vh - 230px)'}}>
                <div style={{position: 'relative', top: '-10%'}}>
                    <button className="niceButton buttonAtRight" onClick={this.assembleCrew}>{data.playersName} Assembled!</button>
                    <KeyBox gameKey={this.state.gameKey} />
                </div>
                <h2 style={{fontSize: '50px', margin: '0px', marginLeft: '10px'}}>{data.playersName}:</h2>
                <GameThings.NiceList elems={this.state.allPlayers} callback={this.crossCallback} style={{position: 'absolute', left: '10px', right: '10px', top: '60px'}} />
            </div>;

            case 1: return <React.Fragment>
                <div className="niceBox">
                    <h2 style={{fontSize: '30px', padding: '10px'}}>Fill in your boards</h2>
                </div>
                <button className="niceButton buttonAtRight" onClick={this.stage1done}>Done</button>
                <div>
                    <div className="stage1col" style={{left: '10px'}}>
                        <h2>Waiting for:</h2>
                        <GameThings.NiceList elems={this.state.unreadyPlayers} style={{height: 'calc(100vh - 290px)'}} />
                    </div>
                    <div className="stage1col" style={{right: '10px'}}>
                        <h2>Ready:</h2>
                        <GameThings.NiceList elems={this.state.readyPlayers} style={{height: 'calc(100vh - 290px)'}} />
                    </div>
                </div>
            </React.Fragment>;

            case 2: return <React.Fragment>
                <GameThings.DoneBoard remaining={this.state.remainingSquares} />
            </React.Fragment>;

        };
    };
    add_TooFewPopUp(state) {
        const data = state.data;
        state.popUps.addPopUp({
            title: "Too Few " + data.playersName,
            textLines: data.tooFewTextLines,
            btn: this.default_btn
        });
        return this;
    };
    add_TooFewReadyPopUp(state) {
        const data = state.data;
        state.popUps.addPopUp({
            title: "Too Few " + data.playersName + " Ready",
            textLines: data.tooFewReadyTextLines,
            btn: this.default_btn
        });
        return this;
    };
    add_WaitForChoosePopUp(state) {
        state.popUps.addPopUp({
            title: "Waiting For Next Square to be Chosen",
            textLines: ["This won't take too long, I hope!"],
            btn: this.tooSlowToChoose
        });
        return this;
    };
    assembleCrew() {
        this.setState(state => {
            state.popUps.clear();
            if (state.allPlayers.elems.length >= 2) {
                state.popUps.push(GameThings.waitingPopUp);
                this.socket.emit('crew_assembled', this.state.gameKey);
            } else {
                this.add_TooFewPopUp(state);
            };
            return state;
        });
    };
    prepare_boards() {
        this.setState(state => {
            state.popUps.clear();
            if (state.allPlayers.elems.length >= 2) {
                this.socket.emit('prepare_boards', this.state.gameKey);
                state.unreadyPlayers = state.allPlayers.clone();
                state.readyPlayers = new GameThings.List_data();
                state.stage = 1;
            } else {
                this.add_TooFewPopUp(state);
            };
            return state;
        });
    };
    stage1done() {
        this.setState(state => {
            state.popUps.clear();
            if (state.readyPlayers.elems.length >= 2) {
                this.socket.emit('too_slow', this.state.gameKey, state.unreadyPlayers.elems);
                state.stage = 2;
                state.allPlayers = state.readyPlayers.clone();
                state.unreadyPlayers = new GameThings.List_data();
                state.remainingSquares = GameThings.allSquares.slice();
                state.readyToChoose = new GameThings.List_data([], false); // false => add to back
                state.currentSquare = "??";
                this.nextSquare();
            } else {
                this.add_TooFewReadyPopUp(state);
            };
            return state;
        });
    };
    nextSquare() {
        this.setState(state => {
            if (state.readyPlayers.elems.length >= 2) {
                if (state.unreadyPlayers.elems.length == 0) {
                    this.doNextSqaure();
                } else {
                    this.push_popUp(
                        <div className="popUp crewAssembledPopUp"><div>
                            <h3>Confirm Next Square</h3>
                            <hr />
                            <div>
                                <p style={{display: 'inline-block', width: 'calc(100% - 190px)'}}>Those below are not ready and will be dropped from the game.</p>
                                <div style={{display: 'inline-block'}}>
                                    <button className="niceButton" onClick={this.doNextSquare}>Okay!</button>
                                    <button className="niceButton" onClick={this.remove_popUp}>Wait!</button>
                                </div>
                            </div>
                            <GameThings.NiceList elems={state.unreadyPlayers} style={{maxHeight: 'calc(100vh - 400px)'}} />
                    </div></div>, true);
                };
            } else {
                this.add_TooFewReadyPopUp(state);
            };
            return state;
        });
    };
    doNextSquare() {
        this.setState(state => {
            this.remove_popUp();
            this.socket.emit('too_slow', this.state.gameKey, state.unreadyPlayers.elems);
            state.allPlayers.elems.filter(e => !state.unreadyPlayers.elems.includes(e));
            state.unreadyPlayers.elems = [];
            state.readyPlayers = state.allPlayers.clone();
            if (this.state.readyToChoose.is_empty()) {
                const index = Math.floor(Math.random() * state.remainingSquares.length);
                state.currentSquare = state.remainingSquares.splice(index, 1)[0];
                // pops from the index
                this.socket.emit('current_square', state.gameKey, state.currentSquare);
            } else {
                state.toChoose = state.readyToChoose.pop();
                this.socket.emit('ask_to_choose', state.gameKey, state.toChoose);
                this.add_WaitForChoosePopUp(state);
            };
            return state;
        });
    };
    tooSlowToChoose() {
        this.setState(state => {
            if (state.allPlayers.elems.length > 2) {
                shared_vars.removeFirstOccurrenceIn(state.toChoose, state.allPlayers);
                shared_vars.removeFirstOccurrenceIn(state.toChoose, state.readyPlayers);
                this.socket.emit('too_slow', state.gameKey, [state.toChoose]);
                this.doNextSquare();
            } else {
                this.add_TooFewReadyPopUp(state);
            };
            return state;
        });
    };
};

function KeyBox(props) {
    return <div className="niceBox" style={{backgroundColor: 'lightblue', float: 'right'}}>
        <h2> Key: {props.gameKey} </h2>
    </div>;
};
