// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Create web server
http.createServer(function(request, response) {
    var path = url.parse(request.url, true).pathname;
    var query = url.parse(request.url, true).query;
    var method = request.method;

    if (path === '/comments' && method === 'GET') {
        fs.readFile('./comments.json', function(err, data) {
            if (err) {
                response.writeHead(404);
                response.end('Not Found');
                return;
            }
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            response.end(data);
        });
    }

    if (path === '/comments' && method === 'POST') {
        var body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            fs.readFile('./comments.json', function(err, data) {
                if (err) {
                    response.writeHead(404);
                    response.end('Not Found');
                    return;
                }
                var comments = JSON.parse(data);
                comments.comments.push({
                    name: post.name,
                    comment: post.comment
                });
                fs.writeFile('./comments.json', JSON.stringify(comments), function(err) {
                    if (err) {
                        response.writeHead(500);
                        response.end('Internal Server Error');
                        return;
                    }
                    response.writeHead(200);
                    response.end('OK');
                });
            }