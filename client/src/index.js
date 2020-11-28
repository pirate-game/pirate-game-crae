import React from 'react';
import ReactDOM from 'react-dom';

import { f } from './rules';
import { x } from './shared_vars';
console.log(f());
++x;
console.log(f());

function setContent(content) {
	ReactDOM.render(content, document.getElementById('content'));
};

const navbar = <div id="nav">
	<ul>
      		<li><button id="logo"><img border="0" src="logo.png" /></button></li>
		<li><button>Start&nbsp;a<br />Game</button></li>
		<li><button>Join&nbsp;a<br />Game</button></li>
		<li><button>Watch&nbsp;a<br />Game</button></li>
		<li><button>Acknowledgements</button></li>
	</ul>
	<h1 id="title">&nbsp;The&nbsp;Pirate&nbsp;Game&nbsp;</h1>
</div>;

const titlebar = <div id="titlebar">
	<h1 id="title" style={{fontSize: '50px'}}>The&nbsp;Pirate&nbsp;Game</h1>
</div>;

const mainPageContent = <React.Fragment>
	<br />
		<div class="sometext" style={{backgroundColor: "lightblue"}}>
            		<p>Ya-harr! We be very glad ye's found us.
				<br />
				The Pirate Game Online Game is now playable! 
				Most o' ye's will be familiar with the rules but for those o' ye's that aren't they can be found <button style={{border: "none", background: "none", padding: "0", textDecorationLine: "underline", color: "blue"}} onClick={()=>setContent(<RulesContent />)}>'ere</button>.
				<br />
				<br />
				To play a game, one o' ye's will be the Pirate King an' will click 'Start a Game'. The rest o' y'all'll be crew an' will click 'Join a Game'. 
				The Pirate King will, then, share the key for the game which the crew will use to join the game. 
				If ye's can't see the Pirate King's screen, ye's can click 'Watch a Game' and enter the key, and it will copy the Pirate King's screen.
				<br />
				<br />
				We be 'opin' ye's all enjoy The Great Pirate Game!
            		</p>
        	</div>
		<br />
		<div class="sometext" style={{backgroundColor: "lightblue"}}>
			<p style={{marginLeft: "4em", textIndent: "-4em"}}>If ye's be needin' some piratical music, we be a recommendin' the followin': (They be openin' in a new tab)<br />
				<a href="https://www.youtube.com/playlist?list=PLXRhW-jVlFrXnHp5YLG_KKSHwxjJW_YrG" target="_blank">Jon English Pirates Of Penzance</a><br />
				<a href="https://www.youtube.com/playlist?list=PLJYmBTdnt9C5mHeZEGbX9fiUnbii7A2DP" target="_blank">Kevin Kline Pirates Of Penzance</a><br />
				<a href="https://www.youtube.com/playlist?list=PL18vVEBOfpWbFF79bEU8CA_WQNfoq2sJy" target="_blank">Pirates of the Caribbean</a><br />
				<a href="https://www.youtube.com/watch?v=dK-pMy_jOKI" target="_blank">On a Pirate Ship - Jay Foreman feat. Mad Cap'n Tom</a><br />
				<a href="https://www.youtube.com/playlist?list=PL1819EBCF5E49C09A" target="_blank">Muppets' Treasure Island</a><br />
				<a href="https://www.youtube.com/watch?v=D_JeKZd9ecE" target="_blank">The Sailors' Hornpipe</a><br />
				<a href="https://www.youtube.com/watch?v=VZ_Tu4-p1O8" target="_blank">Will Swenson's Pirate King Song</a><br />
				<a href="https://www.youtube.com/watch?v=jWzqcele1tY" target="_blank">Tim Curry's Pirate King Song</a><br />
				<a href="https://www.youtube.com/watch?v=q2j90qg_5_w" target="_blank">Anthony Warlow's Pirate King Song</a>
			</p>
        	</div>
</React.Fragment>;

const defaultLoading = <div>YARR! This be loadin'...</div>;

const RulesContent_helper = React.lazy(() => import("./rules"));
const RulesContent = () => <React.Suspense fallback={defaultLoading}><p>Start</p><RulesContent_helper /></React.Suspense>;

const toRender = <React.Fragment>
	<div id="navOrTitleBar">{navbar}</div>
	<div id="content">{mainPageContent}</div>
</React.Fragment>;

ReactDOM.render(toRender, document.getElementById('root'));
