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

export default class Rules extends shared_vars.ThemeDependentComponent {
    render() {
        let content = shared_vars.defaultLoading;
        const data = this.state.data;
	console.log(data);
        if (data) {
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
                <p>{data.rules_footer}</p>
            </React.Fragment>;
	};
        return <div className="sometext" style={{backgroundColor:"lightblue"}}>
            {content}
        </div>;
    };
};
