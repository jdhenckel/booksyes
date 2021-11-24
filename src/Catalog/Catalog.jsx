import React, { Component } from "react";
import BookEntry from "./BookEntry";

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
                    {this.state.books.map((b) => (
                        <BookEntry key={b} book={b}></BookEntry>
                    ))}
                </ul>
                
            </div>
        );
    }
}

export default Catalog;