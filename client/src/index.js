import React from 'react';
import ReactDOM from 'react-dom';

import shared_vars from './shared_vars';

window.addEventListener('hashchange', () => {
	if (window.location.hash != shared_vars.authenticHash) {
		if (shared_vars.unload_able || window.confirm("Leaving will irreversibly kick you from the game.")) {
			const putative_fn = shared_vars.gotoPage[window.location.hash];
			if (putative_fn) {
				shared_vars.authenticHash = window.location.hash; // set proper location to actual one, because actual one is valid
				putative_fn();
			} else {
				window.location.hash = shared_vars.authenticHash; // set actual location back to proper one
			};
		} else {
			window.location.hash = shared_vars.authenticHash; // set actual location back to proper one
		};
	}
});

function renderIn(content, place) {
	ReactDOM.render(content, document.getElementById(place));
};

class ThemeSelector extends React.Component {
	render() {
		return <React.Fragment>
			<label for="theme">Theme:</label>
			<select id="theme" onChange={shared_vars.setTheme}>
				<option value="default">Pirate</option>
				<option value="xmas">Christmas</option>
			</select>
		</React.Fragment>;
	};
	componentDidMount() {
		document.getElementById("theme").value = shared_vars.theme;
	};
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
		<ThemeSelector />
	</div>
</div>;

const titlebar = <div id="titlebar">
	<div id="title" style={{float:"unset", width:"unset", paddingRight:"unset"}}>
		<h1 style={{fontSize: '50px'}}>&nbsp;The&nbsp;Pirate&nbsp;Game&nbsp;</h1>
		<ThemeSelector />
	</div>
</div>;

const RulesContent_lazy = React.lazy(() => import("./rules"));
const RulesContent_helper = shared_vars.defaultWrapComponent(<RulesContent_lazy />);
const RulesContent = () => RulesContent_helper;
							    
const AcknowledgeContent_lazy = React.lazy(() => import("./acknowledge"));
const AcknowledgeContent_helper = shared_vars.defaultWrapComponent(<AcknowledgeContent_lazy />);
const AcknowledgeContent = () => AcknowledgeContent_helper;

const SubmittedContent_lazy = React.lazy(() => import("./submitted"));
const SubmittedContent_helper = shared_vars.defaultWrapComponent(<SubmittedContent_lazy />);
const SubmittedContent = () => SubmittedContent_helper;

const StartContent_lazy = React.lazy(() => import("./start"));
const StartContent_helper = shared_vars.defaultWrapComponent(<StartContent_lazy />);
const StartContent = () => StartContent_helper;

const JoinContent_lazy = React.lazy(() => import("./join"));
const JoinContent_helper = shared_vars.defaultWrapComponent(<JoinContent_lazy />);
const JoinContent = () => JoinContent_helper;

const WatchContent_lazy = React.lazy(() => import("./watch"));
const WatchContent_helper = shared_vars.defaultWrapComponent(<WatchContent_lazy />);
const WatchContent = () => WatchContent_helper;

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
	<div id="navOrTitleBar" />
	<div id="content" />
</React.Fragment>;

renderIn(toRender, 'root')

shared_vars.gotoPage[""]               = () => { shared_vars.allowUnload();   renderIn(navbar,   'navOrTitleBar'); renderIn(mainPageContent,        'content'); };
shared_vars.gotoPage["#rules_tag"]     = () => { shared_vars.allowUnload();   renderIn(navbar,   'navOrTitleBar'); renderIn(<RulesContent />,       'content'); };
shared_vars.gotoPage["#ack_tag"]       = () => { shared_vars.allowUnload();   renderIn(navbar,   'navOrTitleBar'); renderIn(<AcknowledgeContent />, 'content'); };
shared_vars.gotoPage["#submitted_tag"] = () => { shared_vars.allowUnload();   renderIn(navbar,   'navOrTitleBar'); renderIn(<SubmittedContent />,   'content'); };
shared_vars.gotoPage["#start_tag"]     = () => { shared_vars.preventUnload(); renderIn(titlebar, 'navOrTitleBar'); renderIn(<StartContent />,       'content'); };
shared_vars.gotoPage["#join_tag"]      = () => { shared_vars.preventUnload(); renderIn(titlebar, 'navOrTitleBar'); renderIn(<JoinContent />,        'content'); };
shared_vars.gotoPage["#watch_tag"]     = () => { shared_vars.preventUnload(); renderIn(titlebar, 'navOrTitleBar'); renderIn(<WatchContent />,       'content'); };

shared_vars.authenticHash = window.location.hash;
shared_vars.gotoPage[window.location.hash]();
