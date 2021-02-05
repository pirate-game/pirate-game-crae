export default {
  "introduction_before": [
    "Ho, ho; ho! Welcome to The Great Christmas Game.",
    "Most of yout will be familiar with the rules, but for those of you that aren't, they can be found "
  ],
  "introduction_link_text": "here",
  "introduction_after": [
    ".",
    "To play a game, one of you will be host, and will click 'Start a Game'. The rest of you will be play by clicking 'Join a Game'. The host will, then, share the key for the game which you will use to join the game. If you can't see the host's screen, you can click 'Watch a Game' and enter the key, and it will copy the host's screen.",
    "We hope you all enjoy The Great Christmas Game!"
  ],
  "music_preamble": "If you need some Christmas-y music, we recommend the following: (They will open in a new tab)",
  "music": [
    ["https://www.youtube.com/watch?v=wzCQGodWwPU&list=PL3EEBC548773DC9C0", "The soundtrack to The Muppet Christmas Carol"],
    ["https://www.youtube.com/playlist?list=PL2BiE_4h8TpyTuvWlUu-4vHEU4SQozJPI", "Now That's What I Call Christmas (2015)"],
    ["https://www.youtube.com/watch?v=hgnxxTECLBo", "Don't Stop Christmas Now"],
    ["https://www.youtube.com/watch?v=3zQ53oXITyk", "Welcome To The Christmas Parade"],
    ["https://www.youtube.com/watch?v=vd02GE2E-24", "My Chemical Romance - All I Want For Christmas Is You"],
    ["https://www.youtube.com/watch?v=-k4yjCo8JWs", "Are You Hanging Up Your Stocking On The Wall?"],
    ["https://www.youtube.com/watch?v=nranUeNkXpM", "Christmas is Here"],
    ["https://www.youtube.com/watch?v=5ANDakiQGIY", "Marc Martel's Hallelujah Chorus"],
    ["https://www.youtube.com/watch?v=Sd8_CCp5-oY", "Christmas at Ground Zero"],
    ["https://www.youtube.com/watch?v=-ZggJNsAuIw", "Sleigh Ride in 7/8 time"],
    ["https://www.youtube.com/watch?v=DauxsT3uQOc", "Christmas With The Hannons"],
    ["https://www.youtube.com/watch?v=j9jbdgZidu8", "That song. You know the one."]
  ],
  "rules_preamble": [
    "To play a game, one of you will be host, and will click 'Start a Game'. The rest of you will be play by clicking 'Join a Game'. The host will, then, share the key for the game which you will use to join the game. If you can't see the host's screen, you can click 'Watch a Game' and enter the key, and it will copy the host's screen.",
    "Now you've set up a game, the players must fill in their boards with the 49 symbols of 15 types. They can do it themselves or the computer can do it randomly. If they do it manually, they can either type the name of the square where they want to place the symbol or can click on that square.",
    "When all players have filled their boards, the game can begin.",
    "On each of the 49 rounds, a square is selected, either at random or by one of the players, and all players get the symbol in that square. Most of the symbols are amounts of CASH. If a player gets a CASH symbol, their CASH is increased by that amount. There are other symbols which do other things as follows:"
  ],
  "rules_footer": "The winner is the player whose final CASH and Bank balance total the most.",
  "playersName": "Players",
  "nameQ": "What is your name?",
  "gameQ": "What is the game's key?",
  "watchQ": "What is the game to watch's key?",
  "tooFewTextLines": ["Ho, ho; ho, you need at least 2 players.", "The more the merrier!"],
  "tooFewReadyTextLines": ["Ho, ho; ho, you need at least 2 players before you can drop people for being slow.", "The more the merrier!"],
  "rob": {
    "file_ext": ".png",
    "name": "The Grinch",
    "description": "Allows you to take all of another player's CASH and add it to your own. Their Bank balance is safe from this. That you robbed them is announced to all players but how much CASH you took is kept secret."
  },
  "kill": {
    "file_ext": ".png",
    "name": "Poisonous Christmas Pudding",
    "description": "Allows you to reduce another player's CASH to zero. Their Bank balance is safe from this. This is announced to all players. That player is not out of the game, they must just start again from zero CASH."
  },
  "present": {
    "file_ext": ".png",
    "name": "Present",
    "description": "Allows you to increase another player's CASH by 1000. This is announced to all players."
  },
  "declareScore": {
    "file_ext": ".png",
    "name": "Scrooge",
    "description": "Announces your CASH to all players."
  },
  "swap": {
    "file_ext": ".png",
    "name": "Mistletoe",
    "description": "Allows you to swap CASH with another player. Both your Bank balances are safe from this. That you swapped with each other is announced to all players but how much CASH each of you had is kept secret."
  },
  "chooseNextSquare": {
    "file_ext": ".png",
    "name": "Christmas Tree",
    "description": "Adds you to a queue of people who will get to choose the next square. All players can see this queue."
  },
  "shield": {
    "file_ext": ".png",
    "name": "Elf",
    "description": "Block the bad! The Elf is placed in your 'Elf' box and you can choose to use it to block the bad at a later time. Nobody but you knows whether you have an Elf."
  },
  "mirror": {
    "file_ext": ".png",
    "name": "Mirrored Bauble",
    "description": "Reflect the bad! The Bauble is placed in your 'Bauble' box and you can choose to use it to reflect the bad back at the attacker at a later time. For example, if you were being robbed, you could mirror it with the Bauble, and rob them instead. They could use their Elf or Bauble at this point. Nobody but you knows whether you have a Bauble."
  },
  "goToZero": {
    "file_ext": ".png",
    "name": "Burnt Turkey",
    "description": "YOU go to zero! Your CASH goes to zero. Your Bank balance is safe from this. Nobody knows when this happens."
  },
  "double": {
    "file_ext": ".png",
    "name": "Cracker",
    "description": "Your CASH doubles. Your Bank balance is not affected. Nobody knows when this happens."
  },
  "bank": {
    "file_ext": ".png",
    "name": "Bank",
    "description": "Your CASH moves into your Bank."
  }
};
