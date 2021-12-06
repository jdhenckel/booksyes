import React, {Component} from 'react';
import axios from 'axios';
import './Cart.css';
const paypalHelper = require('./paypal.js');

export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: props.cart ?? [],
            order: {},
            showorder: false,
            address: {},
        }
    }

    cartIsEmpty = () => (this.state.books === undefined || this.state.books.length === 0);

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
        axios.post("/.netlify/functions/getorder", { booklist: this.state.books })
        .then(response => {
            console.log(response.data);
            this.setState((state, props) => {
                return {
                    order: response.data.order,
                    showorder: true
                }
            });
        });
    }

    orderwithother = () => {

    }

    orderwithpaypal = (taxed) => {
        var myOrder = this.state.order;
        if(!taxed) myOrder.tax = 0;
        myOrder.total = myOrder.subtotal + myOrder.tax + myOrder.shippingcost;
        myOrder.shippingAddress = this.state.address;
        console.log(myOrder);
        var request = paypalHelper.createPaypalOrder(myOrder);
        console.log(request);
    }

    render = () =>
    <div className="order">
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
            <input value={this.state.address.email || ''} name="email" onChange={this.handleChange} type="email" className="full" placeholder="E-Mail Address"/>
            <input value={this.state.address.line1 || ''} name="line1" onChange={this.handleChange} type="street" className="full" placeholder="Street" />
            <input value={this.state.address.city || ''} name="city" onChange={this.handleChange} type="city" className="half" placeholder="City" />
            <input value={this.state.address.state || ''} name="state" onChange={this.handleChange} type="state" placeholder="State" />
            <input value={this.state.address.postal_code || ''} name="postal_code" onChange={this.handleChange} type="zip" placeholder="Zip" />
            <input value={this.state.address.country_code || ''} name="country_code" onChange={this.handleChange} type="country" className="half" placeholder="Country" />
        </div>}
        {this.state.showorder && <div className="buttons">
            <button onClick={() => this.orderwithpaypal(true)}>Pay with Paypal (MN Shipping)</button>
            <button onClick={() => this.orderwithpaypal(false)}>Pay with Paypal (Non-MN Shipping)</button>
            <button>Pay with other</button>
        </div>}
    </div>
}