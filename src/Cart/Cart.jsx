import React, {Component} from 'react';
import './Cart.css';

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
    <div>
        <div className="cart">
            {this.state.books.map((book, index) => (
                <div className={index % 2 === 0 ? "even" : "odd"}>
                    <button onClick={() => this.changeCart(true, book)}>Remove from Cart</button>
                    <div>{book.author}</div>
                    <div>{book.title}</div>
                    <div>{book.price}</div>
                </div>
            ))}
        </div>
        
        {(this.state.books === undefined || this.state.books.length == 0) && 
            <h3>Your Shopping cart is empty</h3>
        }
    </div>
}