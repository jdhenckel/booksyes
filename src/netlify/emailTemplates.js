exports.orderNotificationTemplate = (order) => {
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
<br>PAYMENT:   ${order.paymentType}
<br>TOTAL (taxed):   $ ${order.totalTaxed}
<br>TOTAL (un-taxed):   $ ${order.totalUntaxed}
<br>
<br>MESSAGE: 
<br>${order.shippingAddress.message}
<br>
<pre>
======== START OF BOOK LIST =========

${order.books.map((book) => 
    book.author + '. ' +
    book.title + '. ' +
    book.description + '. ' +
    book.ISBN + '. ' +
    book.price + '<br><br>'
    )}
======== END OF BOOK LIST =========
</pre></i></b>`
}

exports.orderConfirmationTemplate = (order) => {
    return `
    <br>Thank you for your order of ${order.books.length} ${order.books.length === 1 ? 'book' : 'books'}
    <br>
    <br>Your order will be shipped to:
    <br>${order.shippingAddress.recipient_name}
    <br>${order.shippingAddress.line1}
    <br>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}
    <br>
    <br>PAYMENT:   ${order.paymentType}
    <br>TOTAL (taxed):   $ ${order.totalTaxed}
    <br>TOTAL (un-taxed):   $ ${order.totalUntaxed}
    <br>
    <br>If you need to make a change to this order please contact Jan at: phone? email?
    <br>
    <br>
    <pre>
    ======== START OF BOOK LIST =========
    
    ${order.books.map((book) => 
        book.author + '. ' +
        book.title + '. ' +
        book.description + '. ' +
        book.ISBN + '. ' +
        book.price + '<br><br>'
        )}
    ======== END OF BOOK LIST =========
    </pre></i></b>`
    }