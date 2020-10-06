const express = require('express');
const {
    body,
    validationResult
} = require('express-validator');
const path = require('path');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const moment = require('moment');

const {
    json
} = require('body-parser');
dotenv.config();

const app = express();
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}))

const url = process.env.SHOP_URL1 + "/admin/api/2020-07/customers.json";
let base64Key = Buffer.from((process.env.SHOPIFY_API_KEY + ":" + process.env.SHOPIFY_ACCESS).toString(), 'binary').toString('base64');

const validation = [
    body('first_name').trim().escape(),
    body('last_name').isEmail(),
    body('email').trim().escape(),
    body('phone').trim().escape(),
    body('address').trim().escape(),
    body('country').trim().escape(),
    body('city').trim().escape(),
    body('province').trim().escape(),
    body('address_phone').trim().escape(),
    body('zip').trim().escape(),
    body('add_first_name').trim().escape(),
    body('add_last_name').trim().escape()
];

app.post('/submit', validation, (req, res) => {

    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const phone = req.body.phone;
    const address = req.body.address;
    const country = req.body.country;
    const city = req.body.city;
    const province = req.body.province;
    const address_phone = req.body.address_phone;
    const zip = req.body.zip;
    const add_first_name = req.body.add_first_name;
    const add_last_name = req.body.add_last_name;

    const new_customers = {
        customer: {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone": phone,
            "verified_email": true,
            "tags": "Singtel",
            "addresses": [{
                "address1": address,
                "city": city,
                "province": province,
                "phone": address_phone,
                "zip": zip,
                "last_name": add_first_name,
                "first_name": add_last_name,
                "country": country
            }],
        }
    }

    fetch(url, {
            headers: {
                "Authorization": 'Basic ' + base64Key,
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS
            },
            body: JSON.stringify(new_customers),
            method: 'post'
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            if (data.errors) {
                res.redirect("/");
            } else {
                res.redirect("/thank_you.html");
            }
        })
        .catch(err => {
            console.log(err);
        });

});


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, 'localhost', () => console.log(`Server started on port  http://localhost:${PORT}`));