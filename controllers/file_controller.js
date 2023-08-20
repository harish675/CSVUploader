
const File = require('../model/files');
const fs= require('fs');
const path = require('path');
const csvParser = require('csv-parser');



module.exports.fileUpload = async function(req,res){
     
    try{ 

         if(!req.file){
              //handle error if file not present
              return res.status(400).send('file not uploaded...');
         }

         if(req.file.mimetype !== 'text/csv'){
             // error handling when the file is not csv
             return res.status(400).send('Please upload csv files only.. other not allowed..');
         }
         
           //parser to upload csv file store into array

        const results = [];
        fs.createReadStream(req.file.path)
          .pipe(csvParser())
          .on('data',function(data){
              results.push(data);
          })
          .on('end',async function(){
              //save csv data to db

              if(req.file){
                  const oldPath = req.file.path;
                  const newPath = path.join(__dirname,'../uploads/files/csv',req.file.originalname);
                  fs.rename(oldPath,newPath,function(err){
                         if(err){
                             throw err;
                         }
                  });
                 
                  const csvData = new File({
                       
                        name: req.file.originalname,
                        header_row:results[0],
                        data_row:results.slice(1),
                  });
                   
                   
                  await csvData.save();
              }else{    
                   res.status(400).send('no file uploaded');
              }

              return res.redirect('/');
          });

    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });    
    }  
}

//function to delete file

module.exports.deleteFile = async function (req,res){
    
       try{
          
        const id = req.query.id;
        console.log(id);
        //find the the file
        const file = await File.findById(id);
        
        if(!file){
             console.log('file not found...');
             return res.redirect('back');
        }
         
       //Delete the file from the file system  
       const filePath = path.join(__dirname, '../uploads/files/csv', file.name);
       fs.unlink(filePath , async(err) =>{
            if(err){
                console.log('Error deleting file:',err);
            }else{
                 
                //If file deletion is successfully,delete the record from the database 
                await File.findByIdAndDelete(id);
            }

            return res.redirect('back');
       });
       }catch(err){
          
          console.log("error in deleting file",err);
          return res.redirect('back');
       }           
};


module.exports.viewFile = async function(req,res){
      
     try{
          
         const id = req.params.id;
         const file = await File.findById(id);

         if(!file){
             console.log('file Not found....');
             return res.status(404).send('File not found');
         }
         
         const filePath = path.join(__dirname,'../uploads/files/csv',file.name);
         const results = [];

         fs.createReadStream(filePath)
           .pipe(csvParser())
           .on('data',function(data){
                results.push(data); 
           })
           .on('end',function(){
             //return res.status(200).json(results);
             return res.render('view_csv',{
                    title:'fileView',
                   data:results,
              });
           });
     }
     catch(err){
         console.log('Error in the showing data from the csv file',err);
         return res.status(500).json({
             message:"Internal server error",
         })
     };
}