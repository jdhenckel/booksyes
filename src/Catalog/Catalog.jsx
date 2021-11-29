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

    componentWillReceiveProps(nextProps) {
        this.setState({ books: nextProps.books });  
    }
    

    render() {
        return(
            <div className="catalog">
                <ul>
                    {this.state.books.map((b) => (
                        <BookEntry key={b.id} book={b}></BookEntry>
                    ))}
                </ul>
                
            </div>
        );
    }
}

export default Catalog;