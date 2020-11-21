import React from 'react';
import ReactDOM from 'react-dom';

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

const toRender = <React.Fragment>
	<div id="navortitlebar">{navbar}{titlebar}</div>
</React.Fragment>;

ReactDOM.render(toRender, document.getElementById('root'));
