import React, { Component } from "react";
import "./BookEntry.css";
import newImage from "../images/new.gif";
import noImage from "../images/noImage.jpg";

export default class BookEntry extends Component {
    constructor(props) {
        super (props);
        this.state = {
            book: props.book ?? {},
            imageLinks: [],
        }
    }

    componentWillReceiveProps(nextProps) {
        const links = this.makeImageLinks(nextProps.book.imageSrc);
        this.setState({
            book: nextProps.book,
            imageLinks: links,
        });
    }

    makeImageLinks = (imageSrc) => {
        var imageLinks = [];
        const names = imageSrc.split(',');
        
        for (let i = 0; i < names.length; i++) {
            const element = names[i];
            imageLinks.push('http://i1103.photobucket.com/albums/g478/booksyes/' + element + ".jpg");
        }
    
        return imageLinks;
    }

    render() {
        return(
            <div className="bookentry">
                <div>{this.state.book.ISBN && <img src={"http://images.amazon.com/images/P/" + this.state.book.ISBN + ".01.THUMBZZZ.jpg"} alt="example Book cover"/>}</div>
                <div className="main">
                    {this.state.book.isNew === "true" && <img id="newImage" src={newImage} alt="new!"/>}
                    <span className="author">{this.state.book.author} </span>
                    <span className="title">{this.state.book.title} </span>
                    {this.state.book.description} 
                    <span className="price"> ${this.state.book.price} </span>
                </div>
                <div>
                    <div className="caption">photo of the actual item</div>
                    <a className={this.state.imageLinks[0] !== "http://i1103.photobucket.com/albums/g478/booksyes/undefined.jpg" ? "" : "inactiveLink"} href={this.state.imageLinks[0] ? this.state.imageLinks[0] : "" } target="_blank" rel="noopener noreferrer" title="Click to view pictures in a new window">
                    <img className="realImage" src={this.state.imageLinks[0]} onError={(e) => {e.target.onerror = null; e.target.src=noImage}} border="0" alt="actual book cover"/></a>
                </div>
            </div>
        );
    }
}