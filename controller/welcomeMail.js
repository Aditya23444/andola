

 const sendMail = async (options) =>{


  const {to,subject,text} = options;
  const from = 'aditya@andola.in';

  AWS.config.update({
    "secretAccessKey": "ulKEqWDYz1mvMlkMXugU3yvV/hZspgQ3/D/vGsao",
    "accessKeyId": "AKIAZ7Q6I6SGNLEASXCV",
    "region": "ap-south-1"
  });

  const params = {
    Destination: {
      ToAddresses: [
        to
        /* more items */
      ]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: text
        },
        // Text: {
        //   Charset: 'UTF-8',
        //   Data: text
        // }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: from /* required */
    // ReplyToAddresses: [
    //   "EMAIL_ADDRESS"
    //   /* more items */
    // ]
  };

  const result = await new AWS.SES({ apiVersion: app.get('AWS')['SES'].apiVersion})
    .sendEmail(params)
    .promise();

  // console.log(result,'aaaqqqqqqqwwwwwwwww');
  return result;

};

module.exports = sendMail;
