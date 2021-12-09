import React, {Component} from 'react';
import axios from 'axios';
import './Cart.css';
import Popup from '../popup/popup.jsx';
import { PayPalButton } from 'react-paypal-button-v2';
import { debounce } from "lodash";

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
            useMnTax: true,
            isFormValid: false,
            paypalButtonActions: {},
        }

        this.onChangeEmailDebounce = debounce(this.validateEmail, 2000);
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

        if(name==="email") {
            this.onChangeEmailDebounce();
            this.state.paypalButtonActions && this.state.paypalButtonActions.disable();
        }
    }

    validateEmail = () => {
        if(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.state.address.email)) {
            this.setState({isFormValid: true});
            this.state.paypalButtonActions && this.state.paypalButtonActions.enable();
        } else {
            this.setState({isFormValid: false});
            this.state.paypalButtonActions && this.state.paypalButtonActions.disable();
            this.showPopupMessage('Unable to validate that email address.');
        }
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
        if(this.state.isFormValid) {
            var myOrder = this.state.order;
            myOrder.paymentType = "other (payment pending)";
            this.submitOrder(myOrder);
        } else {
            this.showPopupMessage("Please make sure your email is valid.")
        }
    }

    orderwithpaypal = (details, data) => {
        console.log(details);
        console.log(data);
        var myOrder = this.state.order;
        if(details.status === "COMPLETED") {
            myOrder.paymentType = "Paypal(Paid). Order Number: " + details.id;
            this.submitOrder(myOrder);
        } else {
            this.showPopupMessage(`There was a problem with your paypal payment.`);
        }
    }

    paypalOrderAmount = (taxed) => {
        return (taxed ? this.state.order.tax : 0) + this.state.order.subtotal + this.state.order.shippingcost
    }

    paypalInit = (data, actions) => {
        actions.disable();
        this.setState({paypalButtonActions: actions});
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
            if(myOrder.paymenttype === "other (payment pending)") {
                this.showPopupMessage("There was a problem placing you order.\nYou can try again or contact Jan directly to place an order.");
            } else {
                this.showPopupMessage(`There was a problem placing you order.\nYour PayPal payment was successful.\nPlease Contact Jan directly with this order number: ${myOrder.paymentType}`);
            }
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
        </div>}
        {this.state.showorder && <div className="address">
            <input value={this.state.address.recipient_name  || ''} name="recipient_name" onChange={this.handleChange} type="name" className="full" placeholder="Name" />
            <input value={this.state.address.phone || ''} name="phone" onChange={this.handleChange} type="tel" className="half" placeholder="Phone Number"/>
            <input value={this.state.address.email || ''} name="email" onChange={this.handleChange} type="email" className="half" placeholder="E-Mail Address" id='email'/>
            <input value={this.state.address.line1 || ''} name="line1" onChange={this.handleChange} type="street" className="full" placeholder="Street" />
            <input value={this.state.address.city || ''} name="city" onChange={this.handleChange} type="city" className="third" placeholder="City" />
            <input value={this.state.address.state || ''} name="state" onChange={this.handleChange} type="state" className="third" placeholder="State" />
            <input value={this.state.address.postal_code || ''} name="postal_code" onChange={this.handleChange} type="zip"  className="third" placeholder="Zip" />
        </div>}
        {this.state.showorder && <div className="message">
        <textarea value={this.state.address.message || ''} name="message" onChange={this.handleChange} placeholder="Message for Jan" />
        </div>}
        {this.state.showorder && <div className="buttons">
            <div>Include MN tax: <input type='checkbox' checked={this.state.useMnTax} onChange={(e) => this.setState({useMnTax: e.target.checked})} /></div>
            <PayPalButton   amount={this.paypalOrderAmount(this.state.useMnTax)} 
                            shippingPreference='NO_SHIPPING' 
                            onSuccess={(details, data) => this.orderwithpaypal(details, data)} 
                            onInit={(data, actions) => this.paypalInit(data, actions)}
                            style={{height: 25, layout: 'horizontal', color: 'blue', shape: 'rect', tagline: 'false'}} 
                            options={{clientId:this.state.order.clientId}} />
            <button disabled={!this.state.isFormValid} onClick={this.orderwithother}>Pay with other</button>   
        </div>}    
    </div>
}