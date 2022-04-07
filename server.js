const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const stripe = require('stripe')('sk_test_51KlVgsJ2b9yJrc0Q3J6nFT1T6jPUqHjbJQDFdGAHB5qWQ5qOImsJM23CknKZnub1toe9zpqqbDV84br8A0yS9CbE00piUcrkEP')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, './views')));

app.get('/', (req,res) => {
	res.render('index.html');
})

app.post('/charge', (req, res) => {
    try {
        stripe.customers.create({
            name: req.body.name,
            email: req.body.email,
            source: req.body.stripeToken
        }).then(customer => stripe.charges.create({
            amount: req.body.amount * 100,
            currency: 'usd',
            customer: customer.id,
            description: 'Thank you for your generous donation.'
        })).then(() => res.render('complete.html'))
            .catch(err => console.log(err))
    } catch (err) { res.send(err) }
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log('Server is running...'))