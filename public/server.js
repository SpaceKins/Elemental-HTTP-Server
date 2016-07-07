var http = require('http');
var fs = require('fs');
var querystring = require('querystring');

const serverPort = 8080;
const serverIP = '127.0.0.1';

var routes = {
    'helium': '',
    '/hydrogen': function(thisResponse) {
        console.log('In Hydrogen');
        getFileByFileName('hydrogen');
        writeDataFromFile('./hydrogen.html', thisResponse);
    }
};

var count = 0;

var server = http.createServer(function(request, response) {

    /*
 response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<!DOCTYPE 'html'>");
  response.write("<html>");
  response.write("<head>");
  response.write("<title>Hello World Page</title>");
  response.write("</head>");
  response.write("<body>");
  response.write("Hello Worldr! " + count++);
  response.write("</body>");
  response.write("</html>");
  response.end();
*/

    console.log('request=');
    console.log(request);
});

//server.listen(serverPort);
server.listen(serverPort, serverIP);
console.log("Server is listening on port " + serverPort + '@' + serverIP);

server.on('connect', function(req, cltSocket, head) {
    console.log('head');
});

server.on('request', function(req, res) {
    console.log(req.headers);
    var method = req.method;
    console.log('method=' + method);
    var url = req.url;
    console.log('url=' + url);
    var clientSocket = req.socket;
    //  console.log(clientSocket);


    if (url in routes) {
        console.log('Found URL as ' + url);
        routes[url](res);
    } else {
        console.log('No URL as ' + url);
    }

    console.log(req.data);

    if (req.method == "POST") {
        req.setEncoding('utf-8');
        req.on('data', function(data) {
            console.log(data);
            var postData = querystring.parse(data);
            console.log(postData);

            writeElementData(res, postData);
        })
    }

    if (req.method == "GET") {
        req.setEncoding('utf-8');

        /*
        req.on('data', function(data) {
            console.log(data);
        })
        */
    }


});





var getFileByFileName = function(fileName) {
    console.log(fileName);


}

function writeDataFromFile(fileName, thisResponse) {
    fs.readFile('./hydrogen.html', 'utf8', function(err, data) {
        if (err) {
            throw err;
        }

        console.log('Read Hydrogen.html');
        //   console.log(data);
        console.log('thisResponse');
        //   console.log(thisResponse);


        thisResponse.writeHead(200, {
            "Content-Type": "text/html"
        });
        //  console.log(data);
        //  thisResponse.write(data);

        thisResponse.end();
    });
}

function writeElementData(thisResponse, dataArray) {
    thisResponse.writeHead(200, {
        "Content-Type": "text/html"
    });
    thisResponse.write('<!DOCTYPE html>');
    thisResponse.write('<html lang="en">');
    thisResponse.write('<head>');
    thisResponse.write('<meta charset="UTF-8">');
    thisResponse.write('<title>The Elements - Boron</title>');
    thisResponse.write('<link rel="stylesheet" href="/css/styles.css">');
    thisResponse.write('</head>');
    thisResponse.write('<body>');
    thisResponse.write('<h1>' + dataArray['elementName'] + '</h1>');
    thisResponse.write('<h2>' + dataArray['elementSymbol'] + '</h2>');
    thisResponse.write('<h3>Atomic number ' + dataArray['elementAtomicNumber'] + '</h3>');
    thisResponse.write('<p>' + dataArray['elementDescription'] + '</p>');
    thisResponse.write('<p><a href="/">back</a></p>');
    thisResponse.write('</body>');
    thisResponse.write('</html>');
    thisResponse.end();
}