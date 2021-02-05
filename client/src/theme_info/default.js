export default {
  "introduction_before": [
    "Ya-harr! We be very glad ye's found us.",
    "The Pirate Game Online Game is now playable! Most o' ye's will be familiar with the rules but for those o' ye's that aren't they can be found "
  ],
  "introduction_link_text": "'ere",
  "introduction_after": [
    ".",
    "To play a game, one o' ye's will be the Pirate King an' will click 'Start a Game'. The rest o' y'all'll be crew an' will click 'Join a Game'. The Pirate King will, then, share the key for the game which the crew will use to join the game. If ye's can't see the Pirate King's screen, ye's can click 'Watch a Game' and enter the key, and it will copy the Pirate King's screen.",
    "We be 'opin' ye's all enjoy The Great Pirate Game!"
  ],
  "music_preamble": "If ye's be needin' some piratical music, we be a recommendin' the followin': (They be openin' in a new tab)",
  "music": [
    ["https://www.youtube.com/playlist?list=PLXRhW-jVlFrXnHp5YLG_KKSHwxjJW_YrG", "Jon English Pirates Of Penzance"],
    ["https://www.youtube.com/playlist?list=PLJYmBTdnt9C5mHeZEGbX9fiUnbii7A2DP", "Kevin Kline Pirates Of Penzance"],
    ["https://www.youtube.com/playlist?list=PL18vVEBOfpWbFF79bEU8CA_WQNfoq2sJy", "Pirates of the Caribbean"],
    ["https://www.youtube.com/watch?v=dK-pMy_jOKI", "On a Pirate Ship - Jay Foreman feat. Mad Cap'n Tom"],
    ["https://www.youtube.com/playlist?list=PL1819EBCF5E49C09A", "Muppets' Treasure Island"],
    ["https://www.youtube.com/watch?v=D_JeKZd9ecE", "The Sailors' Hornpipe"],
    ["https://www.youtube.com/watch?v=VZ_Tu4-p1O8", "Will Swenson's Pirate King Song"],
    ["https://www.youtube.com/watch?v=jWzqcele1tY", "Tim Curry's Pirate King Song"],
    ["https://www.youtube.com/watch?v=q2j90qg_5_w", "Anthony Warlow's Pirate King Song"]
  ],
  "rules_preamble": [
    "To play a game, one o' ye's will be the Pirate King an' will click 'Start a Game'. The rest o' y'all'll be crew an' will click 'Join a Game'. The Pirate King will, then, share the key for the game which the crew will use to join the game. If ye's can't see the Pirate King's screen, ye's can click 'Watch a Game' and enter the key, and it will copy the Pirate King's screen.",
    "Now ye's 'ave set up a game, the crew must fill in their boards with the 49 symbols of 15 types. They can do it themselves or the computer can do it randomly. If they do it manually, they can either type the name of the square where they want to place the symbol or can click on that square.",
    "When all crewmembers 'ave filled their boards, the game can begin.",
    "On each of the 49 rounds, a square is selected, either at random or by one of the players, and all players get the symbol in that square. Most of the symbols are amounts o' CASH. If a player gets a CASH symbol, their CASH is increased by that amount. There are other symbols which do other things as follows:"
  ],
  "rules_footer": "The winner is the pirate whose final CASH and Bank balance total the most.",
  "playersName": "Crew",
  "nameQ": "What be your name?",
  "gameQ": "What game be ye joinin'?",
  "watchQ": "What game be ye watchin'?",
  "tooFewTextLines": ["Yarr, ye be needin' at least 2 players."],
  "tooFewReadyTextLines": ["Yarr, ye be needin' at least 2 players before ye's can drop people for bein' slow."],
  "rob": {
    "file_ext": ".png",
    "name": "Rob",
    "description": "Allows you to take all of another player's CASH and add it to your own. Their Bank balance is safe from this. That you robbed them is announced to all players but how much CASH you took is kept secret."
  },
  "kill": {
    "file_ext": ".svg",
    "name": "Kill",
    "description": "Allows you to reduce another player's CASH to zero. Their Bank balance is safe from this. This is announced to all players. That player is not out of the game, they must just start again from zero CASH."
  },
  "present": {
    "file_ext": ".png",
    "name": "Present",
    "description": "Allows you to increase another player's CASH by 1000. This is announced to all players."
  },
  "declareScore": {
    "file_ext": ".png",
    "name": "Gobby Parrot",
    "description": "Announces your CASH to all players."
  },
  "swap": {
    "file_ext": ".png",
    "name": "Swap",
    "description": "Allows you to swap CASH with another player. Both your Bank balances are safe from this. That you swapped with each other is announced to all players but how much CASH each of you had is kept secret."
  },
  "chooseNextSquare": {
    "file_ext": ".png",
    "name": "Choose Next Square",
    "description": "Adds you to a queue of people who will get to choose the next square. All players can see this queue."
  },
  "shield": {
    "file_ext": ".svg",
    "name": "Shield",
    "description": "Block the bad! The Shield is placed in your 'Shield' box and you can choose to use it to block the bad at a later time. Nobody but you knows whether you have a Shield."
  },
  "mirror": {
    "file_ext": ".png",
    "name": "Mirror",
    "description": "Reflect the bad! The Mirror is placed in your 'Mirror' box and you can choose to use it to reflect the bad back at the attacker at a later time. For example, if you were being robbed, you could mirror it and rob them instead. They could use their Shield or Mirror at this point. Nobody but you knows whether you have a Mirror."
  },
  "goToZero": {
    "file_ext": ".svg",
    "name": "Bomb",
    "description": "YOU go to zero! Your CASH goes to zero. Your Bank balance is safe from this. Nobody knows when this happens."
  },
  "double": {
    "file_ext": ".svg",
    "name": "Double",
    "description": "Your CASH doubles. Your Bank balance is not affected. Nobody knows when this happens."
  },
  "bank": {
    "file_ext": ".svg",
    "name": "Bank",
    "description": "Your CASH moves into your Bank."
  }
};
