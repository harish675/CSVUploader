
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');
const db = require('./config/mongoose');
const port = 8000;

//set the  view engine
app.set('view engine','ejs');
app.set('views','./views');


app.use(express.urlencoded());
app.use(express.static('./assets'));
app.use(expressLayouts);

//extract style and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.use('/',require('./routes'));

 
app.listen(port,function(err){
     if(err){
         console.log('Error in running the server');
     }
     console.log('server is running fine on port',port);
})