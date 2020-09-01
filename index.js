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
            for (let i = 0; i < lenCrew; i++){
                theCrew[i].pirate.emit('start_game');
            };
            const thoseWatching = games[pos].watching;
            const lenWatching = thoseWatching.length;
            for (let j = 0; j < lenWatching; j++){
                thoseWatching[j].emit('start_game');
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
