
import crypto from 'crypto';

import bip39 from 'bip39';
import nacl_factory from 'js-nacl';
import bignum from 'browserify-bignum';

let nacl = nacl_factory.instantiate();

window.LiskWallet = (secret) => {
  if (!secret) {
    secret = bip39.generateMnemonic();
  }

  let hash = crypto.createHash('sha256').update(secret, 'utf8').digest();

  let kp = nacl.crypto_sign_keypair_from_seed(hash);
  let publicKey  = new Buffer(kp.signPk);
  let privateKey = new Buffer(kp.signSk);

  let getAddress = function (publicKey) {
    let hash = crypto.createHash('sha256').update(publicKey).digest();
    let temp = new Buffer(8);

    for (let i = 0; i < 8; i++) {
      temp[i] = hash[7 - i];
    }

    return bignum.fromBuffer(temp).toString() + 'L';
  }

  return {
    secret,
    hash: hash.toString('hex'),
    address: getAddress(publicKey),
    publicKey: publicKey.toString('hex'),
    privateKey: privateKey.toString('hex'),
  };
};

window.LiskWallet.generateMnemonic = () => {
  return bip39.generateMnemonic();
};

window.LiskWallet.validateMnemonic = (mnemonic) => {
  return bip39.validateMnemonic(mnemonic);
};
