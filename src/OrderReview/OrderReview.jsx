import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from '../popup/popup.jsx';
import Order from './Order.jsx';
import './OrderReview.css';


export default function OrderReview(props) {
    const [password, setPassword] = useState('');
    const [showDeleted, setShowDeleted] = useState(false);
    const [orders, setOrders] = useState([]);
    const [showpopup, setShowpopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const handleChange = (e) => {
        if(e.target.name === 'password') setPassword(e.target.value);
        if(e.target.name === 'showdeleted') setShowDeleted(e.target.checked);
    };

    const getOrders = () => {
        axios.post(`/.netlify/functions/revieworders?action=view${showDeleted ? '&showDeleted=true' : ''}`, { pass: password })
            .then(res => {
                setOrders(res.data);
            }).catch(error => {
                showPopupMessage(`ERROR ${error.response.status}:\n${error.response.data}`);
                setPassword('');
            })
    }

    const showPopupMessage = (message) => {
        setShowpopup(true);
        setPopupMessage(message);
    }

    const hidePopup = () => {
        setShowpopup(false);
    }

    const deleteOrder = (orderNumber) => {
        axios.post(`/.netlify/functions/revieworders?action=delete&orderNumber=${orderNumber}`, {pass: password})
        .then(() => {
            getOrders();
        })
        .catch(error => {
            showPopupMessage(`ERROR ${error.response.status}:\n${error.response.data}`);
        })
    }

    return <div className='OrderReview'>
        {showpopup && <Popup handleClose={hidePopup}><pre>{popupMessage}</pre></Popup>}
        <div>
            <input onChange={handleChange} value={password} type="password" placeholder='Password' name='password' />
            <button onClick={getOrders}>Review Orders</button>
            Show Deleted: <input type='checkbox' onChange={handleChange} name='showdeleted' />
        </div>
        {orders.length !== 0 ? orders.map((order, index) => 
            <Order order={order} key={index} deleteOrder={(orderNumber) => deleteOrder(orderNumber)} />
        ): <h3>No orders.  Use "show deleted" to see deleted orders.</h3>}
    </div>
}