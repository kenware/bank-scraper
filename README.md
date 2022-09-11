# bank-sraper
A node js service that scrape customer infomation

## Technologies
* Nodejs/Typescript
* Express
* Mongodb
* Mocha/chai
* Puppeteer
* xlsx
## Installation

* Ensure you are using node version 14
* On the root folder, install packages with
    ```
    npm install
    ```
* create `.env` file and add the following env variables. Replace with other values if neccesary. See `sample.env` for example

    ```
    MONGO_URL=mongodb+srv://okra_takehome:bHrZclVaxWkjwdM7@okra-takehome.nopar.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    MONGO_URL_TEST=<test mongo url>
    BANK_BASE_URL=https://bankof.okra.ng/login
    ```
* start server with `npm run watch` or `npm run forever` 
* Run test with `npm test`

# API documentaion
## Scrape, Formmat and Save with a single command

* On the root of the project, run the command bellow. It will `Srape` bank app, `formatt` the scraped data and `save` in the mongo collection with one command.

 ```
 npm run scrape --formatter=true --dbcommit=true --email=<email> --password=<password> --otp=<otp>
 ```
 NB:  You can replace email, password and otp with another users information(Gotten from account registration on https://bankof.okra.ng/register    ). This command saves both scraped data(`scraped-data-<date>.xlsx`) and formatted data(formatted-data-<date>.xlsx) as a excel file(`xlsx`) as it proceeds in the project root. 

Parameters 
```
   --formatter=true  => formatt scaped data
   --dbcommit=true  => save formatted data
   --password => user password from account creation
   --email => user email from account creation
```

## Step By Step data processing
* Step One: Scrape bank app. It will save an excel file with the format `scaped-data-<current date>.xlsx` in the root project. 

  Command:
    ```
    npm run scrape --email=<email> --password=<password> --otp=<otp>
    ```

* Step two: Formatt the scraped data. Start express server with this command. `npm run watch` or `npm run forever`. Grab the scraped data and make a POST request using form data. The API will process and formatt the scraped data and return an excel file(`xlsx`) as a response.

    ```
    REQUEST

    POST:  /api/v1/format/clean
    formData{
        file: <file>
    }

    RESPONSE
    <excel file>
    ```
    NB: The payload is a form-data with `file` as the field name.

* Step Three: Grab the formatted data and make a POST request to save the formatted data.
    ```
    REQUEST
    
    POST:  /api/v1/format/save
    formData{
        file: <file>
    }

    RESPONSE
    <excel file>
    ```
    NB: The payload is a form-data with `file` as the field name.

# Test
* npm test