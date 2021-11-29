import React, { Component } from "react";
import "./BookEntry.scss";
import newImage from "./new.gif";
import noImage from "./noImage.jpg";

class BookEntry extends Component {
    constructor(props) {
        super (props);
        this.state = {
            book: props.book ?? {
                author: "Barker, Cicely Mary.",
                title: "FLOWER FAIRIES OF THE SPRING.",
                price: "5",
                isNew: false,
                imageSrc: "http://hosting.photobucket.com/images/g478/booksyes/DSC_7150.JPG",
                description:"Frederick Warne 1923, 2018. Hardcover with dust jacket. Ill. by Barker. 0723237530. Brand-New.",
                ISBN: "0723237530",
                dataAdded: "",
            },

            isbnImageLink: "",
        }

        if(this.state.book.ISBN) {
            this.state.isbnImageLink = "http://images.amazon.com/images/P/" + this.state.book.ISBN + ".01.THUMBZZZ.jpg";
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ book: nextProps.book });  
    }

    render() {
        return(
            <div className="bookentry">
                <div><input type="checkbox" name="13" value="x" /></div>
                <div>{this.state.book.ISBN && <img src={this.state.isbnImageLink} />}</div>
                <div className="main">
                    {this.state.book.isNew && <img src={newImage} />}
                    <span className="author">{this.state.book.author} </span>
                    <span className="title">{this.state.book.title} </span>
                    {this.state.book.description} {this.state.book.dateAdded}
                    <span className="price"> ${this.state.book.price} </span>
                </div>
                <div>
                    <div className="caption">photo of the actual item</div>
                    <a className={this.state.book.imageSrc == "undefined" ? "inactiveLink" : ""} href={this.state.book.imageSrc == "undefined" ? "" : this.state.book.imageSrc} target="_blank" rel="noopener noreferrer" title="Click to view pictures in a new window">
                    <img src={this.state.book.imageSrc != "undefined" ? this.state.book.imageSrc : noImage} border="0" height="90" /></a>
                </div>
            </div>
        );
    }
}

export default BookEntry;