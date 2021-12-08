import React from "react";
import './popup.css';

const Popup = props => {
  return (
    <div className="popup-box" onClick={props.handleClose}>
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>x</span>
        {props.children}
      </div>
    </div>
  );
};
 
export default Popup;