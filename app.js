// nodemon restarts server automatically after changes
require('dotenv').config();
const express = require('express');
const app = express();
const ipAddress = '127.0.0.1';
const port = 8125;
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

app.get('/', async (req, res) => {
  // this will send only recent transactions
  const options = {
    max_results: 15,
  };

  cloudinary.api.resources(options, function (error, result) {
    res.send(result.resources);
  });

  // this will display folder names for organize images for users
  cloudinary.api.sub_folders('dna-images', (error, result) => {
    console.log(error, result);
  });
});

app.get('/delete', async (req, res) => {
  // ! There is a issue with locating images
  const publicIDs = [
    'dna-images/albertsons-east-charleston/ductwork_ndnrvu.jpg',
  ];
  cloudinary.api.delete_resources(publicIDs, (error, result) => {
    console.log(error, result);
    res.send(result);
  });
});

app.get('/new-folder', async (req, res) => {
  cloudinary.api.create_folder('dna-images/test', function (error, result) {
    console.log(result);
    res.send(result);
  });
});

app.listen(port, ipAddress, () => {
  console.log(`listening on http://localhost:${port}`);
});
