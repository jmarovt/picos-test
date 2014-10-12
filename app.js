var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var request = require('request');
var xml2js = require('xml2js');
var fs = require('fs');
var path = require('path');
var busboy = require('connect-busboy');
var mkdirp = require('mkdirp');

var routes = require('./routes/index');
var users = require('./routes/users');

var ncuser = "jmarovt";
var apikey = "b4be10e7fa8042e1b57053bcf1dd0096";
var clientip = "2.110.62.156";

var app = express();
var parser = new xml2js.Parser();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy());

app.use('/', routes);
app.use('/users', users);

app.get('/searching', function(req, res){
 
    // input value from search
    var val = req.query.search;
    
    //check if domain has a valid domain format
    if (checkDomain(val) != null){
        
        var url = "https://api.sandbox.namecheap.com/xml.response?ApiUser="+ncuser+
        "&ApiKey="+apikey+"&UserName="+ncuser+"&ClientIp="+clientip+"&Command=namecheap.domains.check&DomainList="+val;

        // request module is used to process the yql url and return the results in JSON format
        request(url, function(err, resp, body) {
            if (!err && resp.statusCode != 403 && resp.statusCode == 200) {

                parser.parseString(body, function (err, result) {
                    
                    if(result.ApiResponse.$.Status == "ERROR"){
                        console.log("There has been an error: ");
                        console.dir(result.ApiResponse.Errors[0].Error[0]._);

                        res.send("false");
                    }
                    else {
                        var domain_available = result.ApiResponse.CommandResponse[0].DomainCheckResult[0].$.Available;

                        // pass back the results to client side
                        res.send(domain_available);                 
                    }
                }); 
            }
        });

    }
    else {
        res.send("false");
    }

});

app.post('/submit', function(req,res){

    var fstream;
    var title;
    var domain;
    var imageFile;

    req.pipe(req.busboy);

    //write static html page to the disk
    req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
        
        if (key == "title") {
            title = value;
        }
        else if(key == "domain"){
            domain = value;
            var newFolder = 'public/sites/' + domain;

            //create new folder with the name of the domain
            mkdirp(newFolder, function(err) { 

                // path was created unless there was error
                var fileName = 'public/sites/'+ domain +'/index.html';
                var stream = fs.createWriteStream(fileName);

                stream.once('open', function(fd) {
                  var html = buildHtml(req, title, imageFile);

                  stream.end(html);
                });

            });
        };
              
    });

    //write the image to the disk
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 
        imageFile = filename;
        fstream = fs.createWriteStream(__dirname + '/public/sites/' + domain + '/' + filename);
        file.pipe(fstream);
    });

    //redirect to the newly created site on finish
    req.busboy.on('finish', function(){
     res.redirect('/sites/'+ domain + '/index.html');
   });

});

function buildHtml(req, title, imagePath) {
  var title = title;
  var imagePath = imagePath;

  // concatenate header string
  // concatenate body string

  return '<!doctype html>'
            + '<html lang="en">'
            + '<head>'
            +   '<title>Test Page</title>'
            +   '<meta name="description" content="Think you\'re winning? Think again.">'
            +   '<meta property="og:title" content="Victor the winner" />'  
            +   '<meta property="og:description" content="Think you\'re winning? Think again." />'
            + '</head>'
            + '<body style="margin: 30px; text-align:center;">'
            + '<h1 style="margin-bottom:30px;">'+ title +'</h1>'
            + '<img src="'+ imagePath +'">' 
            + '</body>'
            + '</html>';
};

function checkDomain(value){

    var re = new RegExp(/^([\da-z\.-]+)\.([a-z\.]{2,6})$/);
    return value.match(re);

};


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
