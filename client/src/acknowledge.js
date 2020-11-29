import React from 'react';

import shared_vars from './shared_vars';

import './css/acknowledge.css';

export default class Acknowledge extends shared_vars.ThemeDependentComponent {
  render() {
	  let content = shared_vars.defaultLoading;
	  const data = this.state.data;
	  if (data) {
	  	content = <p style={{marginLeft:"4em", textIndent:"-4em"}}>
				Coming soon...
			</p>;
	  };
    return <React.Fragment>
        <div className="sometext" style={{backgroundColor:"lightblue"}}>
          <p style={{marginLeft:"4em", textIndent:"-4em"}}>We here at The Pirate Game would like to thank:<br />
            <a href="https://pages.github.com/">GitHub Pages</a> for originally hosting our lovely website<br />
	    <a href="https://www.heroku.com/home">Heroku</a> for hosting it in all its glory with Node.js etc.<br />
            <a href="https://formsubmit.io/">FormSubmit.io</a> for handling our forms<br />
            <a href="https://www.tes.com/teaching-resource/the-pirate-game-end-of-term-activity-6258063">paulcollins</a> for providing the idea for the Pirate Game and allowing us to use it under the Tes Classic Free Licence<br />
            <a href="https://www.tes.com/teaching-resource/the-pirate-game-square-picker-6437335">htmort</a> for providing the 'Square Picker' and allowing us to use it with attribution under the Creative Commons "Sharealike"<br />
          </p>
          {content}
          <p>
		If you believe that we are using any of this in error and would like us to change our website - or you have anything else you'd like to speak to us about - please contact us with the form below. You <b>do not</b> need to put your email address it will send fine with a fake one like "fake@fake" and <b>do not</b> send us your email address if you are not completely comfortable with our having it.
	  </p>
        </div>
        <br />
        <div id="theform" className="sometext" style={{backgroundColor:"pink"}}>
			    <form id="contactform" action="https://formsubmit.io/send/c0c7255c-0a38-4439-9a85-f5d3efa40665" method="POST">
				    <input name="_redirect" type="hidden" id="name" value="#submitted_tag" />
				    <div className="row">
    					<div className="col-25"><label>Name:</label></div>
					    <div className="col-75"><input name="name" type="text" id="theirname" /></div>
				    </div>
				    <div className="row">
    				  <div className="col-25"><label>Email Address:</label></div>
					    <div className="col-75"><input name="email" type="email" id="email" /></div>
				    </div>
				    <div className="row">
    				  <div className="col-25"><label>Message:</label></div>
					    <div className="col-75"><textarea name="comment" id="comment" rows="3" /></div>
				    </div>
    				<input name="_formsubmit_id" type="text" style={{display: "none"}} />
    				<input value="Submit" type="submit" />
				    <br />
			    </form>
		    </div>
      </React.Fragment>;
  };
};
