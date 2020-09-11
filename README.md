# crypto-csv

## Introduction

This is a Command Line Interface (CLI) coded in NodeJS to query for Bitcoin data and store it in a CSV file from some of the [BitMEX endpoints](https://testnet.bitmex.com/api/explorer/#!/Instrument/Instrument_get). It takes in a list of user inputs from the command line, queries BitMEX, and stores the query results in a Common Separated Value (CSV) file. You may refer to `walletHistory.csv` or `instrument.csv` for a sample CSV query result.

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

1. Create a `.env` file in the project folder with the following paramters:
```
API_KEY=[your BitMEX API key]
API_SECRET=[your BitMEX Secret key]
BASE_URL=[the intended BitMEX base URL e.g. https://testnet.bitmex.com]
```
These 3 parameters are mandatory to query BitMEX. Do not append base url with any slashes.

2. In the project folder, type:
```
npm start
```

## Example Use Case

### Query for the wallet balance

```
Please enter data endpoint: 
> user/walletHistory
Please enter query parameters by line (e.g. count: 50), hit enter in the new line to stop: 
> count: 50
> currency: XBt
>
Fetching data from https://testnet.bitmex.com/api/v1/user/walletHistory...
...
Successfully written data to walletHistory.csv.
Program closed.
```
Now you can retrieve the CSV data from `walletHistory.csv`.

### Query for individual instruments
```
Please enter data endpoint:
> instrument
Please enter query parameters by line (e.g. count: 50), hit enter in the new line to stop: 
> count: 50
> filter: {"state": "Open"}
> 
Fetching data from https://testnet.bitmex.com/api/v1/instrument?count=50&filter=%7B%22state%22:%20%22Open%22%7D...
Successfully fetched data from https://testnet.bitmex.com/api/v1/instrument?count=50&filter=%7B%22state%22:%20%22Open%22%7D.
...
Successfully written data to instrument.csv.
Program closed.
```
Now you can retrieve the CSV data from `instrument.csv`.

## Program Restrictions
1. It only work for BitMEX.com GET API.
2. Only columns with number or string values are included in the CSV. Columns with values of other types such as a nested list or map are excluded.