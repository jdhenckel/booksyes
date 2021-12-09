import axios from "axios";
import URL_  from 'url ';

const {PAYPAL_CLIENT_ID, PAYPAL_SECRET} = process.env

//get token
exports.getToken = () => {
    const clientID = PAYPAL_CLIENT_ID;
    const secret = PAYPAL_SECRET;

    const token = Buffer.from(`${clientID}:${secret}`, 'utf8').toString('base64');

    const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
    const data = new URL_.URLSearchParams({'grant_type': 'client_credentials'});

    axios.post(url, data.toString(), {
        headers: {
            'Authorization': `Basic ${token}`,
        }
    }).then(response => console.log(response));
}