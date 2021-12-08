import React, {Component} from 'react';
import axios from 'axios';
import './Cart.css';
import Popup from '../popup/popup.jsx';

import paypalHelper from'./paypal.js';

export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: props.cart ?? [],
            order: {},
            showorder: false,
            address: {},
            showpopup: false,
            popupMessage: "",
            orderSuccess: false,
        }
    }

    cartIsEmpty = () => (this.state.books === undefined || this.state.books.length === 0);

    hidePopup = () => {
        this.setState({
            showpopup: false,
        });
    }

    showSuccessMessage = () => {
        const booksToRemove = [...this.state.books];
        booksToRemove.forEach((b) => this.changeCart(true, b));
        this.setState({
            showorder: false,
        });

        this.props.successCallback();
    }

    showPopupMessage = (message) => {
        this.setState({
            showpopup: true,
            popupMessage: message,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ books: nextProps.cart }); 
    }

    changeCart = (removeFlag, book) => {
        this.props.changeCart(removeFlag, book);
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            address: {
                ...this.state.address,
                [name]:value,
            }
        });
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
        axios.post("/.netlify/functions/getorder", { books: this.state.books })
        .then(response => {
            console.log(response.data);
            this.setState((state, props) => {
                return {
                    order: response.data.order,
                    showorder: true
                }
            });
        }).catch(error => console.log(error));
    }

    orderwithother = () => {
        var myOrder = this.state.order;
        myOrder.paymentType = "other (payment pending)";
        this.submitOrder(myOrder);
    }

    orderwithpaypal = (taxed) => {
        var myOrder = this.state.order;
        if(!taxed) myOrder.tax = 0;
        myOrder.paymenttype = "Paypal";
        myOrder.total = myOrder.subtotal + myOrder.tax + myOrder.shippingcost;
        var request = paypalHelper.createPaypalOrder(myOrder);
        console.log(request);
        //redirect to paypal screen
    }

    submitOrder = (order) => {
        var myOrder = order;
        myOrder.totalTaxed = myOrder.subtotal + myOrder.tax + myOrder.shippingcost;
        myOrder.totalTaxed = Math.round((myOrder.totalTaxed + Number.EPSILON) * 100) / 100;
        myOrder.totalUntaxed = myOrder.subtotal + myOrder.shippingcost;
        myOrder.shippingAddress = this.state.address;
        axios.post('/.netlify/functions/placeorder', {
            body: {order: order},
        }).then(response => {
            console.log(response);
            //Change screen to order success!
            this.showSuccessMessage();
        }).catch(error => {
            console.log(error);
            this.showPopupMessage("There was a problem placing you order.  You can try again or contact Jan directly to place an order.")
        })
    }

    render = () =>
    <div className="order">
        {this.state.showpopup && <Popup handleClose={this.hidePopup}>{this.state.popupMessage}</Popup> }
            {this.cartIsEmpty() && <h3 className="cart">Your Shopping cart is empty</h3>}
        <div className="cart">
            {!this.cartIsEmpty() && <div>
                 <button onClick={this.getOrder}>{this.state.showorder ? "Update Cart" : "Check out"}</button>
            </div>}
            {this.state.books.map((book, index) => (
                <div key={index} className={index % 2 === 0 ? "even" : "odd"}>
                    <button onClick={() => this.changeCart(true, book)}>Remove from Cart</button>
                    <div>{book.author}</div>
                    <div>{book.title}</div>
                    <div>{this.toCurrency(book.price)}</div>
                </div>
            ))}
            
        </div>
        {this.state.showorder && <div className="confirm">
            <div><div>Subtotal:</div><div>{this.toCurrency(this.state.order.subtotal)}</div></div>
            <div><div>Shipping:</div><div>{this.toCurrency(this.state.order.shippingcost)}</div></div>
            <div><div>MN Tax:</div><div>{this.toCurrency(this.state.order.tax)}</div></div>
            <div><div>Total (non-MN):</div><div>{this.toCurrency(this.state.order.subtotal + this.state.order.shippingcost)}</div></div>
            <div><div>Total (MN):</div><div>{this.toCurrency(this.state.order.subtotal + this.state.order.shippingcost + this.state.order.tax)}</div></div>
            <div><div>
                
            </div></div>
        </div>}
        {this.state.showorder && <div className="address">
            <input value={this.state.address.recipient_name  || ''} name="recipient_name" onChange={this.handleChange} type="name" className="full" placeholder="Name" />
            <input value={this.state.address.phone || ''} name="phone" onChange={this.handleChange} type="tel" className="half" placeholder="Phone Number"/>
            <input value={this.state.address.email || ''} name="email" onChange={this.handleChange} type="email" className="full" placeholder="E-Mail Address"/>
            <input value={this.state.address.line1 || ''} name="line1" onChange={this.handleChange} type="street" className="full" placeholder="Street" />
            <input value={this.state.address.city || ''} name="city" onChange={this.handleChange} type="city" className="half" placeholder="City" />
            <input value={this.state.address.state || ''} name="state" onChange={this.handleChange} type="state" placeholder="State" />
            <input value={this.state.address.postal_code || ''} name="postal_code" onChange={this.handleChange} type="zip" placeholder="Zip" />
            <div className="buttons">
            <button onClick={() => this.orderwithpaypal(true)}>Pay with Paypal (MN Tax)</button>
            <button onClick={() => this.orderwithpaypal(false)}>Pay with Paypal (No MN Tax)</button>
            <button onClick={this.orderwithother}>Pay with other</button>
        </div>
        </div>}
        {this.state.showorder && <div className="message">
        <textarea value={this.state.address.message || ''} name="message" onChange={this.handleChange} placeholder="Message for Jan" />
        </div>}
    </div>
}