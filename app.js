const express =require("express");
const bodyParser= require("body-parser");
// const date= require(__dirname+"/date.js");
const mongoose = require('mongoose');
const _=require('lodash');

const app= express();

 mongoose.connect('mongodb+srv://Ankit:Ankit123%40@cluster0.3pxoj.mongodb.net/todolistdb?retryWrites=true&w=majority');


// const items=["App Development","Coding","Web Development"];
// const workItems=[];

const itemsSchema = new mongoose.Schema({
  name:  String,
});
const Item = mongoose.model('Item', itemsSchema);

 const item1 = new Item({
 name :"Welcome to to-do list "
});

 const item2 = new Item({
 name :"Hit + Button to save an item "
});

const item3 = new Item({
name :"<-- Hit this butoon to delete an item"
});

 const arr = [item1,item2,item3];

 const listSchema = new mongoose.Schema({
   name:  String,
   item: [itemsSchema]
 });

 const List = mongoose.model('List', listSchema);

app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/",function(req,res){
  // let day = date.getDate();

  Item.find({},function(err,ele){
  if(err)
  console.log(err);
  else
  {
    if(ele.length===0)
    {
      Item.insertMany(arr, function(err){
        if(err)
        console.log(err);
        else
        console.log("Successfully inserted!!");
      });
    }
    res.render('list', {listTitle:"Today" , newListItems : ele}); //yahan ele me bhi change hua
 }
    });

});

app.post("/",function(req,res){
let itemTask =req.body.newItem;
let listName = req.body.list;
// if(req.body.list==="Work"){
//   workItems.push(item);
//   res.redirect("/work");
// }
// else
// {
//   items.push(item);
//   res.redirect("/");
// }
const newItem = new Item({
name :itemTask
});

if(listName === "Today")
{
newItem.save();
res.redirect("/")
}
else
{
  List.findOne({name:listName} , function(err,foundlist){
   if(!err)
   {
     foundlist.item.push(newItem);
     foundlist.save();
   }
  });
    res.redirect("/"+listName);
}
});

app.post("/delete",function(req,res){
let idName =req.body.checkbox;
let listName = req.body.listName;


if(listName==="Today")
{
Item.findByIdAndRemove(idName,function(err){
  if(err)
  console.log(err);
  else
  {
  console.log("Successfully Deleted!!");
  res.redirect("/");
  }
})
}
else
{
  List.findOneAndUpdate(
    {name : listName},
    {$pull : {item:{_id : idName}}},
    function(err,foundList){
      if(!err)
      {
        res.redirect("/"+listName);
      }
    })
}
});



app.get("/:customName", function(req,res){
  let requestedTitle =_.capitalize(req.params.customName) ;

List.findOne({name:requestedTitle} , function(err,foundlist){
if(!err)
{
if(!foundlist)
{
  const list = new List({
  name : requestedTitle,
  item : arr
 });
list.save();
 res.redirect("/"+requestedTitle); //ye line likhna compulsory hai kyunki niche k line me foundlist.item likhe hai and wahn foundlist ka value NUll hi rah jaata jo ki error deta
}
else
{
  res.render("list",{listTitle:requestedTitle, newListItems: foundlist.item });
}

}
});

});

app.get("/about" , function(req,res){
  res.render("about");
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
  console.log("Server started successfully!!");
});
