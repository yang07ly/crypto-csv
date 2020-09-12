# crypto-csv

## Introduction

This is a NodeJS script to query for BitMEX user wallet history data from [BitMEX endpoints](https://testnet.bitmex.com/api/explorer/#!/Instrument/Instrument_get) and store it in a Common Separated Value (CSV) file.


## Author

Done by Yang Lu (yang07ly@gmail.com).


## Requirements

- npm >= 6
- node >= 12


## Setup

```
npm install
```


## Usage
```
npm start
```
Once the command is issued, the script will kick start. Upon successful completion, a CSV file `userWallet.csv` will be saved to the project root directory.


## Configuration Change

If you want to change the default configurations such as the target output CSV file name, you may manually change the code in `src/app.js`.