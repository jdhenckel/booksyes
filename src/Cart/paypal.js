export function createPaypalOrder(order) {
    const booksAsItems = order.books.map((book) => {return {name: book.title, price: book.price}} );
    const key = 'My private and secret key';
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key,
    };

    var body = {
        'intent': 'order',
        'payer': {
            'payment_method': 'paypal'
        },
        'transactions': [
            {
                "amount": {
                    "total": order.total,
                    "currency": "USD",
                    "details": {
                        "subtotal": order.subtotal,
                        "tax": order.tax,
                        "shipping": order.shippingcost,
                    }
                },
                "description": "Order of " + order.books.length + " book(s) from Books Of Yesterday",
                "item_list": {
                    "items": booksAsItems,
                },
                "shipping_address": order.shippingAddress,
            }
        ]
    };

    return {headers: JSON.stringify(headers), body: JSON.stringify(body)}
}