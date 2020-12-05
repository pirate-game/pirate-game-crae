import React from 'react';
import ReactDOM from 'react-dom';

import * as shared_vars from './shared_vars';


export function sortByScore(results) {
    const out = results.slice();
    out.sort((a, b) => ((a.score < b.score) ? 1 : -1));
    return out;
};

export class PopUps extends React.Component {
    constructor() {
        super();
        
        this.state = { children: [] };
        
        this.clear = this.clear.bind(this);
        this.addPopUp = this.addPopUp.bind(this);
        this.pop = this.pop.bind(this);
    };
    clear() {
        this.setState({ children: [] });
        return this;
    };
    addPopUp(description) {
        /*this.setState({ 
            children: this.state.children.concat([
                <div id={description.id} className="popUp"><div>
                    <h3>{description.title}</h3>
                    <hr />
                    <p>{intersperseWith(description.textLines || [], <br />)}</p>
                    {description.btn && <button className="close" onClick={description.btn.onClick}>{description.btn.text}</button>}
                </div></div>
            ]) 
        });*/
        this.setState(state => {
            state.push(<div id={description.id} className="popUp"><div>
                <h3>{description.title}</h3>
                <hr />
                <p>{intersperseWith(description.textLines || [], <br />)}</p>
                {description.btn && <button className="close" onClick={description.btn.onClick}>{description.btn.text}</button>}
            </div></div>);
            return state;
        });
        return this;
    };
    pop() {
        this.setState(state => {
            state.pop();
            return state;
        });
        return this;
    };
    render() {
        return <div id="popUps">{this.state.children}</div>;
    };
};
