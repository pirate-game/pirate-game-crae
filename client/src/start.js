import React from 'react';

import * as shared_vars from './shared_vars';

import * as GameThings from './GameThings';

import './css/start.css';



export default class Start extends GameThings.SocketfulComponent {
    constructor() {
        super();
        Object.assign(this.state, {key: null});
        this.outerName = "startContent";
        
        this.assembleCrew = this.assembleCrew.bind(this);
        this.prepare_boards = this.prepare_boards.bind(this);
    };
    componentDidMount() {
        super.componentDidMount(); // first line
        
        this.socket.on('key', msg => { this.setState(state => { state.key = msg; console.log("in callback"); }); console.log(msg); });
        
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
                            <button onClick={this.prepare_boards}>Start<br />Game</button>
                            <button onClick={()=>{this.socket.emit('change_crew'); this.remove_popUp();}}>Change<br />{this.state.data.playersName}</button>
                        </div>
                    </div>
                    <GameThings.NiceList elems={this.state.allPlayers} callback={this.crossCallback} style={{maxHeight: 'calc(100vh - 400px)'}} />
            </div></div>
        ));
        
        // this.socket.on(...)...;
        
        this.setState({stage: 0, allPlayers: new GameThings.List_data()}); // last lines
        
        this.socket.emit('request_key');
    };
    // add back componentWillUnmount in unlikely event that stage must be reset
    render_helper(data, stage) {
        console.log("rendering");
        switch (stage) {
            default: return null;
            case 0: return <div style={{position: 'relative', minHeight: 'calc(100vh - 230px)'}}>
                <div style={{position: 'relative', top: '-10%'}}>
                    <button id="crewAssembled" onClick={this.assembleCrew}>{data.playersName} Assembled!</button>
                    <KeyBox key={this.state.key} />
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
    return <div id="keyBox" style={{backgroundColor: 'lightblue'}}>
        <h2> Key: {props.key} </h2>
    </div>;
};

