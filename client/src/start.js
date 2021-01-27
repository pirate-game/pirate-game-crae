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
                            <button onClick={()=>"start game"}>Start<br />Game</button>
                            <button onClick={()=>{this.socket.emit('change_crew'); this.setState(state => {
                                state.popUps.pop();
                                return state;
                            });}}>Change<br />{this.state.data.playersName}</button>
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
                        <button id="crewAssembled" onClick={()=>"Assemble crew"}>{data.playersName} Assembled!</button>
                        <KeyBox key={this.state.key} />
                    </div>
                    <h2 style={{fontSize: '50px', margin: '0px', marginLeft: '10px'}}>{data.playersName}:</h2>
                    <GameThings.NiceList elems={this.state.allPlayers} callback={this.crossCallback} style={{position: 'absolute', left: '10px', right: '10px', top: '60px'}} />
                </div>; break;

                case 1: content = null; break;

                case 2: content = null; break;

                case 3: content = null; break;

            };
        };
        return <React.Fragment>
            <div id="startContent">{content}</div>
            <GameThings.PopUps popUps={this.state.popUps} />
        </React.Fragment>;
    };
};

function KeyBox(props) {
    return <div id="keyBox" style={{backgroundColor: 'lightblue'}}>
        <h2> Key: {props.key} </h2>
    </div>;
};

/*

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
