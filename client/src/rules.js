import React from 'react';

import * as shared_vars from './shared_vars';

import './css/rules.css';

export default class Rules extends shared_vars.ThemeDependentComponent {
    render() {
        let content = shared_vars.defaultLoading;
        const data = this.state.data;
        if (data) {
            content = <React.Fragment>
                <p>{shared_vars.intersperseWith(data.rules_preamble, shared_vars.twoNewLines)}</p>
                <div id="symbols">
                    {shared_vars.symbols.map(symbol => {
                        const sym = data[symbol];
                        return <div>
                            <div class="square"><img src={process.env.PUBLIC_URL+"/imgs/"+shared_vars.mutables.theme+"/"+symbol+sym.file_ext} /></div>
                            <p>{sym.name+": "+sym.description}</p>
                        </div>;}
                    )}
                </div>
                <p>{data.rules_footer}</p>
            </React.Fragment>;
        };
        return <div id="rulesContent" className="sometext">
            {content}
        </div>;
    };
};
