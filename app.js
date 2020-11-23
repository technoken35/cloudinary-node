// nodemon restarts server automatically after changes
require('dotenv').config();
const express = require('express');
const app = express();
const host = '0.0.0.0';
const port = process.env.PORT || 3000;
var cors = require('cors');
var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// allow CORS from all origins
app.use(cors());
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json. Parse response/requests bodies to JSON
//app.use(bodyParser.json());

var folders = [];

// parses and returns all request bodies
app.use(express.json());

app.get('/', (req, res) => {
  // this will send only recent transactions
  const options = {
    max_results: 25,
  };

  cloudinary.api.resources(options, function (error, result) {
    res.send(error === undefined ? result.resources : error);
  });

  //res.send('cloudinary isnt working');

  // this will display folder names for organize images for users
  cloudinary.api.sub_folders('dna-images', (error, result) => {
    folders = result.folders;

    console.log(error, result);
  });
});

app.get('/folders', (req, res) => {
  cloudinary.api.sub_folders('dna-images', (error, result) => {
    // return all subfolders
    folders = result.folders;
    console.log(error, result);
    res.send(error === undefined ? result : error);
  });
});

app.get('/pick-folder', (req, res) => {
  // individual folder resource

  cloudinary.api.resources(
    {
      type: 'upload',
      prefix: `${req.body.pathName}/`,
    },
    function (error, result) {
      res.send(error === undefined ? result : error);
    }
  );
});

app.get('/search', (req, res) => {
  // UI READY
  // Resources by folder name
  cloudinary.search
    .expression(`folder:dna-images/${req.body.folderName}`)
    .sort_by('public_id', 'desc')
    .max_results(30)
    .execute()
    .then((result, error) => {
      console.log(result);
      res.send(result.resources);
    });
});

/* app.post('/upload', async(req,res)=>{
  cloudinary.uploader.upload("gauges.jpg",
  { responsive_breakpoints: 
    { create_derived: true, 
      bytes_step: 20000, 
      min_width: 200, 
      max_width: 1000 }}, 
   function(error, result) {console.log(result, error); });
}) */

app.post('/delete', (req, res) => {
  // ! There is a issue with locating images
  const rawPublicIDs = [
    'dna-images/albertsons-east-charleston/ductwork_ndnrvu.jpg',
    'sample.jpg',
  ];

  // logic for grabbing just the ID string with no file type ending
  const formattedPublicIDs = rawPublicIDs.map((ID) => {
    let formattedID = ID.slice(0, ID.length - 4);
    return formattedID;
  });

  cloudinary.api.delete_resources(
    //UI READY
    [req.body.publicIDs],
    { type: 'upload' },
    (error, result) => {
      console.log(error, result);
      res.send(error === undefined ? result : error);
    }
  );
});

app.post('/new-folder', (req, res) => {
  // UI READY
  cloudinary.api.create_folder(
    `dna-images/${req.body.new_folder_name}`,
    function (error, result) {
      console.log(result);
      res.send(error === undefined ? result : error);
    }
  );
});

app.listen(port, host, () => {
  console.log(`listening on http://localhost:${port}`);
});
