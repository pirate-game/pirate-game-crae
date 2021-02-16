const express = require('express');
const app     = express();
const path    = require('path');
const http    = require('http').Server(app);
const io      = require('socket.io')(http);
const port    = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/404.html');
});

http.listen(port);

// end web section

function lower_bound(arr, value, cmp = ((a, b) => (a < b))) {
    let upper = arr.length;
    if (!upper) return 0;
    let lower = 0;
    while (true) {
	if (upper === lower + 1) return cmp(arr[lower], value) ? upper : lower;
        const mid = (lower + upper) >> 1; // average
        if (cmp(arr[mid], value)) {
            lower = mid;
        } else {
            upper = mid;
        };
    };
};

// begin game section

// js const means no =; it does not prohibit changes. It is like * const; not like const*.

const chars = "0123456789abcdef";
const games = {};

function new_key() {
    while (true) {
        let out = "";
        for (let i = 0; i < 6; ++i) {
            out += chars[Math.floor(Math.random() * 16)];
        };
        if (games[out] === undefined) { // not in use
            return out;
        };
    };
};

io.on('connection', socket => {


    // begin game set-up

    // start
    socket.on('request_key', () => {
        const key = new_key();
        games[key] = {
            leader: socket,
            crew: {},
            available: true,
            begun: false,
            watching: [],
            scores: []
        };
        socket.on('disconnect', () => {
            delete games[key]; // cleans up the game, and key when the host leaves
        });
	socket.emit('key', key);
    });

    // join
    socket.on('attempt_join', (key, name) => {
        const game = games[key];
        if (game === undefined) {
            socket.emit('no_such_game');
        } else {
            if (game.available) {
                if (game.crew[name] === undefined) {
                    game.crew[name] = socket;
                    game.leader.emit('request_join', name);
                } else {
                    socket.emit('name_taken');
                };
            } else {
                socket.emit('game_unavailable');
            };
        };
    });

    // start
    socket.on('remove_player', (key, who) => {
        const game = games[key];
        if (game !== undefined) {
            const player = game.crew[who];
            if (player !== undefined) {
                delete game.crew[who];
                player.emit('join_rejected');
            };
        };
    });

    // start
    socket.on('crew_assembled', key => {
        const game = games[key];
        if (game !== undefined) {
            game.available = false;
            socket.emit('show_provisional_crew');
        };
    });

    // start
    socket.on('change_crew', key => {
        const game = games[key];
        if (game !== undefined) {
            game.available = true;
        };
    });

    // start
    socket.on('prepare_boards', key => {
        const game = games[key];
        if (game !== undefined) {
            game.begun = true;
            for (const pirate of Object.values(game.crew)) pirate.emit('prepare_board');
            for (const watcher of game.watching) watcher.emit('start_game');
        };
    });

    // join
    socket.on('board_ready', (key, name) => {
        const game = games[key];
        if (game !== undefined) {
            game.leader.emit('board_ready', name);
        };
    });

    // start
    socket.on('too_slow', (key, who) => {
        const game = games[key];
        if (game !== undefined) {
            const crew = game.crew;
            for (const pirateName of who) {
                const pirate = crew[pirateName];
                if (pirate !== undefined) {
                    pirate.emit('too_slow');
                };
		delete crew[pirateName];
            };
            for (const watcher of game.watching) watcher.emit('too_slow', who);
        };
    });

    // end game set-up


    // begin watch

    // watch
    socket.on('attempt_watch', key => {
        const game = games[key];
        if (game === undefined) {
            socket.emit('no_such_game');
        } else {
            game.watching.push(socket);
            if (game.begun) {
                socket.emit('start_game');
                game.leader.emit('request_state');
            };
        };
    });

    // start
    socket.on('state', (key, state) => {
        const game = games[key];
        if (game !== undefined) {
            for (const watcher of game.watching) watcher.emit('state', state);
        };
    });

    // end watch


    // begin main section

    /*

    socket.on('current_square', square => {
        const game = leaderToGame(socket);
        if (game !== null) {
            const theCrew = game.crew;
            const lenCrew = theCrew.length;
            for (let i = 0; i < lenCrew; ++i) {
                theCrew[i].pirate.emit('current_square', square);
            };
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let j = 0; j < lenWatching; ++j) {
                thoseWatching[j].emit('current_square', square);
            };
        };
    });

    socket.on('choose_next_square', player => {
        const game = leaderToGame(socket);
        if (game !== null) {
            const thoseWatching = game.watching;
            const len = thoseWatching.length;
            for (let i = 0; i < len; ++i) {
                thoseWatching[i].emit('choose_next_square', player);
            };
        };
    });

    socket.on('choose', toChoose => {
        const game = leaderToGame(socket);
        if (game !== null) {
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; ++i) {
                thoseWatching[i].emit('choose', toChoose);
            };
            const playerToChoose = gameAndNameToPlayer(game, toChoose);
            if (playerToChoose === null) {
                socket.emit('player_gone', toChoose);
            } else {
                playerToChoose.emit('choose');
            };
        };
    });

    socket.on('chose', square => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            game.leader.emit('chose', square);
        };
    });

    socket.on('ready', () => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const thisName = gameAndPlayerToName(game, socket);
            if (thisName !== "") {
                game.leader.emit('ready', thisName);
            };
        };
    });

    socket.on('got_choose', () => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const thisName = gameAndPlayerToName(game, socket);
            if (thisName !== "") {
                game.leader.emit('got_choose', thisName);
            };
        };
    });

    socket.on('gobby_parrot', score => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const thisName = gameAndPlayerToName(game, socket);
            if (thisName !== "") {
                game.leader.emit('some_event', ["parrot", thisName, score]);
            };
            const thoseWatching = game.watching;
            const len = thoseWatching.length;
            for (let i = 0; i < len; ++i) {
                thoseWatching[i].emit('some_event', ["parrot", thisName, score]);
            };
        };
    });

    socket.on('rob', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim !== null) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('rob', perpetrator);
            };
        };
    });

    socket.on('kill', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim !== null) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('kill', perpetrator);
            };
        };
    });

    socket.on('present', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim !== null) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('present');
                game.leader.emit('some_event', ['present', perpetrator, name]);
                const thoseWatching = game.watching;
                const lenWatching = thoseWatching.length;
                for (let i = 0; i < lenWatching; ++i) {
                    thoseWatching[i].emit('some_event', ['present', perpetrator, name]);
                };
            };
        };
    });

    socket.on('swap', (name, amount) => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim !== null) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('swap', perpetrator, amount);
            };
        };
    });

    socket.on('mirror_rob', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim !== null) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('mirror_rob', perpetrator);
            };
        };
    });

    socket.on('mirror_kill', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim !== null) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('mirror_kill', perpetrator);
            };
        };
    });

    socket.on('mirror_mirror_rob', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim !== null) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('mirror_mirror_rob', perpetrator);
            };
        };
    });

    socket.on('mirror_mirror_kill', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndNameToPlayer(game, name);
            if (victim !== null) {
                const perpetrator = gameAndPlayerToName(game, socket);
                victim.emit('mirror_mirror_kill', perpetrator);
            };
        };
    });

    socket.on('robbed', (name, amount) => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const perpetrator = gameAndNameToPlayer(game, name);
            if (perpetrator !== null) {
                perpetrator.emit('robbed', amount);
                const victim = gameAndPlayerToName(game, socket);
                game.leader.emit('some_event', ['rob', name, victim]);
                const thoseWatching = game.watching;
                const lenWatching = thoseWatching.length;
                for (let i = 0; i < lenWatching; ++i) {
                    thoseWatching[i].emit('some_event', ['rob', name, victim]);
                };
            };
        };
    });

    socket.on('swapped', (name, amount) => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const perpetrator = gameAndNameToPlayer(game, name);
            if (perpetrator !== null) {
                perpetrator.emit('swapped', amount);
                const victim = gameAndPlayerToName(game, socket);
                game.leader.emit('some_event', ['swap', name, victim]);
                const thoseWatching = game.watching;
                const lenWatching = thoseWatching.length;
                for (let i = 0; i < lenWatching; ++i) {
                    thoseWatching[i].emit('some_event', ['swap', name, victim]);
                };
            };
        };
    });

    socket.on('killed', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['kill', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; ++i) {
                thoseWatching[i].emit('some_event', ['kill', name, victim]);
            };
        };
    });

    socket.on('shielded_rob', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_rob', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; ++i) {
                thoseWatching[i].emit('some_event', ['shielded_rob', name, victim]);
            };
        };
    });

    socket.on('shielded_swap', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_swap', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; ++i) {
                thoseWatching[i].emit('some_event', ['shielded_swap', name, victim]);
            };
        };
    });

    socket.on('shielded_kill', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_kill', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; ++i) {
                thoseWatching[i].emit('some_event', ['shielded_kill', name, victim]);
            };
        };
    });

    socket.on('mirror_robbed', (name, amount) => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const perpetrator = gameAndNameToPlayer(game, name);
            if (perpetrator !== null) {
                perpetrator.emit('robbed', amount);
                const victim = gameAndPlayerToName(game, socket);
                game.leader.emit('some_event', ['mirror_robbed', name, victim]);
                const thoseWatching = game.watching;
                const lenWatching = thoseWatching.length;
                for (let i = 0; i < lenWatching; ++i) {
                    thoseWatching[i].emit('some_event', ['mirror_robbed', name, victim]);
                };
            };
        };
    });

    socket.on('mirror_killed', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['mirror_killed', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; ++i) {
                thoseWatching[i].emit('some_event', ['mirror_killed', name, victim]);
            };
        };
    });

    socket.on('shielded_mirror_rob', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_mirror_rob', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; ++i) {
                thoseWatching[i].emit('some_event', ['shielded_mirror_rob', name, victim]);
            };
        };
    });

    socket.on('shielded_mirror_kill', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_mirror_kill', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; ++i) {
                thoseWatching[i].emit('some_event', ['shielded_mirror_kill', name, victim]);
            };
        };
    });

    socket.on('mirror_mirror_robbed', (name, amount) => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const perpetrator = gameAndNameToPlayer(game, name);
            if (perpetrator !== null) {
                perpetrator.emit('robbed', amount);
                const victim = gameAndPlayerToName(game, socket);
                game.leader.emit('some_event', ['mirror_mirror_robbed', name, victim]);
                const thoseWatching = game.watching;
                const lenWatching = thoseWatching.length;
                for (let i = 0; i < lenWatching; ++i) {
                    thoseWatching[i].emit('some_event', ['mirror_mirror_robbed', name, victim]);
                };
            };
        };
    });

    socket.on('mirror_mirror_killed', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['mirror_mirror_killed', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; ++i) {
                thoseWatching[i].emit('some_event', ['mirror_mirror_killed', name, victim]);
            };
        };
    });

    socket.on('shielded_mirror_mirror_rob', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_mirror_mirror_rob', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; ++i) {
                thoseWatching[i].emit('some_event', ['shielded_mirror_mirror_rob', name, victim]);
            };
        };
    });

    socket.on('shielded_mirror_mirror_kill', name => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            const victim = gameAndPlayerToName(game, socket);
            game.leader.emit('some_event', ['shielded_mirror_mirror_kill', name, victim]);
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (let i = 0; i < lenWatching; ++i) {
                thoseWatching[i].emit('some_event', ['shielded_mirror_mirror_kill', name, victim]);
            };
        };
    });

    */

    // end main section


    // begin leaderboard

    /*

    socket.on('get_scores', () => {
        const game = leaderToGame(socket);
        if (game !== null) {
            const theCrew = game.crew;
            const len = theCrew.length;
            for (let i = 0; i < len; ++i) {
                theCrew[i].pirate.emit('get_score');
            };
        };
    });

    socket.on('got_score', someScore => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            game.scores.push({
                name: gameAndPlayerToName(game, socket),
                score: someScore
            });
            game.leader.emit('got_scores', game.scores);
        };
    });

    socket.on('game_over', leaderboard => {
        const game = leaderToGame(socket);
        if (game !== null) {
            const theCrew = game.crew;
            const lenCrew = theCrew.length;
            for (let i = 0; i < lenCrew; ++i) {
                theCrew[i].pirate.emit('game_over', leaderboard);
            };
            const thoseWatching = game.watching;
            const lenWatching = thoseWatching.length;
            for (var j = 0; j < lenWatching; ++j) {
                thoseWatching[j].emit('game_over', leaderboard);
            };
        };
    });

    */

    // end leaderboard


    /* // miscellaneous

    socket.on('request_crew', () => {
        const game = crewmemberToGame(socket);
        if (game !== null) {
            socket.emit('crew', game.crew.map(e => e.pirateName));
        };
    });

    */


});
