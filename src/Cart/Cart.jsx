import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';
import Popup from '../popup/popup.jsx';
import { PayPalButton } from 'react-paypal-button-v2';
import ReCAPTCHA from 'react-google-recaptcha';
import debounce from 'lodash.debounce';
import Spinner from '../Spinner/Spinner';

const RECAPTCHA_KEY = '6LerI6EdAAAAANsjsZnGhftz1zV03RsIee47LukQ';

export default function Cart(props) {
    const [books, setBooks] = useState(props.cart ?? []);
    const [order, setOrder] = useState({});
    const [showorder, setShoworder] = useState(false);
    const [address, setAddress] = useState({
        recipient_name: '',
        line1: '',
        city: '',
        state: '',
        postal_code: '',
        email: '',
    });
    const [touched, setTouched] = useState({
        recipient_name: false,
        line1: false,
        city: false,
        state: false,
        postal_code: false,
        email: false,
    });
    const [errors, setErrors] = useState({
        recipient_name: false,
        line1: false,
        city: false,
        state: false,
        postal_code: false,
        email: false
    });
    const [showpopup, setShowpopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [useMnTax, setUseMTax] = useState(true);
    const [isFormValid, setIsFormVaild] = useState(false);
    const [recaptchaToken, setRecaptchToken] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    
    const doValidation = () => {
        
        const captchaValid = validateRecaptcha();
        const addressValid = validateAddress();
        const allValid = captchaValid && addressValid;
       
        setIsFormVaild(allValid);
        return allValid;
    }

    const debouncedValidate = debounce(doValidation, 500);

    const cartIsEmpty = () => (books === undefined || books.length === 0);

    const hidePopup = () => {
        setShowpopup(false);
    }

    const showSuccessMessage = () => {
        const booksToRemove = [...books];
        booksToRemove.forEach((b) => changeCart(true, b));
        setShoworder(false);

        navigate("/success");
    }

    const showPopupMessage = (message) => {
        setShowpopup(true);
        setPopupMessage(message);
    }

    useEffect(() => {
        setBooks(books)
    }, [books])


    const changeCart = (removeFlag, book) => {
        props.changeCart(removeFlag, book);
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setAddress({
            ...address,
            [name]:value});
        setIsFormVaild(false);

        debouncedValidate();
    }

    const handleBlur = (event) => {
        const name = event.target.name;
        setTouched({
            ...touched,
            [name]: true,
        });

        debouncedValidate();
    }

    const shouldMarkError = (field) => {
        const hasError = errors[field];
        const isTouched = touched[field];
        return isTouched && hasError;
    }

    const validateAddress = () => {
        const isEmailValid = (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(address.email));
        
        setErrors({
            recipient_name: !address.recipient_name,
            line1:!address.line1,
            city:!address.city,
            state:!address.state,
            postal_code:!address.postal_code,
            email: !isEmailValid,
        });

        return !Object.keys(errors).some(x => errors[x])
    }

    const validateRecaptcha = () => {
        return true && recaptchaToken;
    }

    const paypalValidation = () => {
        if(!doValidation()) {
            showPopupMessage('Please complete all required fields');
            return;
        }
        setLoading(true);
    }

    const recaptchaOnChange = (value) => {
        setRecaptchToken(value);
    }

    const toCurrency = (num) => {
        return '$' + Number.parseFloat(num).toFixed(2)
    }

    const getOrder = () => {
        setLoading(true);
        //call the server with all the data and get a total
        axios.post("/.netlify/functions/getorder", { books: books })
        .then(response => {
            setOrder(response.data.order);
            setShoworder(true);
        }).catch(error => console.log(error))
        .finally(() => {
            setLoading(false);
        });
    }

    const orderwithother = () => {
        if(!doValidation()) {
            showPopupMessage('Please complete all required fields');
            return;
        }
        var myOrder = order;
        myOrder.paymentType = "other (payment pending)";
        submitOrder(myOrder);
    }

    const orderwithpaypal = (details, data) => {
        var myOrder = order;
        if(details.status === "COMPLETED") {
            myOrder.paymentType = "Paypal(Paid). Order Number: " + details.id;
            submitOrder(myOrder);
        } else {
            showPopupMessage(`There was a problem with your paypal payment.`);
        }
    }

    const paypalOrderAmount = (taxed) => {
        return (taxed ? order.tax : 0) + order.subtotal + order.shippingcost
    }

    const submitOrder = (order) => {
        var myOrder = order;
        myOrder.recaptchaToken = recaptchaToken;
        myOrder.totalTaxed = myOrder.subtotal + myOrder.tax + myOrder.shippingcost;
        myOrder.totalTaxed = Math.round((myOrder.totalTaxed + Number.EPSILON) * 100) / 100;
        myOrder.totalUntaxed = myOrder.subtotal + myOrder.shippingcost;
        myOrder.shippingAddress = address;
        setLoading(true);
        axios.post('/.netlify/functions/placeorder', {
            body: {order: order},
        }).then(response => {
            console.log(response);
            showSuccessMessage();
        }).catch(error => {
            console.log(error);
            window.grecaptcha.reset();
            showPopupMessage(`ERROR ${error.response.status}:\n${error.response.data}`);
        }).finally(() => {
            setLoading(false);
        })
    }


    return <div className="order">
        {showpopup && <Popup handleClose={hidePopup}><pre>{popupMessage}</pre></Popup> }
        {cartIsEmpty() && <h3 className="cart">Your Shopping cart is empty</h3>}
        
        <div className="cart">
            {!cartIsEmpty() && <div>
                 <button onClick={getOrder}>{showorder ? "Update Cart" : "Check out"}</button>
                 <Spinner loading={loading} />
            </div>}
            {books.map((book, index) => (
                <div key={index} className={index % 2 === 0 ? "even" : "odd"}>
                    <button onClick={() => changeCart(true, book)}>Remove from Cart</button>
                    <div>{book.author}</div>
                    <div>{book.title}</div>
                    <div>{toCurrency(book.price)}</div>
                </div>
            ))}
            
        </div>
        {showorder && <div className="confirm">
            <div><div>Subtotal:</div><div>{toCurrency(order.subtotal)}</div></div>
            <div><div>Shipping:</div><div>{toCurrency(order.shippingcost)}</div></div>
            <div><div>MN Tax:</div><div>{toCurrency(order.tax)}</div></div>
            <div>Include MN tax: <input type='checkbox' checked={useMnTax} onChange={(e) => setUseMTax(e.target.checked)} /></div>
            <div><div>Total:</div><div>{toCurrency(order.subtotal + order.shippingcost + (useMnTax ? order.tax : 0))}</div></div>
        </div>}
        {showorder && <form className="address">
            <input value={address.recipient_name  || ''} name="recipient_name"   onChange={handleChange} type="name"    className={`full  ${shouldMarkError('recipient_name') ? "error" : ""}`}onBlur={handleBlur} placeholder="Name" autocomplete="on" />
            <input value={address.phone || ''}           name="phone"            onChange={handleChange} type="tel"     className={`half  ${shouldMarkError('phone') ? "error" : ""}`}         onBlur={handleBlur} placeholder="Phone Number" autocomplete="on" />
            <input value={address.email || ''}           name="email"            onChange={handleChange} type="email"   className={`half  ${shouldMarkError('email') ? "error" : ""}`}         onBlur={handleBlur} placeholder="E-Mail Address" id='email' autocomplete="on" />
            <input value={address.line1 || ''}           name="line1"            onChange={handleChange} type="street"  className={`full  ${shouldMarkError('line1') ? "error" : ""}`}         onBlur={handleBlur} placeholder="Street" autocomplete="on" />
            <input value={address.city || ''}            name="city"             onChange={handleChange} type="city"    className={`third ${shouldMarkError('city') ? "error" : ""}`}          onBlur={handleBlur} placeholder="City" autocomplete="on" />
            <input value={address.state || ''}           name="state"            onChange={handleChange} type="state"   className={`third ${shouldMarkError('state') ? "error" : ""}`}         onBlur={handleBlur} placeholder="State" autocomplete="on" />
            <input value={address.postal_code || ''}     name="postal_code"      onChange={handleChange} type="zip"     className={`third ${shouldMarkError('postal_code') ? "error" : ""}`}   onBlur={handleBlur} placeholder="Zip" autocomplete="on" />
        </form>}
        {showorder && <div className="message">
            <textarea value={address.message || ''}      name="message"          onChange={handleChange} placeholder="Message for Jan" />
        </div>}
        {showorder && <div className={`buttons ${loading ? 'hidden' : ''}`}>
            <ReCAPTCHA onChange={recaptchaOnChange} sitekey={RECAPTCHA_KEY} />
            <small>Use Paypal to pay with a credit card.</small>
            <PayPalButton   amount={paypalOrderAmount(useMnTax)} 
                            shippingPreference='NO_SHIPPING'
                            disabled={!isFormValid}
                            onClick={paypalValidation}
                            onSuccess={(details, data) => orderwithpaypal(details, data)} 
                            style={{height: 25, layout: 'horizontal', color: 'blue', shape: 'rect', tagline: 'false'}} 
                            options={{clientId:order.clientId}} />
            <button onClick={orderwithother}>Pay by check or money order</button>
            
        </div>}    
    </div>
}