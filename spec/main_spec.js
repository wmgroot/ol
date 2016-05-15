var request = require('request');
var base_url = 'http://127.0.0.1:8081';
var app = require("../main.js")

describe('requests', function(){

  it('should work', function(){
    expect(1).toEqual(1);
  });

  describe('GET /businesses/:id', function(){

    it("returns status code 200 for an existing low id", function(done) {
      request.get(base_url + '/businesses/0', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns status code 200 for an existing high id", function(done) {
      request.get(base_url + '/businesses/49999', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns a code 404 error for a nonexistant negative id", function(done) {
      request.get(base_url + '/businesses/-1', function(error, response, body) {
        expect(response.statusCode).toBe(404);
        var json = JSON.parse(body);
        expect(json.message).toBe("Business not found!");
        expect(json.id).toBe(-1);
        done();
      });
    });

    it("returns a code 404 error for a nonexistant high id", function(done) {
      request.get(base_url + '/businesses/50000', function(error, response, body) {
        expect(response.statusCode).toBe(404);
        var json = JSON.parse(body);
        expect(json.message).toBe("Business not found!");
        expect(json.id).toBe(50000);
        done();
      });
    });

    it("returns a code 400 error for an invalid id", function(done) {
      request.get(base_url + '/businesses/abc', function(error, response, body) {
        expect(response.statusCode).toBe(400);
        var json = JSON.parse(body);
        expect(json.message).toBe("Invalid id given, must be an integer!");
        expect(json.id).toBe('abc');
        done();
      });
    });

    // format should match {“id”: 1,“name”: “...”,...}
    it("returns a properly formatted json body for an existing id", function(done) {
      request.get(base_url + '/businesses/100', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        var json = JSON.parse(body);
        expect(json.id).toBe('100');
        expect(json.uuid).toBe('4bbb6895-f5f9-4a5f-8d59-cd76327465cd');
        expect(json.name).toBe('Kerluke, Hilll and Schamberger');
        expect(json.address).toBe('0979 Mohr Cape');
        expect(json.address2).toBe('Suite 651');
        expect(json.city).toBe('Torphymouth');
        expect(json.state).toBe('NV');
        expect(json.zip).toBe('49681');
        expect(json.country).toBe('US');
        expect(json.phone).toBe('2215380340');
        expect(json.website).toBe('http://www.quigley-zboncak.com/');
        expect(json.created_at).toBe('2014-06-05 17:51:47');
        done();
      });
    });

  });

  describe('GET /businesses', function(){

    it("returns by default the first 50 businesses", function(done) {
      request.get(base_url + '/businesses', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        var json = JSON.parse(body);
        expect(json.businesses.length).toBe(50);
        expect(json.businesses[0].id).toBe('0');
        expect(json.businesses[json.businesses.length - 1].id).toBe('49');
        expect(json.page).toBe(0);
        expect(json.page_size).toBe(50);
        done();
      });
    });

    it("returns businesses by valid page number", function(done) {
      request.get(base_url + '/businesses?page=10', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        var json = JSON.parse(body);
        expect(json.businesses.length).toBe(50);
        expect(json.businesses[0].id).toBe('500');
        expect(json.businesses[json.businesses.length - 1].id).toBe('549');
        expect(json.page).toBe(10);
        expect(json.page_size).toBe(50);
        done();
      });
    });

    it("returns a 400 error for an invalid page number", function(done) {
      request.get(base_url + '/businesses?page=bacon', function(error, response, body) {
        expect(response.statusCode).toBe(400);
        var json = JSON.parse(body);
        expect(json.message).toBe("Invalid page number, must be an integer >= 0!");
        expect(json.page).toBe("bacon");
        done();
      });
    });

    it("return a 404 error for an out of range negative page number", function(done) {
      request.get(base_url + '/businesses?page=-1', function(error, response, body) {
        expect(response.statusCode).toBe(404);
        var json = JSON.parse(body);
        expect(json.message).toBe("Page number out of range!");
        expect(json.page).toBe(-1);
        done();
      });
    });

    it("return a 404 error for an out of range high page number", function(done) {
      request.get(base_url + '/businesses?page=10001', function(error, response, body) {
        expect(response.statusCode).toBe(404);
        var json = JSON.parse(body);
        expect(json.message).toBe("Page number out of range!");
        expect(json.page).toBe(10001);
        done();
      });
    });

    it("returns businesses for a small page size", function(done) {
      request.get(base_url + '/businesses?page_size=13', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        var json = JSON.parse(body);
        expect(json.businesses.length).toBe(13);
        expect(json.businesses[0].id).toBe('0');
        expect(json.businesses[json.businesses.length - 1].id).toBe('12');
        expect(json.page).toBe(0);
        expect(json.page_size).toBe(13);
        done();
      });
    });

    it("returns businesses for a large page size", function(done) {
      request.get(base_url + '/businesses?page_size=500000', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        var json = JSON.parse(body);
        expect(json.businesses.length).toBe(50000);
        expect(json.businesses[0].id).toBe('0');
        expect(json.businesses[json.businesses.length - 1].id).toBe('49999');
        expect(json.page).toBe(0);
        expect(json.page_size).toBe(500000);
        done();
      });
    });

    it("returns a 400 error for an invalid page size", function(done) {
      request.get(base_url + '/businesses?page_size=tamales', function(error, response, body) {
        expect(response.statusCode).toBe(400);
        var json = JSON.parse(body);
        expect(json.message).toBe("Invalid page size, must be an integer >= 1!");
        expect(json.page_size).toBe("tamales");
        done();
      });
    });

    it("returns businesses for a complicated page number and page size combo", function(done) {
      request.get(base_url + '/businesses?page=69&page_size=713', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        var json = JSON.parse(body);
        expect(json.businesses.length).toBe(713);
        expect(json.businesses[0].id).toBe('49197');
        expect(json.businesses[json.businesses.length - 1].id).toBe('49909');
        expect(json.page).toBe(69);
        expect(json.page_size).toBe(713);
        done();
      });
    });

    it("returns businesses on the last page for a complicated page number and page size combo", function(done) {
      request.get(base_url + '/businesses?page=70&page_size=713', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        var json = JSON.parse(body);
        expect(json.businesses.length).toBe(90);
        expect(json.businesses[0].id).toBe('49910');
        expect(json.businesses[json.businesses.length - 1].id).toBe('49999');
        expect(json.page).toBe(70);
        expect(json.page_size).toBe(713);
        done();
      });
    });

    it("returns a 404 error for a page number out of range with a custom page size", function(done) {
      request.get(base_url + '/businesses?page=71&page_size=713', function(error, response, body) {
        expect(response.statusCode).toBe(404);
        var json = JSON.parse(body);
        expect(json.message).toBe("Page number out of range!");
        expect(json.page).toBe(71);
        expect(json.page_size).toBe(713);
        done();
      });
    });

  });

  describe('misc routes', function(){
    
    it("returns a 404 error for an invalid URL", function(done) {
      request.get(base_url + '/', function(error, response, body) {
        expect(response.statusCode).toBe(404);
        expect(body).toBe("Invalid URL!");
        done();
      });
    });

    it("returns a 404 error for an invalid request type on a valid URL", function(done) {
      request.post(base_url + '/businesses', function(error, response, body) {
        expect(response.statusCode).toBe(404);
        expect(body).toBe("Invalid URL!");
        done();
      });
    });
  
  });

  it('should close the server', function(){
    app.closeServer();
  });

});
