var express = require('express');
var router = express.Router();
var qrCode = require('qrcode');

/* GET home page. */
router.get('/', async  function(req, res) {
  res.render('index', { title: 'Express'});
});

router.post('/createStaicQr', async  function(req, res) {
  staticQr = await generateQR(req.body.url);
  res.render('static_qr', { title: 'Express', qr:  staticQr});
});

router.post('/createDynamicQr', async  function(req, res) {
  shortUrl = await createOnRebrandly(req.body.url);
  console.log(shortUrl, "shortUrl");
  dynamicQr = await generateQR(shortUrl);
  console.log(dynamicQr, "dynamicQr");
  res.render('dynamic_qr', { title: 'Express', qr:  dynamicQr});
});

// With async/await
const generateQR = async text => {
  try {
    console.log(await qrCode.toDataURL(text))
    return await qrCode.toDataURL(text);
  } catch (err) {
    console.error(err)
    return err;
  }
}

const createOnRebrandly = (url) => {
  return new Promise((resolve, reject) => {
    var shortUrl = "";
    let request = require("request");
    let linkRequest = {
      destination: url,
      domain: { fullName: "rebrand.ly" }
      //, slashtag: "A_NEW_SLASHTAG"
      //, title: "Rebrandly YouTube channel"
    }
    
    let requestHeaders = {
      "Content-Type": "application/json",
      "apikey": "1bc83e0354bd4abeb27baecbe6402172",
    }
    
    request({
        uri: "https://api.rebrandly.com/v1/links",
        method: "POST",
        body: JSON.stringify(linkRequest),
        headers: requestHeaders
    }, (err, response, body) => {
      if (err) {
        reject(err);
      }
      let link = JSON.parse(body);
      shortUrl = link.shortUrl;
      resolve(shortUrl);
      console.log(`Long URL was ${link.destination}, short URL is ${link.shortUrl}`);
    })
  });
}

module.exports = router;
