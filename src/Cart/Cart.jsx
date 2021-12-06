import React, {Component} from 'react';
import axios from 'axios';
import './Cart.css';

export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: props.cart ?? [],
            order: {},
            showorder: false
        }
    }

    cartIsEmpty = () => (this.state.books === undefined || this.state.books.length === 0);

    componentWillReceiveProps(nextProps) {
        this.setState({ books: nextProps.cart }); 
    }

    changeCart = (removeFlag, book) => {
        this.props.changeCart(removeFlag, book);
    }

    orderSubtotal = () => {
        var totalCost = 0;
        this.state.books.forEach(b => {
            totalCost += Number.parseFloat(b.price);
        });

        return totalCost;
    }

    toCurrency = (num) => {
        return '$' + Number.parseFloat(num).toFixed(2)
    }

    getOrder = () => {
        //call the server with all the data and get a total
        axios.post("/.netlify/functions/getorder",
            { // body
                booklist: this.state.books,
            }
          ).then(response => {
            console.log(response.data);
            this.setState((state, props) => {
                return {
                  order: response.data.order,
                  showorder: true
                };
              });
          });
    }

    render = () =>
    <div className="order">
        <div className="cart">
            {this.cartIsEmpty() && 
                <h3>Your Shopping cart is empty</h3>}
            {this.state.books.map((book, index) => (
                <div className={index % 2 === 0 ? "even" : "odd"}>
                    <button onClick={() => this.changeCart(true, book)}>Remove from Cart</button>
                    <div>{book.author}</div>
                    <div>{book.title}</div>
                    <div>{this.toCurrency(book.price)}</div>
                </div>
            ))}
            <div>
                {!this.cartIsEmpty() && <button onClick={this.getOrder}>{this.state.showorder ? "Update Cart" : "Check out"}</button>}
            </div>
        </div>
        {this.state.showorder && <div className="confirm">
            <div><div>Subtotal:</div><div>{this.toCurrency(this.state.order.subtotal)}</div></div>
            <div><div>Shipping:</div><div>{this.toCurrency(this.state.order.shippingcost)}</div></div>
            <div><div>MN Tax:</div><div>{this.toCurrency(this.state.order.tax)}</div></div>
            <div><div>Total (non-MN):</div><div>{this.toCurrency(this.state.order.subtotal + this.state.order.shippingcost)}</div></div>
            <div><div>Total (MN):</div><div>{this.toCurrency(this.state.order.subtotal + this.state.order.shippingcost + this.state.order.tax)}</div></div>
            <div><div><button>Pay with Paypal</button><button>Pay with other</button></div></div>
        </div>}
    </div>
}