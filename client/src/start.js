import React from 'react';

import io from 'socket.io-client';

import * as shared_vars from './shared_vars';

import * as GameThings from './GameThings';

import './css/start.css';

class KeyBox extends React.Component {
    constructor() {
        super();
        this.state = {key: ''};
        // theStart.socket.on('key', msg => this.setState({key: msg})); // theStart.socket is guaranteed to exist by now
        theStart.socket.on('key', msg => {this.setState({key: msg}); console.log(theStart.state.content); theStart.state.content.state.crewList.push("hello");});
    };
    render() {
        return <div id="keyBox" style={{backgroundColor: 'lightblue'}}>
            <h2> Key: {this.state.key} </h2>
        </div>;
    };
};

class AssembleCrew extends shared_vars.ThemeDependentComponent {
    constructor() {
        super();
        this.state.crewList = <GameThings.ListWithCrosses callback={e => this.state.crewList.remove(e) /*replace with extra bits*/} style={{position: 'absolute', left: '10px', right: '10px', top: '60px'}} />;
        this.state.keybox = <KeyBox />;
    };
    render() {
        const data = this.state.data;
        if (data) {
            return <div style={{position: 'relative', minHeight: 'calc(100vh - 230px)'}}>
                <div style={{position: 'relative',top: '-10%'}}>
                    <button id="crewAssembled" onClick={() => "assemble crew"}>Crew Assembled!</button>
                    {this.state.keybox}
                </div>
                <h2 style={{fontSize: '50px', margin: '0px', marginLeft: '10px'}}>Crew:</h2>
                {this.state.crewList}
            </div>;
        } else {
            return shared_vars.defaultLoading;
        };
    };
};

let theStart = null;

export default class Start extends React.Component {
    constructor() {
        super();
        
        this.state = {content: null};
    };
    componentDidMount() {
        
        theStart = this;
        
        this.popUps = <GameThings.PopUps />;
        
        this.allCrew = [];
        this.unreadyCrew = [];
        this.toChoose = null;
        this.round = 0;
        this.remainingSquares = ["A1","A2","A3","A4","A5","A6","A7",
               "B1","B2","B3","B4","B5","B6","B7",
               "C1","C2","C3","C4","C5","C6","C7",
               "D1","D2","D3","D4","D5","D6","D7",
               "E1","E2","E3","E4","E5","E6","E7",
               "F1","F2","F3","F4","F5","F6","F7",
               "G1","G2","G3","G4","G5","G6","G7"];
        
        this.socket = io();
        
        this.socket.on('player_gone', player => {/*
            hidePopUps();
            document.getElementById("playerGone").style.display = "block";
        */});
        
        this.socket.on('chose', square => {/*
            hidePopUps();
            remainingSquares = remainingSquares.filter(e=>e!=square);
            theCurrentSquare.setState({currentSquare: square});
            theBoard.squareDone(square);
            socket.emit('current_square', square);
        */});

        this.socket.on('got_choose', player => {/*
            theChooseNextSquare.addPlayer(player);
            socket.emit('choose_next_square', player);
        */});

        this.socket.on('request_state', () => {/*
            socket.emit('state', [theBoard.state, theCurrentSquare.state, theChooseNextSquare.state]);
        */});
        
        this.socket.on('ready', name => {/*
            unreadyCrew = unreadyCrew.filter(e=>e!=name);
            if (unreadyCrew.length==0){
                theNextSquare.setState({allReady: true});
                theShowScores.setState({allReady: true});
            };
        */});
        
        this.socket.on('some_event', someEvent => {/* theEventReport.addEvent(someEvent); */});
        
        this.socket.on('got_scores', results => {/*
            var leaderboard = sortByScore(results);
            ReactDOM.render(<Stage3 leaderboard={leaderboard} />, document.getElementById("stage3"));
            hideStage("stage2");
            showStage("stage3");
            hidePopUps();
            socket.emit('game_over', leaderboard);
        */});
        
        this.setState({content: <AssembleCrew />}); // last lines
        this.socket.emit('request_key');
        
        // super.componentDidMount(); // add back iff inherits from ThemeDependent
    };
    componentWillUnmount() {
        // super.componentWillUnmount(); // add back iff inherits from ThemeDependent
        
        
        if (this.socket.connected) this.socket.disconnect();
        
    };
    render() {
        return <React.Fragment>
            <div id="startContent">{this.state.content}</div>
            {this.popUps}
        </React.Fragment>;
    };
};
