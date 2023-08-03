"use strict";
exports.__esModule = true;
var ecdsa = require('ecdsa')
var crypto_1 = require("crypto");
const fs = require("fs");

var jwt = require('jsonwebtoken');

function signer(seckey, message, scheme) {
    if (scheme === void 0) { scheme = 'RSA-SHA256'; }
    var signer = crypto_1["default"].createSign(scheme);
    // Signing
    signer.write(message);
    signer.end();
    // Returns the signature in output_format: HexBase64Latin1Encoding which can be either 'binary', 'hex' or 'base64'
    return signer.sign(seckey, 'base64');
}
exports.signer = signer;
function verifier(pubkey, signature, method) {
    if (method === void 0) { method = 'RSA-SHA256'; }
    var verifier = crypto_1["default"].createVerify(method);
    // Verify the signature in supported formats ('binary', 'hex' or 'base64')
    return verifier.verify(pubkey, signature, 'base64');
}
exports.verifier = verifier;

function rsakeygen() {
    var _a = crypto_1["default"].generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: 'top secret'
        }
    }), publicKey = _a.publicKey, privateKey = _a.privateKey;
    return { publicKey: publicKey, privateKey: privateKey };
}
exports.rsakeygen = rsakeygen;

// Including publicKey and  privateKey from  
// generateKeyPairSync() method with its  
// parameters 
const keyPair = crypto_1.generateKeyPairSync('rsa', { 
        modulusLength: 520, 
        publicKeyEncoding: { 
            type: 'spki', 
            format: 'pem'
        }, 
        privateKeyEncoding: { 
        type: 'pkcs8', 
        format: 'pem', 
        cipher: 'aes-256-cbc', 
        passphrase: 'idea-fast'
        } 
});

console.log('asymmetric key pair using RSA with modulus length = 520');

// Creating public key file
fs.writeFileSync("public_key", keyPair.publicKey);
console.log("The RSA public key is: ", keyPair.publicKey.toString('base64')); 

fs.writeFileSync("private_key", keyPair.privateKey);
console.log("The RSA private key is: ", keyPair.privateKey.toString('base64')); 

const hash = crypto_1.createHash('sha256');
hash.update(keyPair.publicKey.toString('base64'));
const pubhash = hash.copy().digest('base64');
console.log("pubhash:", pubhash);

console.log('--------------------')

//create a signature from pubhash and private key from RSA
const sign = crypto_1.createSign('RSA-SHA256');
sign.update(pubhash);
const signature = sign.sign({
  key: keyPair.privateKey,
  passphrase: 'idea-fast'
}, 'base64');
console.log("Signature:", signature);


//verify the signature using pubkey
const verifier1 = crypto_1.createVerify('RSA-SHA256');
verifier1.update(pubhash);
console.log(verifier1.verify(keyPair.publicKey, signature, 'base64'));


const keyPair2 = crypto_1.generateKeyPairSync('rsa', { 
        modulusLength: 520, 
        publicKeyEncoding: { 
            type: 'spki', 
            format: 'pem'
        }, 
        privateKeyEncoding: { 
        type: 'pkcs8', 
        format: 'pem', 
        cipher: 'aes-256-cbc', 
        passphrase: 'idea-fast'
        } 
});


const verifier2 = crypto_1.createVerify('RSA-SHA256');
const pubkey2 = "-----BEGIN PUBLIC KEY-----\nMF0wDQYJKoZIhvcNAQEBBQADTAAwSQJCALWS3x9+Ne2q+nj5q254Cv8LnfEcA59N\ngbCZ9ffOO3dzxZmKk9fwvLir9C0l5ftpJhxQE4ZqHb7M1aHD1XtPYyM3AgMBAAE=\n-----END PUBLIC KEY-----\n";
const hash2 = crypto_1.createHash('sha256');
hash2.update(pubkey2);
const pubhash2 = hash2.copy().digest('base64');
console.log("pubhash2:", pubhash2);
const sig2 = "HABpLHZ+P64NplpbCw8uwPFTsGGuHIVkXfyXkelyZulLcMJQ4Ac/EOCJFXJzRaAIUYgEeO+ksV2Dc+1dnGdbOTA=";

verifier2.update(pubhash2);
console.log(verifier2.verify(pubkey2, sig2 , 'base64'));

console.log('------------------');


const keypairec = crypto_1.generateKeyPairSync('ec', {
  namedCurve: 'secp256k1',    // Options 
  publicKeyEncoding: { 
    type: 'spki', 
    format: 'der'
  }, 
  privateKeyEncoding: { 
    type: 'pkcs8', 
    format: 'der'
  } 
});
  
// Prints asymmetric key pair 
console.log('asymmetric key pair using Elliptic Curve secp256k1');
console.log("The secp256k1 public key is: ", keypairec.publicKey.toString('base64'));
console.log("The secp256k1 private key is: ", keypairec.privateKey.toString('base64'));

//create a signature from pubhash and private key from EC
var EC = require("elliptic").ec;
var ec = new EC("secp256k1");
var mySign = ec.sign(pubhash, keypairec.privateKey, {canonical: true});
console.log(mySign);

function tokengen(payload, secret, passphrase = 'idea-fast', algorithm = 'RS256', life = 1200) {
    // Asymmetric JWT is used by default by setting algorithm = RS256.
    let token;
    try {
        token = jwt.sign(payload,
            { key: secret, passphrase: passphrase },
            { algorithm: algorithm, expiresIn: life }
        );
    }
    catch(err){
        return err;
    }
    return token;
}	

function tokenverifier(token, secret) {
    let decoded = '';
    try {
        decoded = jwt.verify(token, secret);
    }
    catch(err){
        return err;
    }
    return decoded;
}

const payload = {
	publicKey: keyPair.publicKey,
	Issuer: 'IDEA-FAST DMP'
};

const token = tokengen(payload, keyPair.privateKey);
console.log("JWT encoded in base64: " + token);
const decodedToken = jwt.decode(token);
console.log("Pubkey in Token payload: ", decodedToken.publicKey);

const token2 = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJsaWNLZXkiOiItLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLVxuTUYwd0RRWUpLb1pJaHZjTkFRRUJCUUFEVEFBd1NRSkNBTVRGSGJ1dW85a3R6OGFOamJkZGROSEkvb3U5OGlJb1xud0VLUllVMU1DOE90Sjh3OC9nY0J3Nk1jTzJ1b1hRQnlhd2ZnRzljOVBOS3hCZFc3NDdrMXMwWmxBZ01CQUFFPVxuLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tXG4iLCJJc3N1ZXIiOiJJREVBLUZBU1QgRE1QIiwiaWF0IjoxNjA5NTEyNDU4LCJleHAiOjE2MDk1MTM2NTh9.t5iBcwxUMWNb2eeuP9xeCD0qkLgguXLl7VpCYgT9ihJLBDrFizQKO__eZzBv4WuZ5fvaoxwbBGwKawkfV8N0ipI";

const decodedPayload = jwt.decode(token2);
console.log("JWT decoded: " + JSON.stringify(decodedPayload));
const pubkeyPayload = decodedPayload.publicKey;
console.log("Pubkey in Token2 payload: ", pubkeyPayload);

const pubkeytemp = "-----BEGIN PUBLIC KEY-----\nMF0wDQYJKoZIhvcNAQEBBQADTAAwSQJCAMTFHbuuo9ktz8aNjbdddNHI/ou98iIo\nwEKRYU1MC8OtJ8w8/gcBw6McO2uoXQByawfgG9c9PNKxBdW747k1s0ZlAgMBAAE=\n-----END PUBLIC KEY-----\n";

jwt.verify(token2, pubkeytemp, function(err) {
    if (err) {
        console.log("Error: " + err);
        return null;
    }
    console.log("Verification sucessful!");
});


const keyPairNew = crypto_1.generateKeyPairSync('rsa', { 
        modulusLength: 520, 
        publicKeyEncoding: { 
            type: 'spki', 
            format: 'pem'
        }, 
        privateKeyEncoding: { 
        type: 'pkcs8', 
        format: 'pem', 
        cipher: 'aes-256-cbc', 
        passphrase: 'idea-fast'
        } 
});

const pubkeyGen = crypto_1.createPrivateKey({key: keyPairNew.privateKey, passphrase: 'idea-fast'});
  
console.log("Public key re-constructed from Private Key: ", pubkeyGen);
