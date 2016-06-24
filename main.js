var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var exports = module.exports = {'secret':'eggsandbacon'};


var fs = require('fs');
var csv_parser = require('csv-parse/lib/sync');

var raw_data;
var businesses;

app.get('/businesses/:id', function(request, response){
  console.log("request params: " + JSON.stringify(request.params));
  var _id = parseInt(request.params.id);

  if(isNaN(_id)){
    response.status(400).json({message: "Invalid id given, must be an integer!", id: request.params.id}).end();
  }
  else if(_id >= 0 && _id < businesses.length){
    response.json(businesses[_id]).end();
  }
  else{
    response.status(404).json({message: "Business not found!", id: _id}).end();
  }
})

app.get('/businesses', function(request, response){
  console.log("request query: " + JSON.stringify(request.query));
  var _page = request.query.page == null ? 0 : parseInt(request.query.page);
  var _page_size = request.query.page_size == null ? 50 : parseInt(request.query.page_size);

  if(isNaN(_page_size) || _page_size < 1){
    response.status(400).json({message: "Invalid page size, must be an integer >= 1!", page: request.query.page, page_size: request.query.page_size}).end();
  }
  else if(isNaN(_page)){
    response.status(400).json({message: "Invalid page number, must be an integer >= 0!", page: request.query.page, page_size: request.query.page_size}).end();
  }
  else if(_page < 0 || _page > businesses.length / _page_size){
    response.status(404).json({message: "Page number out of range!", page: _page, page_size: _page_size}).end();
  }
  else{
    response.json({businesses: getDataPage(_page, _page_size), page: _page, page_size: _page_size}).end();
  }
})

app.post('/authenticate', function(request, response){
console.log(request);
  console.log("request body: " + request.body);
  username = request.body.username;
  console.log(username);
})

app.all('*', function(request, response) {
  response.status(404).end("Invalid URL!");
});

function getDataPage(page, page_size){
  if(page == null) page = 0;
  if(page_size == null) page_size = 50;

  var start = page * page_size;
  var end = start + page_size;
  console.log("page contains #" + start + " to #" + (end - 1));
  
  if(start >= businesses.length) start = -1;
  if(end > businesses.length) end = businesses.length;

  return start >= 0 ? businesses.slice(start, end) : null;
}

app.set('superSecret', exports.secret);
var server = app.listen(8081, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log("loading raw data... ");
  raw_data = fs.readFileSync('./50k_businesses.csv', 'utf-8');
  console.log("converting data to json... ");
  businesses = csv_parser(raw_data, {columns: true});
  console.log("ready!");

  console.log('Application listening at http://127.0.0.1:8081/');
});

exports.closeServer = function(){
  server.close();
};

