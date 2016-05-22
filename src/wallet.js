
import crypto from 'crypto'

import bip39 from 'bip39'
import nacl_factory from 'js-nacl'
import bignum from 'browserify-bignum'

angular.module('wallet', [])
  .factory('wallet', () => {
    let nacl = nacl_factory.instantiate()

    return {
      mnemonicToData: (passphrase) => {
        if (!passphrase) {
          passphrase = bip39.generateMnemonic()
        }

        let hash = crypto.createHash('sha256').update(passphrase, 'utf8').digest()

        let kp = nacl.crypto_sign_keypair_from_seed(hash)
        let publicKey  = new Buffer(kp.signPk)
        let privateKey = new Buffer(kp.signSk)

        let getAddress = function (publicKey) {
          let hash = crypto.createHash('sha256').update(publicKey).digest()
          let temp = new Buffer(8)

          for (let i = 0; i < 8; i++) {
            temp[i] = hash[7 - i]
          }

          return bignum.fromBuffer(temp).toString() + 'L'
        }

        return {
          passphrase,
          hash: hash.toString('hex'),
          address: getAddress(publicKey),
          publicKey: publicKey.toString('hex'),
          privateKey: privateKey.toString('hex'),
          entropy: bip39.mnemonicToEntropy(passphrase),
          seed: bip39.mnemonicToSeedHex(passphrase),
        }
      },
      validateMnemonic: (mnemonic) => {
        return bip39.validateMnemonic(mnemonic)
      },
      randomBytes: crypto.randomBytes,
      entropyToMnemonic: bip39.entropyToMnemonic
    }
  })
