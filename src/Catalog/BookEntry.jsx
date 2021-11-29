import React, { Component } from "react";
import "./BookEntry.scss";
import newImage from "./new.gif";

class BookEntry extends Component {
    constructor(props) {
        super (props);
        this.state = {
            book: props.book ?? {},
        }
    }

    render() {
        return(
            <div className="bookentry">
                <div><input type="checkbox" name="13" value="x" /></div>
                <div>
                    <a href="isbn.cgi?a=0723237530" target="blank" title="Click to view picture in a new window">
                        <img src="http://images.amazon.com/images/P/0723237530.01.THUMBZZZ.jpg" /></a>
                </div>
                <div className="main">
                    <img src={newImage} />
                    <span className="author">Barker, Cicely Mary.</span>
                    <span className="title">FLOWER FAIRIES OF THE SPRING. </span>
                    Frederick Warne 1923, 2018. Hardcover with dust jacket. Ill. by Barker. 0723237530. Brand-New.
                    <span className="price">$5.</span>
                </div>
                <div>
                    <div className="caption">photo of the actual item</div>
                    <a href="pics.cgi?open=new_window&amp;p=i,DSC_7150" target="blank" title="Click to view pictures in a new window">
                        <img src="http://hosting.photobucket.com/images/g478/booksyes/DSC_7150.JPG" border="0" height="90" /></a>
                </div>
            </div>
        );
    }
}

export default BookEntry;