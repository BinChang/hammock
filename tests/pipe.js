var test = require('tape');
var MockRequest = require('../index.js').Request;
var MockResponse = require('../index.js').Response;

var response = require('response')

function myHandlerFunc(req, res) {
    return response().txt('hi').pipe(res);
}

var mockRequest = MockRequest({
    url: '/hello'
});
var mockResponse = MockResponse();
myHandlerFunc(mockRequest, mockResponse);

mockResponse.on('end', function (err, data) {
    console.log("data.body:", data.body); // This is 'hihi' ?!?!
});