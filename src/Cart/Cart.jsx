import React, {Component} from 'react';
import BookEntry from '../Catalog/BookEntry';

export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: props.cart ?? [],
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ books: nextProps.cart }); 
    }

    changeCart = (removeFlag, book) => {
        this.props.changeCart(removeFlag, book);
    }

    render = () =>
    <div className="cart">
        {this.state.books.map((book, index) => (
            <div className={index % 2 === 0 ? "bookContainer even" : "bookContainer odd"}>
                <button onClick={() => this.changeCart(true, book)}>Remove from Cart</button>
                <BookEntry key={index} index={index} book={book} changeCart={this.changeCart}></BookEntry>
            </div>
        ))}
        {(this.state.books === undefined || this.state.books.length == 0) && 
            <h3>Your Shopping cart is empty</h3>
        }
    </div>
}