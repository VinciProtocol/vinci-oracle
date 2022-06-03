# Vinci Oracle

## Setup

Requirements:

- npm

```
$ git clone git@github.com:VinciProtocol/vinci-oracle.git
$ cd vinci-oracle
$ npm i        # Install dependencies
```

Create a copy of the file `env.tmpl`, and name it `.env`.

Create a copy of the file `config.js.tmpl`, and name it `config.js`.


## Compile

```
npx hardhat compile
```

## Deployment

```
npx hardhat deploy:client --network localhost
npx hardhat deploy:collector --network localhost --nft BAYC
npx hardhat deploy:aggregator --network localhost --nft BAYC
```

## console

```
npx hardhat console --network network
```
