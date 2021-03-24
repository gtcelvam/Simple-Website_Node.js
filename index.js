const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/user"

mongoose.connect(url,{useNewUrlParser: true},(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Database Connected Successfully....");
    }
})

//To use external files
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine","ejs");

//Landing page
app.get("/",(req,res)=>{
    res.render("script");
})

//Create Schema
var userSchema = new mongoose.Schema({
    name : "String",
    age : "String"
})
//Create Model to acces schema
var user = mongoose.model("user",userSchema);
//To Store Data in Database

//users
app.get("/users",(req,res)=>{
    //Name list
    user.find({},(err,names)=>{
        if(err){
            console.log(err);
        }else{
            res.render("user",{users : names});
        }
    })
});
//Add User
app.get("/adduser",(req,res)=>{
    res.render("adduser")
});

app.post("/adduser",async(req,res)=>{
    var data = await req.body;
    user.create({name : data.name, age : data.age},(err,data)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Data added successfully");
        }
    })
    res.redirect("users");
});

//To find User by ID
app.get("/users/:id",(req,res)=>{
    var id = req.params.id;
    user.findById(id,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render("userid",{name : data.name,age : data.age});
        }
    });
})

//API_KEY 

api_ID = process.env.API_Key;

//Photos
app.get("/photos",(req,res)=>{
    request("https://api.unsplash.com/collections/?client_id="+api_ID+"&page=3",(err,respose,data)=>{
        if(err){console.log("Error spotted");
    }else{
        res.render("photos",{photosUN : JSON.parse(data)});
    }
    })
});
//Photos by pages
app.get("/photos/:page",(req,res)=>{
    pagenumber = req.params.page;
    request("https://api.unsplash.com/collections/?client_id="+api_ID+"&page="+pagenumber,(err,respose,data)=>{
        if(err){console.log("Error spotted");
    }else{
        res.render("photos",{photosUN : JSON.parse(data),pagenumber : pagenumber});
    }
    })
});

//Search for photo
app.get("/search",(req,res)=>{
    request("https://api.unsplash.com/search/photos?client_id="+api_ID+"&page=1&query=office",(err,response,data)=>{
        if(err){console.log("Error spotted");
    }else{
        res.render("searchbar",{photosUN : JSON.parse(data)});
    }
    })
});
app.get("/Views/search",(req,res)=>{
    var searchTerm = req.query.searchterm;
    var pagenum = req.query.pagenumber
    request("https://api.unsplash.com/search/photos?client_id=lJ1IJosttbB2IpoEdNhRXALCHbHc-d1TBAusS2lBkDw&page=1&query="+searchTerm+"&page="+pagenum,(err,response,data)=>{
        if(err){console.log("Error spotted");
    }else{
        res.render("search",{photosUN : JSON.parse(data),searchTerm : searchTerm});
    }
    })
});
//Photo_URL
app.get("/url",(req,res)=>{
    request("https://api.unsplash.com/search/photos?client_id=&page=2&query=office",(err,respose,data)=>{
        if(err){console.log("Error spotted");
    }else{
        res.send(JSON.parse(data));
    }
    })
})

//cannnot get
app.get("*",(req,res)=>{
    res.send("The thing you are looking for is not there");
})


app.listen(2000,()=>{
    console.log("Server Started...");
})



