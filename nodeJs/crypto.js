// const crypto = require('crypto');

// const secret = 'abcdefg';
// const hash = crypto.createHmac('sha256', secret)
//                    .update('I love cupcakes')
//                    .digest('hex');
// console.log(hash);

//－－Certificate－－－－

// const cert = require('crypto').Certificate();
// const spkac = getSpkacSomehow();
// const publicKey = cert.exportPublicKey(spkac);
// console.log(publicKey);



//Cipher:用于加密数据
// 作为stream，既可读又可写，未加密数据的编写是为了在可读的方面生成加密的数据，或者
// 使用cipher.update()和cipher.final()方法产生加密的数据。
// crypto.createCipher()或crypto.createCipheriv()方法用于创建Cipher实例。Cipher对象不能直接使用new关键字创建。

// const crypto = require('crypto');
// const cipher = crypto.createCipher('aes192', 'a password');

// let encrypted = '';
// cipher.on('readable', () => {
//   const data = cipher.read();
//   if (data)
//     encrypted += data.toString('hex');
// });
// cipher.on('end', () => {
//   console.log(encrypted);
//   // Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504
// });

// cipher.write('some clear text data');
// cipher.end();


// 以下出现乱码了。
// const crypto = require('crypto');
// const fs = require('fs');
// const cipher = crypto.createCipher('aes192', 'a password');

// const input = fs.createReadStream('test.js');
// const output = fs.createWriteStream('test.enc');

// input.pipe(cipher).pipe(output);

// 使用 update， final
// const crypto = require('crypto');
// const cipher = crypto.createCipher('aes192', 'a password');

// let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
// encrypted += cipher.final('hex');
// console.log(encrypted);



//------
const crypto = require('crypto');
const assert = require('assert');

// Generate Alice's keys...
const alice = crypto.createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));