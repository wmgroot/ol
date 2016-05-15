# ol
### Business data API Web Server running on NodeJS.

**Linux Environment Setup Instructions**
 1. `git clone git@github.com:wmgroot/ol.git`
 2. `cd ol`
 3. `sudo apt-get install nodejs`
 4. `export PATH=$PATH:/usr/local/nodejs/bin`
 5. `npm install express --save`
 6. `npm install csv-parse`

 **Mac Environment Setup Instructions**
 1. Download and install NodeJS from https://nodejs.org/en/download/
 2. `git clone git@github.com:wmgroot/ol.git`
 3. `cd ol`
 4. `npm install express --save`
 5. `npm install csv-parse`

**Spec Test Setup Instructions**
 1. `sudo npm install jasmine-node -g`
 2. `jasmine-node spec`

**Running the API Server**
 1. `node main.js`
 2. The application is hard coded to operate on port 8081. You can access the API by making requests to http://127.0.0.1:8081/

**Features**
 1. GET a business by id.
  * **Format:** /businesses/:id
  * **Example Request:** `curl http://127.0.0.1:8081/businesses/10`
  * **Example Response:** `{"id":"10","uuid":"3354fb84-3409-4708-b7fa-ddef7fd562c0","name":"Bashirian LLC","address":"7412 Thyra Estate Apt. 077","address2":"","city":"O'Haraberg","state":"FM","zip":"61847","country":"US","phone":"1366898018","website":"http://www.windler.info/","created_at":"2013-09-24 12:30:22"}`
 2. GET a list of businesses with optional pagination query parameters.
  * **Format:** /businesses?page=N&page_size=N
  * **Query Parameters**
    1. `page`, integer, optional, defaults to 0.
    2. `page_size`, positive integer, optional, defaults to 50.
  * **Example Request:** `curl 'http://127.0.0.1:8081/businesses?page=67&page_size=2'`
  * **Example Response:** `{"businesses":[{"id":"134","uuid":"13a36227-f98d-45f0-a286-98a104af18d5","name":"King, Krajcik and Emard","address":"473 Konopelski Flats Suite 902","address2":"","city":"Rosellaville","state":"PA","zip":"70176","country":"US","phone":"7706621881","website":"http://www.dibbert-weimann.com/","created_at":"2014-04-29 10:45:38"},{"id":"135","uuid":"c0b3872e-2ad6-48eb-a46b-9b7dda766c35","name":"Murray Ltd","address":"29633 Esther Ports","address2":"","city":"Heathcoteburgh","state":"CT","zip":"97744","country":"US","phone":"9869771079","website":"http://robel.net/","created_at":"2014-06-22 20:44:49"}],"page":67,"page_size":2}`
