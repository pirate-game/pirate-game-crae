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
	<div id="title">
		<h1>&nbsp;The&nbsp;Pirate&nbsp;Game&nbsp;</h1>
		<label for="theme">Theme:</label>
		<select id="theme" onChange={shared_vars.setTheme}>
			<option value="default">Pirate</option>
			<option value="xmas">Christmas</option>
		</select>
	</div>
</div>;

const titlebar = <div id="titlebar">
	//<h1 id="title" style={{fontSize: '50px'}}>The&nbsp;Pirate&nbsp;Game</h1>
	<div id="title">
		<h1 style={{fontSize: '50px'}}>&nbsp;The&nbsp;Pirate&nbsp;Game&nbsp;</h1>
		<label for="theme">Theme:</label>
		<select id="theme" onChange={shared_vars.setTheme}>
			<option value="default">Pirate</option>
			<option value="xmas">Christmas</option>
		</select>
	</div>
</div>;

const RulesContent_helper = React.lazy(() => import("./rules"));
const RulesContent = () => <React.Suspense fallback={shared_vars.defaultLoading}><br /><RulesContent_helper /></React.Suspense>;

const AcknowledgeContent_helper = React.lazy(() => import("./acknowledge"));
const AcknowledgeContent = () => <React.Suspense fallback={shared_vars.defaultLoading}><br /><AcknowledgeContent_helper /></React.Suspense>;

class MainPageContent extends shared_vars.ThemeDependentComponent {
	render() {
		const data = this.state.data;
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

const toRender = <React.Fragment>
	<div id="navOrTitleBar"></div>
	<div id="content"></div>
</React.Fragment>;

renderIn(toRender, 'root')

shared_vars.gotoPage[""] = () => { renderIn(navbar, 'navOrTitleBar'); renderIn(mainPageContent, 'content'); };
shared_vars.gotoPage["#rules_tag"] = () => { renderIn(navbar, 'navOrTitleBar'); renderIn(<RulesContent />, 'content'); };
shared_vars.gotoPage["#ack_tag"] = () => { renderIn(navbar, 'navOrTitleBar'); renderIn(<AcknowledgeContent />, 'content'); };

shared_vars.gotoPage[window.location.hash]();
