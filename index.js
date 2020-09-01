const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'client/build')));

//Begin Game section

//js const means no =; it does not prohibit changes. It is like *const; not like const*.
const chars = "0123456789abcdef";
const keys_in_use = [];
const games = [];

function new_key() {
    while (true) {
        let out = "";
        for (let i = 0; i < 6; i++) {
            out += chars[Math.floor(Math.random() * 16)];
        };
        if (!keys_in_use.includes(out)) {
            keys_in_use.push(out);
            return out;
        };
    };
};

function keyToGame(someKey) {
    const len = games.length;
    for (let i = 0; i < len; i++) {
        if (games[i].game_key == someKey) {
            return i;
        };
    };
    return -1;
};

function leaderToGame(someLeader) {
    const someLeaderId = someLeader.id;
    const len = games.length;
    for (let i = 0; i < len; i++) {
        if (games[i].leader.id == someLeaderId) {
            return i;
        };
    };
    return -1;
};

function gameAndNameToPlayer(someGame, someName) {
    const theCrew = someGame.crew;
    const len = theCrew.length;
    for (let i = 0; i < len; i++) {
        if (theCrew[i].pirateName == someName) {
            return theCrew[i].pirate;
        };
    };
    return {};
};

function gameAndPlayerToName(someGame, somePlayer) {
    const theCrew = someGame.crew;
    const len = theCrew.length;
    for (let i = 0; i < len; i++) {
        if (theCrew[i].pirate.id == somePlayer.id) {
            return theCrew[i].pirateName;
        };
    };
    return "";
};

function crewmemberToGame(someCrewmember) {
    const someCrewmemberId = someCrewmember.id;
    const len = theCrew.length;
    for (let i = 0; i < len; i++) {
        if (games[i].crew.map(x=>x.pirate.id).includes(someCrewmemberId)) {
            return i;
        };
    };
    return -1;
};

io.on('connection', function(socket) {
    
    socket.on('request_key', function() {
        const key = new_key();
        socket.emit('key', key);
        games.push({ leader: socket, game_key: key, crew: [], available: true, watchable: false, watching: [], scores: [] });
    });
    
    socket.on('attempt_join', function(name, key) {
        const pos = keyToGame(key);
        if (pos == -1) {
            socket.emit('no_such_game');
        } else {
            if (games[pos].available) {
                if (games[pos].crew.map(x => x.pirateName).includes(name)) {
                    socket.emit('name_taken');
                } else {
                    games[pos].crew.push({ pirate: socket, pirateName: name });
                    games[pos].leader.emit('request_join', name);
                };
            } else {
                socket.emit('game_unavailable');
            };
        };
    });
    
    socket.on('crew_assembled', function() {
        const pos = leaderToGame(socket);
        if (pos != -1) {
            games[pos].available = false;
            socket.emit('show_provisional_crew');
        };
    });
    
    socket.on('remove_player', function(who) {
        const pos = leaderToGame(socket);
        if (pos != -1) {
            const player = gameAndNameToPlayer(games[pos], who);
            if (player != {}) {
                player.emit('join_rejected');
                games[pos].crew = games[pos].crew.filter((x)=>(x.pirate.id!=player.id));
            };
        };
    });
    
    socket.on('change_crew', function() {
        const pos = leaderToGame(socket);
        if (pos != -1) {
            games[pos].available = true;
        };
    });
    
    socket.on('start_game', function() {
        const pos = leaderToGame(socket);
        if (pos != -1) {
            games[pos].watchable = true;
            const theCrew = games[pos].crew;
            const lenCrew = theCrew.length;
            for (let i = 0; i < lenCrew; i++) {
                theCrew[i].pirate.emit('start_game');
            };
            const thoseWatching = games[pos].watching;
            const lenWatching = thoseWatching.length;
            for (let j = 0; j < lenWatching; j++) {
                thoseWatching[j].emit('start_game');
            };
        };
    });
    
    socket.on('too_slow', function(who) {
        const pos = leaderToGame(socket);
        if (pos != -1) {
            const game = games[pos];
            const lenWho = who.length;
            for (let i = 0; i < lenWho; i++) {
                const player = gameAndNameToPlayer(game, who[i]);
                if (player != {}) {
                    player.emit('too_slow');
                };
            };
            game.crew = game.crew.filter((x)=>(!who.includes(x.pirateName)));
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let j = 0; j < lenWatching; j++) {
                thoseWatching[j].emit('too_slow', who);
            };
        };
    });
    
    socket.on('board_ready', function() {
        const thisGame = crewmemberToGame(socket);
        if (thisGame != -1) {
            const game = games[thisGame];
            const thisName = gameAndPlayerToName(game, socket);
            if (thisName != "") {
                game.leader.emit('board_ready', thisName);
            };
        };
    });
    
    socket.on('attempt_watch', function(key) {
        const pos = keyToGame(key);
        if (pos == -1) {
            socket.emit('no_such_game');
        } else {
            const game = games[pos];
            game.watching.push(socket);
            if (game.watchable) {
                socket.emit('start_game');
                game.leader.emit('request_state');
            };
        };
    });
    
    socket.on('state', function(state) {
        const pos = leaderToGame(socket);
        if (pos != -1) {
            const thoseWatching = games[pos].watching;
            const len = thoseWatching.length;
            for (let i = 0; i < len; i++) {
                thoseWatching[i].emit('state', state);
            };
        };
    });
    
    socket.on('current_square', function(square) {
        const pos = leaderToGame(socket);
        if (pos != -1) {
            const game = games[pos];
            const theCrew = game.crew;
            const lenCrew = theCrew.length;
            for (let i = 0; i < lenCrew; i++) {
                theCrew[i].pirate.emit('current_square', square);
            };
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let j = 0; j < lenWatching; j++) {
                thoseWatching[j].emit('current_square', square);
            };
        };
    });
    
    socket.on('choose_next_square', function(player) {
        const pos = leaderToGame(socket);
        if (pos != -1) {
            const thoseWatching = games[pos].watching;
            const len = thoseWatching.length;
            for (let i = 0; i < len; i++) {
                thoseWatching[i].emit('choose_next_square', player);
            };
        };
    });
    
    socket.on('choose', function(toChoose) {
        const pos = leaderToGame(socket);
        if (pos != -1){
            const game = games[pos];
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; i++) {
                thoseWatching[i].emit('choose', toChoose);
            };
            const playerToChoose = gameAndNameToPlayer(game, toChoose);
            if (playerToChoose == {}) {
                socket.emit('player_gone', toChoose);
            } else {
                playerToChoose.emit('choose');
            };  
        };
    });
    
    socket.on('chose', function(square) {
        const pos = crewmemberToGame(socket);
        if (pos != -1) {
            games[pos].leader.emit('chose', square);
        };
    });
    
    socket.on('ready', function() {
        const thisGame = crewmemberToGame(socket);
        if (thisGame != -1) {
            const game = games[thisGame];
            const thisName = gameAndPlayerToName(game, socket);
            if (thisName != "") {
                game.leader.emit('ready', thisName);
            };
        };
    });
    
    socket.on('got_choose', function() {
        const thisGame = crewmemberToGame(socket);
        if (thisGame != -1) {
            const game = games[thisGame];
            const thisName = gameAndPlayerToName(game, socket);
            if (thisName != "") {
                game.leader.emit('got_choose', thisName);
            };
        };
    });
    
    socket.on('gobby_parrot', function(score) {
        const thisGame = crewmemberToGame(socket);
        if (thisGame != -1) {
            const game = games[thisGame];
            const thisName = gameAndPlayerToName(game, socket);
            if (thisName != "") {
                game.leader.emit('some_event', ["parrot", thisName, score]);
            };
            const thoseWatching = games[thisGame].watching;
            const len = thoseWatching.length;
            for (let i = 0; i < len; i++) {
                thoseWatching[i].emit('some_event', ["parrot", thisName, score]);
            };
        };
    });
    
    socket.on('get_scores', function() {
        const pos = leaderToGame(socket);
        if (pos != -1) {
            const theCrew = games[pos].crew;
            const len = theCrew.length;
            for (let i = 0; i < len; i++) {
                theCrew[i].pirate.emit('get_score');
            };
        };
    });
    
    socket.on('got_score', function(someScore) {
        const pos = crewmemberToGame(socket);
        if (pos != -1) {
            const game = games[pos];
            game.scores.push({ name: gameAndPlayerToName(game, socket), score: someScore });
            game.leader.emit('got_scores', game.scores);
        };
    });
    
    socket.on('game_over', function(leaderboard) {
        const pos = leaderToGame(socket);
        if (pos != -1){
            const game = games[pos];
            const theCrew = game.crew;
            const lenCrew = theCrew.length;
            for (let i = 0; i < lenCrew; i++){
                theCrew[i].pirate.emit('game_over', leaderboard);
            };
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (var j = 0; j < lenWatching; j++){
                thoseWatching[j].emit('game_over', leaderboard);
            };
        };
    });
    
    socket.on('request_crew', function() {
        const pos = crewmemberToGame(socket);
        if (pos != -1) {
            socket.emit('crew', games[pos].crew.map(e=>e.pirateName));
        };
    });
    
    socket.on('rob', function(name) {
        const pos = crewmemberToGame(socket);
        if (pos != -1) {
            const game = games[pos];
            const victim = gameAndNameToPlayer(game, name);
            if (victim != {}) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('rob', perpetrator);
            };
        };
    });
    
    socket.on('kill', function(name) {
        const pos = crewmemberToGame(socket);
        if (pos != -1) {
            const game = games[pos];
            const victim = gameAndNameToPlayer(game, name);
            if (victim != {}) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('kill', perpetrator);
            };
        };
    });
    
    //rest of refactored functions

});

//End Game section

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

http.listen(port);
