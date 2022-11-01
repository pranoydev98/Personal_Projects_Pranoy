//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var items = ["Buy Food","Cook Food","Eat Food"];
var workItems = ["Meeting"];
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res)
{
let today = new Date();
let options = {
  weekday : "long",
  day : "numeric",
  month : "long"};
//produce date in this format
let day = today.toLocaleDateString("en-US",options);
res.render("list",{listTitle:day, newListItems: items});
});

app.get("/work",function(req,res)
{
res.render("list",{listTitle:"Work List",newListItems: workItems});
});

app.get("/about",function(req,res)
{
  res.render("about");
});

app.post("/",function(req,res)
{
  let item = req.body.newItem;
  if(req.body.list === "Work")
  {
    workItems.push(item);
    res.redirect("/work");
  }
  else
  {
  items.push(item);
  res.redirect("/");
  }
});

app.listen(3000,function()
{
  console.log("Server is running on 3000");
});
