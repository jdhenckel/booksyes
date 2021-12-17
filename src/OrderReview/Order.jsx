import React, { useState, useEffect } from 'react';
import Spinner from '../Spinner/Spinner';

export default function Order(props) {
    const [waiting, setWaiting] = useState();
    const order = props.order;

    const deleteOrder = () => {
        props.deleteOrder(order.orderNumber);
        setWaiting(true);
    }

    useEffect(() => {
        setWaiting(false);
    }, [props])

    return <details>
        <summary>
            <div>
                {order.shippingAddress.recipient_name}<br />
                {order.orderNumber}
            </div>
            <div>
                {order.dateString}
            </div>
            <div>
                {order.books.length} {order.books.length === 1 ? ' book': ' books'} <br />
                {waiting? 
                <Spinner loading={true} /> :
                <button onClick={deleteOrder} className={order.isDeleted ? 'deleted' : ''}>{order.isDeleted ? 'Deleted' : 'Delete'}</button>
                }
            </div>
        </summary>
        <div className='dropdown'>
            <div className='info'> 
                <div>
                    <div>Shipping Address:</div>
                    {order.shippingAddress.recipient_name}<br />
                    {order.shippingAddress.line1}<br />
                    {order.shippingAddress.city} {order.shippingAddress.state}, {order.shippingAddress.postal_code}
                </div>
                <div>
                    <div>Payment Information:</div>
                    Subtotal: {order.subtotal}<br />
                    Tax: {order.tax}<br />
                    Shiping cost: {order.shippingcost}<br />
                    Total (Taxed): {order.totalTaxed}<br />
                    Total (untaxed): {order.totalUntaxed}<br />
                    payment Type: {order.paymentType}<br />
                </div>
                <div>
                    <div>Message from the Buyer:</div>
                    {order.shippingAddress.message}
                </div>
            </div>
            <div className='booklist'>
                <ul>
                    {order.books.map((book, index) => 
                        <li key={index}><details>
                            <summary><div>{book.title} {book.author}</div><div>${book.price}</div></summary>
                            <div>
                                ISBN: {book.ISBN}<br />
                                <hr />
                                Description:<br />
                                {book.description}
                            </div>
                        </details></li>
                    )}
                </ul>
            </div>
            
        </div>
    </details>
}