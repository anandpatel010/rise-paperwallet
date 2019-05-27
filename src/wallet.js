import crypto from 'crypto'
import bip39 from 'bip39'
import {Rise} from 'dpos-offline'
//import {RiseV2} from 'dpos-offline' for future address format change

angular.module('wallet', [])
  .factory('wallet', () => {

    return {
      mnemonicToData: (passphrase) => {
        if (!passphrase) {
          passphrase = bip39.generateMnemonic();
        }
        let publicKey = Rise.deriveKeypair(passphrase).publicKey.toString('hex');
        let privateKey = Rise.deriveKeypair(passphrase).privateKey.toString('hex');
        let address = Rise.calcAddress(Rise.deriveKeypair(passphrase).publicKey);

        return {
          passphrase,
          passphraseqr: passphrase,
          address: address,
          addressqr: address,
          publicKey: publicKey,
          privateKey: privateKey,
          entropy: bip39.mnemonicToEntropy(passphrase),
        };
      },
      validateMnemonic: (mnemonic) => {
        return bip39.validateMnemonic(mnemonic)
      },
      randomBytes: crypto.randomBytes,
      entropyToMnemonic: bip39.entropyToMnemonic
    }
  })
