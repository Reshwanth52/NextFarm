const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (request, response, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: request.body.amount,
    currency: "inr",
    metadata: {
      company: "NextFarm",
    },
  });
  response
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (request, response, next) => {
  response.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});
