import React from 'react';
import ReactDOM from 'react-dom';

import shared_vars from './shared_vars';

window.addEventListener('hashchange', () => {
	const putative_fn = shared_vars.gotoPage[window.location.hash];
	if (putative_fn) {
		putative_fn();
	};
});

function renderIn(content, place) {
	ReactDOM.render(content, document.getElementById(place));
};

const navbar = <div id="nav">
	<ul>
      		<li><a href="#" id="logo"><img border="0" src="logo.png" /></a></li>
		<li><a href="#start_tag">Start&nbsp;a<br />Game</a></li>
		<li><a href="#join_tag">Join&nbsp;a<br />Game</a></li>
		<li><a href="#watch_tag">Watch&nbsp;a<br />Game</a></li>
		<li><a href="#ack_tag">Acknowledgements</a></li>
	</ul>
	<h1 id="title">&nbsp;The&nbsp;Pirate&nbsp;Game&nbsp;</h1>
</div>;

const titlebar = <div id="titlebar">
	<h1 id="title" style={{fontSize: '50px'}}>The&nbsp;Pirate&nbsp;Game</h1>
</div>;

const RulesContent_helper = React.lazy(() => import("./rules"));
const RulesContent = () => <React.Suspense fallback={shared_vars.defaultLoading}><br /><RulesContent_helper /></React.Suspense>;

class MainPageContent extends shared_vars.ThemeDependentComponent {
	render() {
		const data = this.data;
		if (data) {
			return <React.Fragment>
				<br />
				<div class="sometext" style={{backgroundColor: "lightblue"}}>
            				<p>
						{shared_vars.intersperseWith(data.introduction_before, shared_vars.twoNewLines)}
						<a href="#rules_tag">{data.introduction_link_text}</a>
						{shared_vars.intersperseWith(data.introduction_after, shared_vars.twoNewLines)}
					</p>
				</div>
				<br />
				<div class="sometext" style={{backgroundColor: "lightblue"}}>
					<p style={{marginLeft: "4em", textIndent: "-4em"}}>
						{data.music_preamble}
						<br />
						{shared_vars.intersperseWith(data.music.map(e => <a href={e[0]} target="_blank">{e[1]}</a>), <br />)}
					</p>
				</div>
			</React.Fragment>;
		} else {
			return shared_vars.defaultLoading;
		};
	};
};

const mainPageContent = <MainPageContent />;

/*<React.Fragment>
	<br />
		<div class="sometext" style={{backgroundColor: "lightblue"}}>
            		<p>Ya-harr! We be very glad ye's found us.
				<br />
				The Pirate Game Online Game is now playable! 
				Most o' ye's will be familiar with the rules but for those o' ye's that aren't they can be found <a href="#rules_tag">'ere</a>.
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
*/

const toRender = <React.Fragment>
	<div id="navOrTitleBar"></div>
	<div id="content"></div>
</React.Fragment>;

renderIn(toRender, 'root')

shared_vars.gotoPage[""] = () => { renderIn(navbar, 'navOrTitleBar'); renderIn(mainPageContent, 'content'); };
shared_vars.gotoPage["#rules_tag"] = () => { renderIn(navbar, 'navOrTitleBar'); renderIn(<RulesContent />, 'content'); };

shared_vars.gotoPage[window.location.hash]();
