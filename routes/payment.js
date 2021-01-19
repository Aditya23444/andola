const { Router } = require('express');
const { Transaction } = require('braintree');
const braintree = require('braintree');
const logger = require('debug');

const router = Router(); // eslint-disable-line new-cap
const debug = logger('braintree_example:router');
const TRANSACTION_SUCCESS_STATUSES = [
  Transaction.Status.Authorizing,
  Transaction.Status.Authorized,
  Transaction.Status.Settled,
  Transaction.Status.Settling,
  Transaction.Status.SettlementConfirmed,
  Transaction.Status.SettlementPending,
  Transaction.Status.SubmittedForSettlement,
];



gateway = new braintree.BraintreeGateway({
  environment:  braintree.Environment.Sandbox,
  merchantId:   '3g88v86crpw6vd4t',
  publicKey:    '73bmg8kpd6gzdfkv',
  privateKey:   '51ee222bd7031baf91813c979d69e8cb'
});

router.post('/clientToken/generate',(req,res) => {
  console.log(gateway)
  gateway.clientToken.generate({}).then(response => {
    const clientToken = response.clientToken
    res.send({
      message : "success",
      clientToken:clientToken
    })
  }).catch(err => {
    console.log(err,'err')
    res.send({
      message : "error",
      clientToken:err
    })
  });
})

router.post('/subscription/create',(req,res) =>{
  console.log(req.body.paymentMethodToken,req.body.planId,5555555555555)
  if(!req.body.planId ){
    res.send({ status: "error", message: "planId is empty!" });
    return;
  }
  if(!req.body.paymentMethodNonce ){
    res.send({ status: "error", message: "paymentMethodToken is empty!" });
    return;
  }
  gateway.customer.create({
    firstName: "Amit",
    lastName: "kumar",
    paymentMethodNonce: req.body.paymentMethodNonce
  }).then(result => {
    console.log(result,result.customer,result.customer.paymentMethods[0].token,'result,result.customer, result.customer.paymentMethods[0].token')

    gateway.transaction.sale({
      amount: "25.00",
      paymentMethodNonce: req.body.paymentMethodNonce,
      options: {
        submitForSettlement: true
      }
    }).then(()=> {

      const data = {
        paymentMethodToken: result.customer.paymentMethods[0].token,
        planId: req.body.planId
      }
      console.log(data,'dddaaatttaaaa',res)
      gateway.subscription.create({
        data
      }).then(res=> {
        console.log(res,'dddaaatttaaaa')
        res.send({
          message : "success",
          data:res
        })
      }).catch(err => {
        console.log(err,'err')
      })

    }).catch(err => {
      console.log(err,'err')
    })

  }).catch(err => {
    console.log(err,'eeeeeeeeee')
  })
});






router.post('/subscription/create/test',(req,res) =>{

  if(!req.body.planId ){
    res.send({ status: "error", message: "planId is empty!" });
    return;
  }
  if(!req.body.paymentMethodNonce ){
    res.send({ status: "error", message: "paymentMethodToken is empty!" });
    return;
  }



});


router.post('/address/update',(req,res) =>{
  const customer_id = req.body.customer_id;
  const address_id = req.body.address_id;
  gateway.address.update(customer_id, address_id, {
    firstName: "Jenna",
    lastName: "Smith",
    company: "Braintree",
    streetAddress: "1 E Main St",
    extendedAddress: "Suite 403",
    locality: "Chicago",
    region: "Illinois",
    postalCode: "60622",
    countryCodeAlpha2: "US"
  }).then(result => {
    res.send(result)
  }).catch(err => {
    console.log(err)
  })

});

router.post('/plans/all',(req,res) =>{
  gateway.plan.all().then(result => {
    res.send(result)
  }).catch(err => {
    console.log(err)
  })

});

router.post('/subscription/getById',(req,res) =>{
  const subscriptionId = req.body.subscriptionId
  gateway.subscription.find(subscriptionId).then(result => {
    res.send(result)
  }).catch(err => {
    console.log(err)
  })
});

router.post('/subscription/cancel',(req,res) =>{
  const subscriptionId = req.body.subscriptionId
  gateway.subscription.cancel(subscriptionId).then(result => {
    res.send(result)
  }).catch(err => {
    console.log(err)
  })
});




function formatErrors(errors) {
  let formattedErrors = '';

  for (let [, { code, message }] of Object.entries(errors)) {
    formattedErrors += `Error: ${code}: ${message}
`;
  }

  return formattedErrors;
}

function createResultObject({ status }) {
  let result;

  if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
    result = {
      header: 'Sweet Success!',
      icon: 'success',
      message:
        'Your test transaction has been successfully processed. See the Braintree API response and try again.',
    };
  } else {
    result = {
      header: 'Transaction Failed',
      icon: 'fail',
      message: `Your test transaction has a status of ${status}. See the Braintree API response and try again.`,
    };
  }

  return result;
}

router.get('/', (req, res) => {
  res.redirect('/checkouts/new');
});

router.get('/checkouts/new', (req, res) => {
  gateway.clientToken.generate({}).then(({ clientToken }) => {
    res.render('checkouts/new', {
      clientToken,
      messages: req.flash('error'),
    });
  });
});

router.get('/checkouts/:id', (req, res) => {
  let result;
  const transactionId = req.params.id;

  gateway.transaction.find(transactionId).then((transaction) => {
    result = createResultObject(transaction);
    res.render('checkouts/show', { transaction, result });
  });
});

router.post('/checkouts', (req, res) => {
  // In production you should not take amounts directly from clients
  const { amount, payment_method_nonce: paymentMethodNonce } = req.body;

  gateway.transaction
    .sale({
      amount,
      paymentMethodNonce,
      options: { submitForSettlement: true },
    })
    .then((result) => {
      const { success, transaction } = result;

      return new Promise((resolve, reject) => {
        if (success || transaction) {
          res.redirect(`checkouts/${transaction.id}`);

          resolve();
        }

        reject(result);
      });
    })
    .catch(({ errors }) => {
      const deepErrors = errors.deepErrors();

      debug('errors from transaction.sale %O', deepErrors);

      req.flash('error', { msg: formatErrors(deepErrors) });
      res.redirect('checkouts/new');
    });
});

module.exports = router;
