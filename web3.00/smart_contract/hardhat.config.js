
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/cdOESDnoZrTJuyy-rMWxMGV8xhmTQcMM' ,
      accounts: ['be81ac4638472cd108133c97bc2073f421632dd0d4d1efcad98a0b04d8428159']
    }

  }
}