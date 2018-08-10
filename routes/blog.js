var express = require('express');
var router = express.Router();
var fs = require('fs');


// get the seed data
var data = require('../mydata.json');
var MongoClient = require('mongodb').MongoClient;
// Connection URL
var url = 'mongodb://localhost:27017';
var db;
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to MongoDB Server...");
  db = client.db('portfolio');
});

// this function will go to the database and fetch the documents
// once it has got the data, it will make a call to the callback function
function getBlogs(callback){
    var collection = db.collection('blogs');
    collection.find({}).toArray(function(err, docs) {
        callback(null, docs);
    });
}

function getBlogByAlias(alias, callback){
    var collection = db.collection('blogs');
    collection.find({'alias': alias}).toArray(function(err, docs) {
        callback(null, docs[0]);
    });
}

router.get('/', function (req, res, next) {
    // define a callback function
    function listBlogs(error, data){
        res.render('blog', { 
            title: 'Blog', 
            navBlog: true, 
            showFooter: true, 
            extraCss: ['/css/blog.css'],
            categories:null,// data.blogCategories,
            featuredBlog:null,// getBlog()[random] ,
            blog: data
        });
    };
    getBlogs(listBlogs);
});

/*function getBlog(alias){
    if(alias){
        var index = parseInt(data.blogIndex[alias]);
        return data.myBlog[index];
    }else{
        return data.myBlog;
    }
}

router.get('/', function (req, res, next) {
    var random = Math.floor(Math.random() * data.myBlog.length);
    res.render('blog', { 
        title: 'Blog', 
        navBlog: true, 
        showFooter: true, 
        extraCss: ['/css/blog.css'],
        categories: data.blogCategories,
        featuredBlog: getBlog()[random] ,
        blog: getBlog() 
    });
});*/
  
router.get('/:blogAlias', function (req, res, next) {
    var blog = getBlogs(req.params.blogAlias);
    res.render('blog-detail', { 
      title: blog.name ,
      navBlog: true, 
      showFooter: true, 
      extraCss: ['/css/blog.css'],
      blog:  blog,
      categories: data.blogCategories
    });
});

module.exports = router;