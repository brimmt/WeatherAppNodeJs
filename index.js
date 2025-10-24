require('dotenv').config();  // This line is to pull the variables from the .env
const https = require('https'); // this line imports the https
const http = require('http'); // this line imports the http

const port = process.env.PORT || 8000;  // this line is basically pulling the port variable from the .env or use 8000
const API_KEY = process.env.API_KEY; // this is pulling the API_key from the .env 

const server = http.createServer((req, res) => {  // this is the standard nodejs code to create a server, it takes in the required and the respone
  if (req.url.startsWith('/weather')) {  // iT builds the route. Its basically say if user goes to this route, and check to make sure the route starts with /weather. so localhost/weather
    const query = req.url.split('?')[1]; // split the url after ? so then we can get teh city name, it would be the same if we anted different information , but splitting allows us to index
    const city_name = query.split('=')[1]; // this assigns the split to city_name beause it split it at th city name

    // Step 1: Get city coordinates
    const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=${API_KEY}`;  //To find the geo location it would have to pull from the geo api first. Need to get use to urls

    https.get(geoURL, (geoRes) => {  // this is simmiliar to app.get in python , im saying get my geourl and im making a arrow function idk geores, i think thats a.. new variable?
      let geoData = ''; // creates a changeable variable Geodata that starts off blank , this is to gather the data that is pulling from the geourl? OHH so thats maybe where the geoRES IS. Maybe its the actual call needed to pull certain data

      geoRes.on('data', chunk => { // I don't understand what this is?
        geoData += chunk;  // Same with this
      });

      geoRes.on('end', () => {
        const geo = JSON.parse(geoData);    //  I know this is parsing the geoDATA
        if (!geo.length) { // I think this is saying if ! if the length is not.....? this is telling the system that if openweather sends an empty array
          res.writeHead(404, { 'Content-Type': 'application/json' }); // when the request is pushed to through the api it sends a header letting the system know what it's content type is , and it also gives a 404 status code not found. So maybe its telling the system if the correct geo length isn't found provide a 404
          res.end(JSON.stringify({ error: 'City not found' })); // this sends a json response thats says the key value error: means city not found
          return;
        }

        const { lat, lon } = geo[0]; // this sets the variables lat,lon to geo[0]? So its assigning whatever the raw geodata foudn in geo[0] to lat, lon
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;  // this is creating a new variable weatherURL that intakes lat/lon parameters 

        // Step 2: Get actual weather using coordinates
        https.get(weatherURL, (weatherRes) => {  //app.get its calling the api to get the weather response
          let weatherData = ''; // stores the data into this empty string

          weatherRes.on('data', chunk => {  //the weatherres data is being pulled by chunks
            weatherData += chunk; // the chunks are being added to the empty string weatherdata
          });

          weatherRes.on('end', () => { //once this is done
            const weather = JSON.parse(weatherData); // we now create a new variable called weather that is bascially the parsed vesion of the weatherdata, easier  the json

            const filtered = {     //This is basically the information we are pulling from all the data that we pulled. 
              city: weather.name,
              description: weather.weather[0].description,
              temperature: weather.main.temp,
              max_temp: weather.main.temp_max,
              min_temp: weather.main.temp_min,
              humidity: weather.main.humidity,
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });  // this is telling the system what header we will have which is application json
            res.end(JSON.stringify(filtered));  // IT will shows the json version o fthe filtered data
          });

        }).on('error', () => {   // error handling explaing that the data failed to catch the weather data. This is important to help give developers an idea of where the break is
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to fetch weather data' }));
        });
      });
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {   // yOU WILL always have this line to make sure from the client side we are always listening for the server. 
  console.log(`Server running on port ${port}`);


});


