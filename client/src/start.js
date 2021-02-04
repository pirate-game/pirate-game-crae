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
            this.socket.emit('remove_player', player);
            this.setState(state => {
                state.allPlayers.removeIndex(index);
                return state;
            });
        };
        
        this.assembleCrew = this.assembleCrew.bind(this);
        this.prepare_boards = this.prepare_boards.bind(this);
    };
    componentDidMount() {
        super.componentDidMount(); // first line
        
        this.socket.on('key', key => this.setState({gameKey: key}));
        
        this.socket.on('request_join', name => {
            this.setState(state => {
                state.allPlayers.push(name);
                return state;
            });
        });
        
        this.socket.on('show_provisional_crew', () => this.push_popUp(
            <div id="crewAssembledPopUp" className="popUp"><div>
                    <h3>{this.state.data.playersName} Assembled</h3>
                    <hr />
                    <div>
                        <p style={{display: 'inline-block', width: 'calc(100% - 190px)'}}>Those currently in the game are below. You can remove them with the crosses.</p>
                        <div style={{display: 'inline-block'}}>
                            <button className="niceButton" onClick={this.prepare_boards}>Start<br />Game</button>
                            <button className="niceButton" onClick={()=>{this.socket.emit('change_crew'); this.remove_popUp();}}>Change<br />{this.state.data.playersName}</button>
                        </div>
                    </div>
                    <GameThings.NiceList elems={this.state.allPlayers} callback={this.crossCallback} style={{maxHeight: 'calc(100vh - 400px)'}} />
            </div></div>, true) // optional true removes the previouse popups i.e. the waiting popup
        );
        
        // this.socket.on(...)...;
        
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
            case 1: return "Preparing boards!";
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
    assembleCrew() {
        this.setState(state => {
            state.popUps.clear();
            if (state.allPlayers.elems.length >= 2) {
                state.popUps.push(GameThings.waitingPopUp);
                this.socket.emit('crew_assembled');
            } else {
                this.add_TooFewPopUp(state);
            };
        });
    };
    prepare_boards() {
        this.setState(state => {
            state.popUps.clear();
            if (state.allPlayers.elems.length >= 2) {
                this.socket.emit('prepare_boards');
                state.stage = 1;
            } else {
                this.add_TooFewPopUp(state);
            };
        });
    };
};

function KeyBox(props) {
    return <div className="niceBox" style={{backgroundColor: 'lightblue', float: 'right'}}>
        <h2> Key: {props.gameKey} </h2>
    </div>;
};

