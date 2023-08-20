
const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');



 //defining Schema for storing csv-file info
const fileSchema = new mongoose.Schema({
      
      name:{
         type:String,
         required:true,
      },
      header_row:{
         type:[Object],
      },
      data_row:{
          type:[Object],
      },
     
},{
     timestamps:true
});


const  FILE = mongoose.model('FILE',fileSchema);
module.exports = FILE;