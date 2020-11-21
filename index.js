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
            return games[i];
        };
    };
    return {};
};

function leaderToGame(someLeader) {
    const someLeaderId = someLeader.id;
    const len = games.length;
    for (let i = 0; i < len; i++) {
        if (games[i].leader.id == someLeaderId) {
            return games[i];
        };
    };
    return {};
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
            return games[i];
        };
    };
    return {};
};
/*
io.on('connection', function(socket) {
    
    socket.on('request_key', function() {
        const key = new_key();
        socket.emit('key', key);
        games.push({ leader: socket, game_key: key, crew: [], available: true, watchable: false, watching: [], scores: [] });
    });
    
    socket.on('attempt_join', function(name, key) {
        const game = keyToGame(key);
        if (game == {}) {
            socket.emit('no_such_game');
        } else {
            if (game.available) {
                if (game.crew.map(x => x.pirateName).includes(name)) {
                    socket.emit('name_taken');
                } else {
                    game.crew.push({ pirate: socket, pirateName: name });
                    game.leader.emit('request_join', name);
                };
            } else {
                socket.emit('game_unavailable');
            };
        };
    });
    
    socket.on('crew_assembled', function() {
        const game = leaderToGame(socket);
        if (game != {}) {
            game.available = false;
            socket.emit('show_provisional_crew');
        };
    });
    
    socket.on('remove_player', function(who) {
        const game = leaderToGame(socket);
        if (game != {}) {
            const player = gameAndNameToPlayer(game, who);
            if (player != {}) {
                player.emit('join_rejected');
                game.crew = game.crew.filter((x)=>(x.pirate.id!=player.id));
            };
        };
    });
    
    socket.on('change_crew', function() {
        const game = leaderToGame(socket);
        if (game != {]) {
            game.available = true;
        };
    });
    
    socket.on('start_game', function() {
        const game = leaderToGame(socket);
        if (game != {}) {
            game.watchable = true;
            const theCrew = game.crew;
            const lenCrew = theCrew.length;
            for (let i = 0; i < lenCrew; i++) {
                theCrew[i].pirate.emit('start_game');
            };
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let j = 0; j < lenWatching; j++) {
                thoseWatching[j].emit('start_game');
            };
        };
    });
    
    socket.on('too_slow', function(who) {
        const game = leaderToGame(socket);
        if (game != {}) {
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
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const name = gameAndPlayerToName(game, socket);
            if (name != "") {
                game.leader.emit('board_ready', name);
            };
        };
    });
    
    socket.on('attempt_watch', function(key) {
        const game = keyToGame(key);
        if (game == {}) {
            socket.emit('no_such_game');
        } else {
            game.watching.push(socket);
            if (game.watchable) {
                socket.emit('start_game');
                game.leader.emit('request_state');
            };
        };
    });
    
    socket.on('state', function(state) {
        const game = leaderToGame(socket);
        if (game != {}) {
            const thoseWatching = game.watching;
            const len = thoseWatching.length;
            for (let i = 0; i < len; i++) {
                thoseWatching[i].emit('state', state);
            };
        };
    });
    
    socket.on('current_square', function(square) {
        const game = leaderToGame(socket);
        if (game != {}) {
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
        const game = leaderToGame(socket);
        if (game != {}) {
            const thoseWatching = game.watching;
            const len = thoseWatching.length;
            for (let i = 0; i < len; i++) {
                thoseWatching[i].emit('choose_next_square', player);
            };
        };
    });
    
    socket.on('choose', function(toChoose) {
        const game = leaderToGame(socket);
        if (game != {}){
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
        const game = crewmemberToGame(socket);
        if (game != {}) {
            game.leader.emit('chose', square);
        };
    });
    
    socket.on('ready', function() {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const thisName = gameAndPlayerToName(game, socket);
            if (thisName != "") {
                game.leader.emit('ready', thisName);
            };
        };
    });
    
    socket.on('got_choose', function() {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const thisName = gameAndPlayerToName(game, socket);
            if (thisName != "") {
                game.leader.emit('got_choose', thisName);
            };
        };
    });
    
    socket.on('gobby_parrot', function(score) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const thisName = gameAndPlayerToName(game, socket);
            if (thisName != "") {
                game.leader.emit('some_event', ["parrot", thisName, score]);
            };
            const thoseWatching = game.watching;
            const len = thoseWatching.length;
            for (let i = 0; i < len; i++) {
                thoseWatching[i].emit('some_event', ["parrot", thisName, score]);
            };
        };
    });
    
    socket.on('get_scores', function() {
        const game = leaderToGame(socket);
        if (game != {}) {
            const theCrew = game.crew;
            const len = theCrew.length;
            for (let i = 0; i < len; i++) {
                theCrew[i].pirate.emit('get_score');
            };
        };
    });
    
    socket.on('got_score', function(someScore) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            game.scores.push({ name: gameAndPlayerToName(game, socket), score: someScore });
            game.leader.emit('got_scores', game.scores);
        };
    });
    
    socket.on('game_over', function(leaderboard) {
        const game = leaderToGame(socket);
        if (game != {}) {
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
        const game = crewmemberToGame(socket);
        if (game != {}) {
            socket.emit('crew', game.crew.map(e=>e.pirateName));
        };
    });
    
    socket.on('rob', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim != {}) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('rob', perpetrator);
            };
        };
    });
    
    socket.on('kill', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim != {}) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('kill', perpetrator);
            };
        };
    });
    
    socket.on('present', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim != {}) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('present');
                game.leader.emit('some_event', ['present', perpetrator, name]);
                const thoseWatching = game.watching;
                const lenWatching = thoseWatching.length;
                for (let i = 0; i < lenWatching; i++) {
                    thoseWatching[i].emit('some_event', ['present', perpetrator, name]);
                };
            };
        };
    });
    
    socket.on('swap', function(name, amount) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim != {}) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('swap', perpetrator, amount);
            };
        };
    });
    
    socket.on('mirror_rob', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim != {}) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('mirror_rob', perpetrator);
            };
        };
    });
    
    socket.on('mirror_kill', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim != {}) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('mirror_kill', perpetrator);
            };
        };
    });
    
    socket.on('mirror_mirror_rob', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim != {}) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('mirror_mirror_rob', perpetrator);
            };
        };
    });
    
    socket.on('mirror_mirror_kill', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim != {}) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('mirror_mirror_kill', perpetrator);
            };
        };
    });
    
    socket.on('robbed', function(name, amount) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const perpetrator = gameAndNameToPlayer(game, name);
            if (perpetrator != {}) {
                perpetrator.emit('robbed', amount);
                const victim = gameAndPlayerToName(game, socket);
                game.leader.emit('some_event', ['rob', name, victim]);
                const thoseWatching = game.watching;
                const lenWatching = thoseWatching.length;
                for (let i = 0; i < lenWatching; i++) {
                    thoseWatching[i].emit('some_event', ['rob', name, victim]);
                };
            };
        };
    });
    
    socket.on('swapped', function(name, amount) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const perpetrator = gameAndNameToPlayer(game, name);
            if (perpetrator != {}) {
                perpetrator.emit('swapped', amount);
                const victim = gameAndPlayerToName(game, socket);
                game.leader.emit('some_event', ['swap', name, victim]);
                const thoseWatching = game.watching;
                const lenWatching = thoseWatching.length;
                for (let i = 0; i < lenWatching; i++) {
                    thoseWatching[i].emit('some_event', ['swap', name, victim]);
                };
            };
        };
    });
    
    socket.on('killed', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['kill', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; i++) {
                thoseWatching[i].emit('some_event', ['kill', name, victim]);
            };
        };
    });
    
    socket.on('shielded_rob', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_rob', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; i++) {
                thoseWatching[i].emit('some_event', ['shielded_rob', name, victim]);
            };
        };
    });
    
    socket.on('shielded_swap', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_swap', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; i++) {
                thoseWatching[i].emit('some_event', ['shielded_swap', name, victim]);
            };
        };
    });
    
    socket.on('shielded_kill', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_kill', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; i++) {
                thoseWatching[i].emit('some_event', ['shielded_kill', name, victim]);
            };
        };
    });
    
    socket.on('mirror_robbed', function(name, amount) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const perpetrator = gameAndNameToPlayer(game, name);
            if (perpetrator != {}) {
                perpetrator.emit('robbed', amount);
                const victim = gameAndPlayerToName(game, socket);
                game.leader.emit('some_event', ['mirror_robbed', name, victim]);
                const thoseWatching = game.watching;
                const lenWatching = thoseWatching.length;
                for (let i = 0; i < lenWatching; i++) {
                    thoseWatching[i].emit('some_event', ['mirror_robbed', name, victim]);
                };
            };
        };
    });   
    
     socket.on('mirror_killed', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['mirror_killed', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; i++) {
                thoseWatching[i].emit('some_event', ['mirror_killed', name, victim]);
            };
        };
    });
    
    socket.on('shielded_mirror_rob', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_mirror_rob', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; i++) {
                thoseWatching[i].emit('some_event', ['shielded_mirror_rob', name, victim]);
            };
        };
    });
    
    socket.on('shielded_mirror_kill', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_mirror_kill', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; i++) {
                thoseWatching[i].emit('some_event', ['shielded_mirror_kill', name, victim]);
            };
        };
    });
    
    socket.on('mirror_mirror_robbed', function(name, amount) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const perpetrator = gameAndNameToPlayer(game, name);
            if (perpetrator != {}) {
                perpetrator.emit('robbed', amount);
                const victim = gameAndPlayerToName(game, socket);
                game.leader.emit('some_event', ['mirror_mirror_robbed', name, victim]);
                const thoseWatching = game.watching;
                const lenWatching = thoseWatching.length;
                for (let i = 0; i < lenWatching; i++) {
                    thoseWatching[i].emit('some_event', ['mirror_mirror_robbed', name, victim]);
                };
            };
        };
    });   
    
     socket.on('mirror_mirror_killed', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['mirror_mirror_killed', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; i++) {
                thoseWatching[i].emit('some_event', ['mirror_mirror_killed', name, victim]);
            };
        };
    });
    
     socket.on('shielded_mirror_mirror_rob', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_mirror_mirror_rob', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; i++) {
                thoseWatching[i].emit('some_event', ['shielded_mirror_mirror_rob', name, victim]);
            };
        };
    });
    
    socket.on('shielded_mirror_mirror_kill', function(name) {
        const game = crewmemberToGame(socket);
        if (game != {}) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_mirror_mirror_kill', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; i++) {
                thoseWatching[i].emit('some_event', ['shielded_mirror_mirror_kill', name, victim]);
            };
        };
    });

});
*/
//End Game section

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

http.listen(port);
