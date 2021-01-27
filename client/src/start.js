import React from 'react';

import io from 'socket.io-client';

import * as shared_vars from './shared_vars';

import * as GameThings from './GameThings';

import './css/start.css';



export default class Start extends shared_vars.ThemeDependentComponent {
    constructor() {
        super();
        Object.assign(this.state, {stage: -1, key: null, popUps: new GameThings.PopUps_data()});
        
        this.crossCallback = p => {
            this.setState(state => {
                state.allPlayers.remove(p);
                return state;
            });
            this.socket.emit('remove_player', p);
        };
        this.remove_popUp = () => this.setState(state => state.popUps.pop());
        
        this.assembleCrew = this.assembleCrew.bind(this);
    };
    componentDidMount() {
        super.componentDidMount(); // first line
        
        this.socket = io();
        
        this.socket.on('key', msg => this.setState({key: msg}));
        
        this.socket.on('request_join', name => {
            this.setState(state => {
                state.allPlayers.push(name);
                return state;
            });
        });
        
        this.socket.on('show_provisional_crew', () => {
            this.setState(state => state.popUps.push(<div id="crewAssembledPopUp" className="popUp"><div>
                    <h3>{this.state.data.playersName} Assembled</h3>
                    <hr />
                    <div>
                        <p style={{display: 'inline-block', width: 'calc(100% - 190px)'}}>Those currently in the game are below. You can remove them with the crosses.</p>
                        <div style={{display: 'inline-block'}}>
                            <button onClick={()=>console.log("start game")}>Start<br />Game</button>
                            <button onClick={()=>{this.socket.emit('change_crew'); this.remove_popUp();}}>Change<br />{this.state.data.playersName}</button>
                        </div>
                    </div>
                    <GameThings.NiceList elems={this.state.allPlayers} callback={this.crossCallback} style={{maxHeight: 'calc(100vh - 400px)'}} />
        </div></div>}));
        
        // this.socket.on(...)...;
        
        this.setState({stage: 0, allPlayers: new GameThings.List_data()}); // last lines
        
        this.socket.emit('request_key');
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

                case 0: content = <div style={{position: 'relative', minHeight: 'calc(100vh - 230px)'}}>
                    <div style={{position: 'relative', top: '-10%'}}>
                        <button id="crewAssembled" onClick={this.assembleCrew}>{data.playersName} Assembled!</button>
                        <KeyBox key={this.state.key} />
                    </div>
                    <h2 style={{fontSize: '50px', margin: '0px', marginLeft: '10px'}}>{data.playersName}:</h2>
                    <GameThings.NiceList elems={this.state.allPlayers} callback={this.crossCallback} style={{position: 'absolute', left: '10px', right: '10px', top: '60px'}} />
                </div>; break;

                case 1: /* content = null; */ break;

                case 2: /* content = null; */ break;

                case 3: /* content = null; */ break;

            };
        };
        return <React.Fragment>
            <div id="startContent">{content}</div>
            <GameThings.PopUps popUps={this.state.popUps} />
        </React.Fragment>;
    };
    assembleCrew() {
        this.setState(state => {
            state.popUps.clear();
            if (state.allPlayers.elems.length >= 2) {
                state.popUps.push(GameThings.waitingPopUp);
                this.socket.emit('crew_assembled');
            } else {
                state.popUps.addPopUp({
                    title: "Too Few Crewmembers",
                    textLines: ["Yarr, ye be needin' at least 2 players."],
                    btn: {
                        text: "Okay!",
                        onClick: this.remove_popUp
                    }
                });
            };
        });
    };
};

function KeyBox(props) {
    return <div id="keyBox" style={{backgroundColor: 'lightblue'}}>
        <h2> Key: {props.key} </h2>
    </div>;
};

