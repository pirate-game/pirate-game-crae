import React from 'react';
import ReactDOM from 'react-dom';

import * as shared_vars from './shared_vars';

import './css/GameThings.css';


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

export class Board extends React.Component {
    constructor() {
        super();
        this.state = {done: []};
    };
    squareDone(square) {
        this.setState(state => {
            state.done.push(square);
            return state;
        });
        return this;
    };
    render() {
        return <table id="board">
            <tr className="edge">
                <th className="edge"></th>
                <th className="edge">A</th>
                <th className="edge">B</th>
                <th className="edge">C</th>
                <th className="edge">D</th>
                <th className="edge">E</th>
                <th className="edge">F</th>
                <th className="edge">G</th>
            </tr>
            {["1","2","3","4","5","6","7"].map(col => (
                <tr className="edge">
                    <th className="edge">{col}</th>
                    {["A","B","C","D","E","F","G"].map(row => (
                        <td id={row+col} className="square" style={{backgroundColor:(this.state.done.includes(row+col)?"#CC6600":"white")}}></td>
                    ))}
                </tr>
            ))}
      </table>;
    };
};

export class CurrentSquare extends React.Component {
    constructor() {
        super();
        this.state = {currentSquare: "??"};
    };
    setCurrent(square) {
        this.setState({currentSquare: square});
        return this;
    };
    render() {
        return <div className="currentSquare">
            <h2>Current Square: {this.state.currentSquare}</h2>
        </div>;
    };
};
