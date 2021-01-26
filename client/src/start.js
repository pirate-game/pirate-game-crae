import React from 'react';

import io from 'socket.io-client';

import * as shared_vars from './shared_vars';

import * as GameThings from './GameThings';

import './css/start.css';



/*

class KeyBox extends React.Component {
    constructor() {
        super();
        this.state = {key: ''};
        theStart.socket.on('key', msg => this.setState({key: msg})); // theStart.socket is guaranteed to exist by now
        theStart.socket.emit('request_key');
    };
    render() {
        return <div id="keyBox" style={{backgroundColor: 'lightblue'}}>
            <h2> Key: {this.state.key} </h2>
        </div>;
    };
};

class AssembleCrew extends React.Component {
    removePlayer(p) {
        this.crewListRef.remove(p); 
        shared_vars.removeFirstOccurrenceIn(p, theStart.allCrew); 
        theStart.socket.emit('remove_player', p);
    };
    changeCrew() {
        theStart.socket.emit('change_crew');
        theStart.popUpsRef.pop();
    };
    constructor() {
        super();
        this.state = {};
        this.removePlayer = this.removePlayer.bind(this);
        this.changeCrew = this.changeCrew.bind(this);
        this.state.crewList = <GameThings.ListWithCrosses 
                                    ref={e => (this.crewListRef = e)} 
                                    callback={this.removePlayer} style={{position: 'absolute', left: '10px', right: '10px', top: '60px'}} />;      
        this.state.keybox = <KeyBox />;
        
        theStart.socket.on('request_join', name => {
            this.setState(state => {
                state.crew.push(name);
                return state;
            });
            globalCrew.push(name);
        });
        theStart.socket.on('show_provisional_crew', () => {
            theStart.popUpsRef.push(<div id="crewAssembledPopUp" className="popUp"><div>
                    <h3>Crew Assembled</h3>
                    <hr />
                    <div>
                        <p style={{display: 'inline-block', width: 'calc(100% - 190px)'}}>Those currently in your crew are below. You can remove them with the crosses.</p>
                        <div style={{display: 'inline-block'}}>
                            <button onClick={()=>"start game"}>Start<br />Game</button>
                            <button onClick={this.changeCrew}>Change<br />Crew</button>
                        </div>
                    </div>
                    <GameThings.ListWithCrosses initial={this.state.crew} callback={this.removePlayer} style={{maxHeight: 'calc(100vh - 400px)'}} />
        </div></div>});
    };
    render() {
        return <div style={{position: 'relative', minHeight: 'calc(100vh - 230px)'}}>
            <div style={{position: 'relative',top: '-10%'}}>
                <button id="crewAssembled" onClick={assembleCrew}>Crew Assembled!</button>
                {this.state.keybox}
            </div>
            <h2 style={{fontSize: '50px', margin: '0px', marginLeft: '10px'}}>Crew:</h2>
            {this.state.crewList}
        </div>;
    };
};

function assembleCrew() {
    theStart.popUpsRef.clear();
    if (theStart.allCrew.length >= 2) {
        theStart.popUpsRef.addPopUp({
            title: "Waiting",
            textLines: ["This won't take too long, I hope!"]
        });//waiting
        theStart.socket.emit('crew_assembled');
    } else {
        theStart.popUpsRef.addPopUp({
            title: "Too Few Crewmembers",
            textLines: ["Yarr, ye be needin' at least 2 players."],
            btn: {
                text: "Okay!",
                onClick: theStart.popUpsRef.clear
            }
        });//too few
    };
};

function startGame() {
    theStart.popUpsRef.clear();
    if (theStart.allCrew.length >= 2) {
        theStart.socket.emit('start_game');
        theStart.setState({content: "hello"});///////////////////////////////////
    } else {
        document.getElementById("tooFew").style.display = "block";
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
        
        this.popUps = <GameThings.PopUps ref={e => {this.popUpsRef = e;}} />;
        
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
        
        this.socket.on('player_gone', player => {
            this.popUpsRef.clear();
            this.popUpsRef.addPopUp({
                title: "Player Gone",
                textLines: ["They not be 'ere any more. :("],
                btn: {
                    text: "Next Square",
                    onClick: () => "call nextSquare"
                }
            });
        });
        
        this.socket.on('chose', square => {
            this.popUpsRef.clear();
            shared_vars.removeFirstOccurrenceIn(square, this.remainingSquares);
            //...
            /*
            hidePopUps();
            remainingSquares = remainingSquares.filter(e=>e!=square);
            theCurrentSquare.setState({currentSquare: square});
            theBoard.squareDone(square);
            socket.emit('current_square', square);
        *//*});

        this.socket.on('got_choose', player => {/*
            theChooseNextSquare.addPlayer(player);
            socket.emit('choose_next_square', player);
        *//*});

        this.socket.on('request_state', () => {/*
            socket.emit('state', [theBoard.state, theCurrentSquare.state, theChooseNextSquare.state]);
        *//*});
        
        this.socket.on('ready', name => {/*
            unreadyCrew = unreadyCrew.filter(e=>e!=name);
            if (unreadyCrew.length==0){
                theNextSquare.setState({allReady: true});
                theShowScores.setState({allReady: true});
            };
        *//*});
        
        this.socket.on('some_event', someEvent => {/* theEventReport.addEvent(someEvent); *//*});
        
        this.socket.on('got_scores', results => {/*
            var leaderboard = sortByScore(results);
            ReactDOM.render(<Stage3 leaderboard={leaderboard} />, document.getElementById("stage3"));
            hideStage("stage2");
            showStage("stage3");
            hidePopUps();
            socket.emit('game_over', leaderboard);
        *//*});
        
        this.setState({content: <AssembleCrew ref={e => (this.contentRef = e)} />}); // last line
                
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
*/
