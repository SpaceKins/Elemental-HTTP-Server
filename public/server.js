var http = require('http');
var fs = require('fs');
var querystring = require('querystring');

const serverPort = 8080;
const serverIP = '127.0.0.1';

var testRegEx = "/";
var testWhereRegEx = testRegEx.search(/^\/$/i);
console.log('Found At ' + testWhereRegEx);

var checkThisFile = "./hydrogen1.html";

fs.stat(checkThisFile, function(err, stats) {
    if (err) {
        console.log('Error ' + checkThisFile)
    };
    console.log(stats);
    console.log(checkThisFile + " exists1");
})


getAllFilesFromFolder('.');

var routes = {
    '/667': function(thisResponse) {
        writeDataFromFile('./index.html', thisResponse)
    },
    '/hydrogen': function(thisResponse) {
        console.log('In Hydrogen');
        getFileByFileName('hydrogen');
        writeDataFromFile('./hydrogen.html', thisResponse);
    },
    '/^\/[a-z]/i': function() {},
    "/^\/$/i": function() {
        writeDataFromFile('./index.html', thisResponse)
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
    //  console.log(request);
});

//server.listen(serverPort);
server.listen(serverPort, serverIP);
console.log("Server is listening on port " + serverPort + '@' + serverIP);

/*
server.on('connect', function(req, cltSocket, head) {
    console.log('head');
});
*/

server.on('request', function(req, res) {
    console.log(req.headers);
    var method = req.method;
    console.log('method=' + method);
    var url = req.url;
    console.log('url={' + url + '}');
    var clientSocket = req.socket;
    //  console.log(clientSocket);


    console.log(req.data);

    if (req.method == "POST") {
        req.setEncoding('utf-8');
        req.on('data', function(data) {
            //  console.log(data);
            var postData = querystring.parse(data);
            console.log(postData);
            var postFile = './' + postData['elementName'] + '.html';

            fs.stat(postFile, function(err, stats){
                console.log('****In Call Back*******************************');
                //console.log(res);
                fileExistPost(err, stats,res,postData);});
        })
    }

    if (req.method == "GET") {
        req.setEncoding('utf-8');

        var keys = Object.keys(routes);
        var action = "";
        var foundAction = false;

        console.log(keys);

        if (url.search(/^\/$/i) == 0) {
            writeDataFromFile('./index.html', res);
        }

        if (url.search(/^\/[a-z]/i) == 0) {
            fs.open('.' + url + '.html', 'r', function(err, fd) {
                if (err) {
                    console.log('errr');

                    /*
                    res.writeHead(404, {
                        "Content-Type": "text/html"
                    });
                    */

                    //  console.log(data);
                    //res.write(url + ' not found.');
                    writeDataFromFile('./404.html', res);
                    //  res.end();
                    //throw err;
                } else {
                    writeDataFromFile('.' + url + '.html', res);
                }


            })
        }

        /**** SKip for later
        for (var i = 0; i < keys.length; i++) {
            console.log('Regex=' + url.search(keys[i]));
            if (url.search(keys[i]) == 0) {
                action=routes[keys[i]];
                console.log(action);
                foundAction=true;
                break;
            }
        }

        if(foundAction)
        {
            console.log("Found Action");
        }
        else
        {
            console.log("Didn't find Action");
        }

        */

        /*
        if (url in routes) {
            console.log('Found URL as ' + url);
            routes[url](res);
        } else {
            console.log('No URL as ' + url);
        }

        
        req.on('data', function(data) {
            console.log(data);
        })
        */
    }


});

function fileExistPost(err, stats,res,postData) {
                console.log('@@@@@@@@@@@@@@@In Call Back*******************************');

    if (err) {
            console.log(err);
        }

    if (stats == undefined) {
        console.log('*****Not Exist');
        writeDataToFile(postData);
        // writeElementData(res, postData);

        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.write('{"success":true}');
        res.end();

        console.log('%%%%%% Write Index %%%%%%%%%%%%%');
        writeDataToIndexFile();
    } else {
        console.log('****** Exist');
        res.writeHead(400, {
            "Content-Type": "text/html"
        });
        //  console.log(data);
        //res.write(data);

        res.end();
    }

}

function isFileExists(fileName) {
    var isFileExistsReturn = false;

    console.log("In Exists " + fileName);

    var thisStat = fs.statSync(fileName);


    if (thisStat == undefined) {
        return false;
    } else {
        return true;
    }
}



var getFileByFileName = function(fileName) {
    console.log(fileName);
}



function writeDataFromFile(fileName, thisResponse) {
    console.log('************ Will Read ' + fileName);
    fs.readFile(fileName, 'utf8', function(err, data) {
        if (err) {
            throw err;
        }

        console.log('************ Read ' + fileName);
        //   console.log(data);
        console.log('thisResponse');
        //   console.log(thisResponse);


        thisResponse.writeHead(200, {
            "Content-Type": "text/html"
        });
        //  console.log(data);
        thisResponse.write(data);

        thisResponse.end();
    });
}

function writeDataToFile(dataArray) {
    var fileName = "./" + dataArray['elementName'].toLowerCase() + ".html";

    console.log('writing to ' + fileName);

    fs.open(fileName, 'w', function() {
        fs.exists(fileName, function() {
            fs.writeFile(fileName, createElementData(dataArray));
        })
    });
}

function writeDataToIndexFile() {
    var fileName = "./index.html";

    console.log('writing to ' + fileName);

    fs.open(fileName, 'w', function() {
        fs.exists(fileName, function() {
            fs.writeFile(fileName, createIndexData(getAllFilesFromFolder('.')));
        })

    });
}

function createElementData(dataArray) {
    var data = '<!DOCTYPE html>';
    data += '\n' + '<html lang="en">';
    data += '\n' + '<head>';
    data += '\n' + '<meta charset="UTF-8">';
    data += '\n' + '<title>The Elements - Boron</title>';
    data += '\n' + '<link rel="stylesheet" href="/css/styles.css">';
    data += '\n' + '</head>';
    data += '\n' + '<body>';
    data += '\n' + '<h1>' + dataArray['elementName'] + '</h1>';
    data += '\n' + '<h2>' + dataArray['elementSymbol'] + '</h2>';
    data += '\n' + '<h3>Atomic number ' + dataArray['elementAtomicNumber'] + '</h3>';
    data += '\n' + '<p>' + dataArray['elementDescription'] + '</p>';
    data += '\n' + '<p><a href="/">back</a></p>';
    data += '\n' + '</body>';
    data += '\n' + '</html>';

    return data;
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

function createIndexData(files) {
    var data = '<!DOCTYPE html>';
    data += '\n' + '<html lang="en">';
    data += '\n' + '< head > ';
    data += '\n ' + ' < meta charset = "UTF-8" > ';
    data += '\n ' + '< title > The Elements < /title>';
    data += '\n' + '<link rel="stylesheet" href="/css / styles.css ">';
    data += '\n' + '</head>';
    data += '\n' + '<body>';
    data += '\n' + '<h1>The Elements</h1>';
    data += '\n' + '<h2>These are all the known elements.</h2>';
    data += '\n' + '<h3>These are 2</h3>';
    data += '\n' + '<ol>';

    for (var i = 0; i < files.length; i++) {
        data += '\n' + '<li>';
        data += '\n' + '<a href=" ' + files[i].replace('.', '') + ' ">' + files[i].replace('.html', '').replace('./', '') + '</a>';
        data += '\n' + '</li>';
    }

    /*
    data += '\n' + '<li>';
    data += '\n' + '<a href=" / hydrogen.html ">Hydrogen</a>';
    data += '\n' + '</li>';
    data += '\n' + '<li>';
    data += '\n' + '<a href=" / helium.html ">Helium</a>';
    data += '\n' + '</li>';
    */

    data += '\n' + '</ol>';
    data += '\n' + '</body>';
    data += '\n' + '</html>';

    console.log(data);
    return data;
}

function getAllFilesFromFolder(dir) {

    var filesystem = require("fs");
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {


        file = dir + '/' + file;
        var stat = filesystem.statSync(file);

        if (stat && (stat.isFile())) {
            if ((file.indexOf('.html') > 0) && file.indexOf('index.html') == -1 && file.indexOf('404.html') == -1)
                results.push(file);
        }

    });

    console.log(results);
    return results;

};