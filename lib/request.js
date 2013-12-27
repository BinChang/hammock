var Cookies = require('cookies');
var MockResponse = require('./response.js');
var http = require('http');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

/**
* Mock request object for sending to the router without needing a server.
**/
var MockRequest = function(options) {
  EventEmitter.call(this, options);

  this.body = '';
  this.url = options.url || '/';
  this.headers = this._headers = options.headers || {};
  this.headers['transfer-coding'] = 'chunked';

  this.method = options.method || 'GET';
  this.connection = {};
  // this.buffer = [];

  var cookieBuffer = [];

  _.forEach(_.keys(options.cookies || {}) ,function(key) {
    cookieBuffer.push(key + '=' + options.cookies[key]);
  });

  this.setHeader('cookie', cookieBuffer.join(';'));
};

util.inherits(MockRequest, EventEmitter);


MockRequest.prototype.setHeader = function(name, value, clobber) {
  if (http.ClientRequest) {
    var ret = http.ClientRequest.prototype.setHeader.call(this, name, value, clobber);
    this.headers = this._headers;
    return ret;
  }
  else if (clobber || !this.headers.hasOwnProperty(name)) {
    this.headers[name] = value;
  }
  else {
    this.headers[name] += ',' + value;
  }
};

MockRequest.prototype.getHeader = function(name) {
  if (http.ClientRequest) {
    return http.ClientRequest.prototype.getHeader.call(this, name);
  }
  else {
    return this.headers[name];
  }
};

MockRequest.prototype.pause = function() {};

MockRequest.prototype.resume = function() {};

MockRequest.prototype.write = function(str) {
  this.body += str;
}; 

MockRequest.prototype.end = function(str) {
  this.write(str);
  this.emit('data', new Buffer(this.body));
  this.emit('end');
};

module.exports = MockRequest;