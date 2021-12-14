import React, { Component } from "react";
import BookEntry from "./BookEntry";
import CartButton from "./CartButton";
import "./Catalog.css";

export default class Catalog extends Component {
    constructor(props) {
        super (props);
        this.state = {
            books: props.books ?? [],
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ books: nextProps.books });  
    }
    
    changeCart = (removeFlag, book) => {
        this.props.changeCart(removeFlag, book);
    }

    render() {
        return(
            <div className="catalog">
                {(this.state.books === undefined || this.state.books.length === 0) && <h3>This query returned no results.</h3>}
                {this.state.books.map((b, index) => (
                    <div key={index} className={index % 2 === 0 ? "bookContainer even" : "bookContainer odd"}>
                        <CartButton clickCallback={(action) => this.changeCart(action, b)} />
                        <BookEntry  book={b}></BookEntry>
                    </div>
                ))}
            </div>
        );
    }
}