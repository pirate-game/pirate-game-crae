import React from 'react';

import shared_vars from './shared_vars';

export default class Start extends shared_vars.ThemeDependentComponent {
    componentDidMount() {
        
        this.key = '';
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
        
        socket.emit('request_key'); // last
        
        super.componentDidMount();
    };
    componentWillUnmount() {
        super.componentWillUnmount();
        
        
        if (this.socket.connected) this.socket.disconnect();
        
    };
    render() {
        if (this.state.data) {
            return <p>{this.state.data.introduction_before[0]}</p>;
        } else {
        return <p>Start Content</p>;
        };
    };
};
