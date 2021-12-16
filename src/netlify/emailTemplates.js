exports.orderNotificationTemplate = (order, orderNumber) => {
return `
${(new Date()).toDateString()}
<br>From: ${order.shippingAddress.email}
<br>Subject: Order ${order.books.length} books
<br>
<br>SHIP TO:
<br>${order.shippingAddress.recipient_name}
<br>${order.shippingAddress.line1}
<br>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}
<br>
<br>PHONE:   ${order.shippingAddress.phone}
<br>Order Number:   ${orderNumber}
<br>PAYMENT:   ${order.paymentType}
<br>TOTAL (taxed):   $ ${order.totalTaxed}
<br>TOTAL (un-taxed):   $ ${order.totalUntaxed}
<br>
<br>MESSAGE: 
<br>${order.shippingAddress.message}
<br>
<br>Books in this order:
<pre>

${order.books.map((book) => 
    book.author + ' ' +
    book.title + ' ' +
    book.description + ' ' +
    book.ISBN + ' ' +
    book.price + '<br><br>'
    )}
</pre></i></b>`
}

exports.orderConfirmationTemplate = (order, orderNumber) => {
    return `
    <br>Thank you for your order of ${order.books.length} ${order.books.length === 1 ? 'book' : 'books'}
    <br>
    <br>Your order will be shipped to:
    <br>${order.shippingAddress.recipient_name}
    <br>${order.shippingAddress.line1}
    <br>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}
    <br>
    <br>PAYMENT:   ${order.paymentType}
    <br>Order Number:   ${orderNumber}
    <br>TOTAL (taxed):   $ ${order.totalTaxed}
    <br>TOTAL (un-taxed):   $ ${order.totalUntaxed}
    <br>
    <br>If you need to make a change to this order please contact Jan at: 763-753-3429 or <a href="mailto:bigt40@aol.com">Email</a>
    <br>
    <br>Books in this order:
    <pre>
    
    ${order.books.map((book) => 
        book.author + '. ' +
        book.title + '. ' +
        book.description + '. ' +
        book.ISBN + '. ' +
        book.price + '<br><br>'
        )}
    </pre></i></b>`
    }