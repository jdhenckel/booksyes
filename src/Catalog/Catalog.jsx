import React, { Component } from "react";
import BookEntry from "./BookEntry";
import "./Catalog.css";

class Catalog extends Component {
    constructor(props) {
        super (props);
        this.state = {
            books: props.books ?? [],
        }
    }

    

    render() {
        return(
            <div className="catalog">
                <ul>
                    {/*{this.state.books.map((b) => (
                        <BookEntry key={b} book={b}></BookEntry>
                    ))}*/}
                    <BookEntry></BookEntry>
                    <BookEntry></BookEntry>
                    <BookEntry></BookEntry>
                    <BookEntry></BookEntry>
                </ul>
                
            </div>
        );
    }
}

export default Catalog;