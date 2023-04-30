const router = require("express").Router();
const dotenv =require('dotenv');

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", (req, res) => {
 
  const token=req.body.token;
  console.log(token);
  stripe.paymentIntents.create(
    {
      amount: req.body.amount*100,
      currency: "inr",
      payment_method_types: ['card'],
      description: `purchase of ${req.body.amount}`,
      shipping: {
        name: token.card.name,
        address: {
          city: token.card.address_city,
          country: token.card.address_country
        }
      }
    },

    async (stripeErr, stripeRes)=> {
      if (stripeErr) {
        console.log(stripeErr,"error has occured")
        res.status(500).json("error has occured");
      } else {
        
        stripe.paymentIntents.confirm(
          stripeRes.id,
          {payment_method: 'pm_card_visa'}
        ).then((stripeRes)=> {
           
            res.status(200).json(stripeRes);
        
        });
        
      }
    }
  );
});

module.exports = router;