import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { config } from 'dotenv';
import signTransaction from './sign.js';

config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


async function sendPost(body, quoteHex = "") {
    var endpoint, payload, res;
    const ROUTE = "https://bitclout.com/api/v0/";
    console.log("after route")
    body = body.replace(new RegExp("@", "g"), "@ ");
    payload = {
        UpdaterPublicKeyBase58Check: process.env.PUBKEY,
        BodyObj: { Body: body, ImageURLs: [] },
        RecloutedPostHashHex: quoteHex,
        IsHidden: false,
        MinFeeRateNanosPerKB: 1000
    };
    console.log("after route")

    endpoint = ROUTE + "submit-post";


    console.log(endpoint)
    console.log(payload)
    res = await axios.post(endpoint, payload)
    
        .then((res) => { if (res.status === 200) { return res.data } });

    const signedTxnHex = signTransaction(process.env.SEEDHEX, res.TransactionHex);

    endpoint = ROUTE + "submit-transaction";

    console.log(ROUTE)
    payload = { TransactionHex: signedTxnHex };
    res = await axios.post(endpoint, payload)
        .then((res) => { if (res.status === 200) { return res.data } });
    const URL = "https://bitclout.com/posts/" + res.TxnHashHex
    return URL;
}

app.use(bodyParser.json());

const keys = [];

app.post("/setPublicKey", (request, response) => {
    const { publicKey } = request.body;
    if (keys.indexOf(publicKey) === -1) {
        keys.push(publicKey);
        console.log(`${publicKey} logged in`);
        console.log("Someone logged in");
        response.send({ status: 200 });
    }
});

app.post("/postImage", (request, response) => {
    try {

    const { publicKey } = request.body;
    const { candy } = request.body;
    const { haulName } = request.body;
    const { haulImg } = request.body;

    if (keys.indexOf(publicKey) >= 0) {
        const pos = keys.indexOf(publicKey);
        keys.splice(pos, 1);


        {candy.map((item, index) => (
            item.quanity +"of"+item.itemName+", "
        ))}
            const candies=candy.map((item, index) => (item.quanity +"of"+item.itemName+", "))
            console.log(candies)
        const body = `This is ${haulName}s haul. It had ${candies} ${haulImg}`;
        sendPost(body)
            .then((u) => {
                response.send({ postUrl: u});
            });
    }
}catch(err){
    console.log(err)
}
});

// static files (build of your frontend)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(join(__dirname, 'frontend', 'build')));
    app.get('/*', (req, res) => {
        res.sendFile(join(__dirname, 'frontend', 'build', 'index.html'));
    })
}


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
