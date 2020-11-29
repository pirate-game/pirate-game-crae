import React from 'react';

import shared_vars from './shared_vars';

import './css/acknowledge.css';

export default class Acknowledge extends React.Component {
  render() {
    return <React.Fragment>
        <div className="sometext" style={{backgroundColor:"lightblue"}}>
          <p style={{marginLeft:"4em", textIndent:"-4em"}}>We here at The Pirate Game would like to thank:<br />
            <a href="https://pages.github.com/">GitHub Pages</a> for originally hosting our lovely website<br />
	    <a href="https://www.heroku.com/home">Heroku</a> for hosting it in all its glory with Node.js etc.<br />
            <a href="https://formsubmit.io/">FormSubmit.io</a> for handling our forms<br />
            <a href="https://www.tes.com/teaching-resource/the-pirate-game-end-of-term-activity-6258063">paulcollins</a> for providing the idea for the Pirate Game and allowing us to use it under the Tes Classic Free Licence<br />
            <a href="https://www.tes.com/teaching-resource/the-pirate-game-square-picker-6437335">htmort</a> for providing the 'Square Picker' and allowing us to use it with attribution under the Creative Commons "Sharealike"<br />
          </p>
          <p style={{marginLeft:"4em", textIndent:"-4em"}}>And also 
				<a href="http://www.clker.com/">Clker</a>, 
				<a href="https://www.cleanpng.com/">Cleanpng</a>, 
				<a href="https://publicdomainvectors.org/">Publicdomainvectors</a> and 
				<a href="https://pixabay.com/">Pixabay</a> for the clip art etc.<br />
				The Pirate image was taken from <a href="https://www.cleanpng.com/png-piracy-cartoon-drawing-clip-art-pirate-722951/">Cleanpng</a><br />
 				The Chest image was by <a href="https://pixabay.com/users/OpenClipart-Vectors-30363/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=153593">OpenClipart-Vectors</a> from <a href="https://pixabay.com/vectors/booty-chest-gold-pirate-treasure-153593/">Pixabay</a><br />
				The Kraken image was by <a href="https://pixabay.com/users/fantasticpicture-1560299/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3189017">Michael Seibt</a> from <a href="https://pixabay.com/illustrations/sea-ocean-nature-sky-ship-octopus-3189017/">Pixabay</a><br />
				The Bomb image was by <a href="https://pixabay.com/users/OpenClipart-Vectors-30363/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2025548">OpenClipart-Vectors</a> from <a href="https://pixabay.com/vectors/bomb-cartoon-iconic-2025548/">Pixabay</a><br />
				The Copyright logo was taken from <a href="https://www.cleanpng.com/png-copyright-symbol-copyright-law-of-the-united-state-1052540/">Cleanpng</a><br />
				The Cutlass image was taken from <a href="https://publicdomainvectors.org/en/free-clipart/Cutlass-cartoon-image/81507.html">Publicdomainvectors</a><br />
				The Mirror image was taken from <a href="https://www.cleanpng.com/png-mirror-dragon-deviantart-hand-mirror-3520099/">Cleanpng</a><br />
				The Parrot image was taken from <a href="https://www.cleanpng.com/png-pirate-parrot-royalty-free-cartoon-logo-1252826/">Cleanpng</a><br />
				The Present image was taken from <a href="https://www.cleanpng.com/png-emoji-gift-emoticon-symbol-sms-present-box-1177524/">Cleanpng</a><br />
				The Pirate Ship image was taken from <a href="https://www.cleanpng.com/png-ship-piracy-clip-art-pirate-722920/">Cleanpng</a><br />
				The Shield image was taken from <a href="http://www.clker.com/clipart-magic-shield-no-shadow.html">Clker</a><br />
				The Swap image was taken from <a href="https://www.cleanpng.com/png-clothing-swap-computer-icons-clip-art-arrow-789742/">Cleanpng</a><br />
	  </p>
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
