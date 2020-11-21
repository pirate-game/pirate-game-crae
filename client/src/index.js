import React from 'react';
import ReactDOM from 'react-dom';

const navbar = <div>
  <ul>
    <li><button id="logo"><img border="0" src="logo.png" /></button></li>
		<li><button>Start&nbsp;a<br />Game</button></li>
		<li><button>Join&nbsp;a<br />Game</button></li>
		<li><button>Watch&nbsp;a<br />Game</button></li>
		<li><button>Acknowledgements</button></li>
	</ul>
	<h1 id="title">&nbsp;The&nbsp;Pirate&nbsp;Game&nbsp;</h1>
</div>;

const toRender = <div>{navbar}</div>;

ReactDOM.render(toRender, document.getElementById('root'));
