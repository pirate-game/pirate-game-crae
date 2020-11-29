import React from 'react';

import shared_vars from './shared_vars';

function intersperseWith(array, element) {
    const len = array.length;
    if (len) {
        let out = [array[0]];
        for (let i = 1; i < len; ++i) { // it is meant to start at 1, so that the first element is missed
            out = out.concat([element, array[i]]);
        };
        return out;
    } else {
        return array;
    };
};

export default class Rules extends React.Component {
    constructor() {
        super();
        this.state = { data: null };
        this.updateTheme();
    };
    updateTheme() {
        const theme = shared_vars.theme;
        import(process.env.PUBLIC_URL+'/imgs/'+theme+'/names_etc').then(d => {
            if (shared_vars.theme == theme) {
                this.setState({ data: d });
            };
        });
    };
    render() {
        let content = null;
        const data = this.state[data];
        if (data === null) {
            content = shared_vars.defaultLoading;
        } else {
            content = <React.Fragment>
                <p>{intersperseWith(data.rules_preamble, <React.Fragment><br /><br /></React.Fragment>)}</p>
                <div id="symbols">
                    {shared_vars.symbols.map(symbol => {
                        const sym = data[symbol];
                        return <div>
					<div class="square"><img src={process.env.PUBLIC_URL+"/imgs/"+shared_vars.theme+"/"+symbol+sym.file_ext} /></div>
					<p>{sym.name+": "+sym.description}</p>
		        	</div>;}
                        )}
                </div>
                <p>The winner is the pirate whose final CASH and Bank balance total the most.</p>
            </React.Fragment>;
        };
        return <div className="sometext" style={{backgroundColor:"lightblue"}}>
            {content}
        </div>;
    };
};
