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
        this.setState(state => {
            state.elems.push(<div id={description.id} className="popUp"><div>
                <h3>{description.title}</h3>
                <hr />
                <p>{shared_vars.intersperseWith(description.textLines || [], <br />)}</p>
                {description.btn && <button className="close" onClick={description.btn.onClick}>{description.btn.text}</button>}
            </div></div>);
            return state;
        });
        return this;
    };
    push(e) {
        this.setState(state => {
            state.elems.push(e);
            return state;
        });
        return this;
    };
    pop() {
        this.setState(state => {
            state.elems.pop();
            return state;
        });
        return this;
    };
    render() {
        return <div id="popUps">{this.state.children}</div>;
    };
};

export class Board extends React.Component {
    constructor(props) {
        super(props);
        this.done = props.done;
        props.done.ref = this;
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
                        <td id={row+col} className="square" style={{backgroundColor:(this.done.includes(row+col)?"#CC6600":"white")}}></td>
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

const listStyle = {minHeight: '70px', maxHeight: '-webkit-fill-available', background: '#fff', 
                   overflow: 'auto', border: 'solid black 3px', borderRadius: '10px',
                   listStyleType: 'none', margin: 0, padding: 0};

export class NiceList extends React.Component {
    constructor(props) {
        super(props);
        
        Object.assign(this.props.style, listStyle);
        
        this.state = {elems: []};
    };
    push(e) {
        this.setState(state => {
            state.elems.push(e);
            return state;
        });
    };
    remove(e) {
        this.setState(state => {
            shared_vars.removeFirstOccurrenceIn(e, state.elems);
            return state;
        });
    };
    render() {
        return <ul style={this.props.style}>
            {this.state.elems.slice().reverse().map((e, pos) => (
                <li style={{position:'relative', padding: '5px 10px'}}>
                    <div style={{background: ((pos % 2) ? '#eee' : '#fff'), width: 'calc(100% - 30px)', overflowWrap: 'break-word'}}>{e}</div>
                </li>
          ))}
        </ul>;
    };
};

export class ListWithCrosses extends NiceList {
    constructor(props) {
        super(props);
        
        Object.assign(this.props.style, listStyle);

        this.callback = this.props.callback.bind(this);
    };
    render() {
        return <ul style={this.props.style}>
            {this.state.elems.slice().reverse().map((e, pos) => (
                <li style={{position:'relative', padding: '5px 10px'}}>
                    <div style={{display: 'inline-block', float: 'right', fontSize: '40px', fontWeight: 'bold', padding: '10px', cursor: 'pointer',
                                position: 'absolute', right: 0, top: '-21px'}} onClick={() => this.callback(e, pos)}>&times;</div>
                    <div style={{background: ((pos % 2) ? '#eee' : '#fff'), width: 'calc(100% - 30px)', overflowWrap: 'break-word'}}>{e}</div>
                </li>
          ))}
        </ul>;
    };
};
