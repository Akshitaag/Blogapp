var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var sanitizer=require("express-sanitizer");
app.use(methodOverride("_method"));
//mongoose.connect("mongodb://localhost/blog_app");
mongoose.connect("mongodb://user:password@ds113795.mlab.com:13795/blogapp");  
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//app.use("sanitizer()");
app.set("view engine", "ejs");

var blogSchema= new mongoose.Schema({
   
   title: String,
   image: String,
   body: String,
   created : {type: Date ,default: Date.now}
});
var Blog= mongoose.model("Blog",blogSchema);

    // Blog.create({
    //     title: "Flower",
    //     image:"https://en.wikipedia.org/wiki/Flower#/media/File:Flower_poster_2.jpg",
    //     body:"A flower, sometimes known as a bloom or blossom, is the reproductive structure found in plants that are floral (plants of the division Magnoliophyta, also called angiosperms). The biological function of a flower is to effect reproduction, usually by providing a mechanism for the union of sperm with eggs. Flowers may facilitate outcrossing (fusion of sperm and eggs from different individuals in a population) or allow selfing (fusion of sperm and egg from the same flower). Some flowers produce diaspores without fertilization (parthenocarpy). Flowers contain sporangia and are the site where gametophytes develop. Many flowers have evolved to be attractive to animals,so as to cause them to be vectors for the transfer of pollen. After fertilization, the ovary of the flower develops into fruit containing seeds."
    // });

app.get("/",function(req,res){
    res.redirect("/blogs");
});
//index
app.get("/blogs",function(req,res){
   Blog.find({},function(err,blogs){
       if(err)
       {
           console.log(err);
       }
       else
       {
           res.render("index",{blog:blogs});
       }
   }); 
});
//new
app.get("/blogs/new",function(req,res){
    res.render("new");
})
app.post("/blogs",function(req,res){
    //req.body.blog.body= req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog,function(err,newblog){
       if(err)
       {
           res.redirect("/blogs/new");
       }
       else
       {
            res.redirect("/blogs");
       }
   }) 
});

//show each post
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err)
        {
            res.redirect("/blogs");
        }
    else
    {
    res.render("show",{blog:foundblog})
    }
    });
});
// edit
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err)
        {
            res.redirect("/blogs");
        }
    else
    {
    res.render("edit",{blog:blog})
    }
    });
});
//update
app.put("/blogs/:id",function(req,res){
     //req.body.blog.body= req.sanitize(req.body.blog.body);
   //fetch data from form 
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updated){
      if(err)
      {
          res.redirect("/blogs");
      }else
      {
          res.redirect("/blogs/"+req.params.id);
      }
   });
});
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err){
       if(err)
       {
           res.redirect("/blogs");
       }
       else
       {
           res.redirect("/blogs");
       }
   }) ;
});
app.listen(3000, 'localhost',function(){
  console.log("server on duty, mallady");
});
