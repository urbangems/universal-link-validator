var path = require('path');
var fs = require('fs');
var express = require('express');
var superagent = require('superagent');
var multer  = require('multer');
var plist = require('plist');
var extract = require('extract-zip');
var B = require('bluebird');
var checkDomain = require('./checkDomain');
var config = require('./config');
var childProcess = require('child_process');

var port = process.env.PORT || config.server.port || 3000;
var app = express();
var uploadDir = 'tmp-app-files';
var upload = multer({ dest: uploadDir });

app.use('/resources/universal-links/static', express.static('static'));
app.use('/resources/universal-links', express.static('static'));

app.post('/resources/universal-links/domain/:domain', function (httpReq, httpResp) {
    var domain = httpReq.params.domain;
    var bundleIdentifier = httpReq.query.bundleIdentifier;
    var teamIdentifier = httpReq.query.teamIdentifier;
    var respObj = { domains: { } };

    return checkDomain(domain, bundleIdentifier, teamIdentifier)
        .then(function(results) {
            respObj.domains[domain] = results;

            httpResp.status(200).json(respObj);
        })
        .catch(function(errorObj) {
            respObj.domains[domain] = { errors: errorObj };

            httpResp.status(400).json(respObj);
        });
});

var server = app.listen(port, function() {
    console.log('Server running on port ' + port);
});
