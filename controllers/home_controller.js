 
const File = require('../model/files');

module.exports.homePage = async function(req,res){ 
      
       try{
             const all_csv_files = await File.find({});
             return res.render('home',{
                  title:'HomePage',
                  files:all_csv_files,
            });
             
       }catch(err){
              
             console.log('Error in rendering Home page');

             res.status(500).json({
                   
                   message:'Internal server error'
             });
             
      }
}