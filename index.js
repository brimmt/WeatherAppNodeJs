require('dotenv').config();
const https = require('https');
const http = require('http');

const port = process.env.PORT || 8000;
const API_KEY = process.env.API_KEY;

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/weather')) {
    const query = req.url.split('?')[1];
    const city_name = query.split('=')[1];

    // Step 1: Get city coordinates
    const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=${API_KEY}`;

    https.get(geoURL, (geoRes) => {
      let geoData = '';

      geoRes.on('data', chunk => {
        geoData += chunk;
      });

      geoRes.on('end', () => {
        const geo = JSON.parse(geoData);
        if (!geo.length) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'City not found' }));
          return;
        }

        const { lat, lon } = geo[0];
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;

        // Step 2: Get actual weather using coordinates
        https.get(weatherURL, (weatherRes) => {
          let weatherData = '';

          weatherRes.on('data', chunk => {
            weatherData += chunk;
          });

          weatherRes.on('end', () => {
            const weather = JSON.parse(weatherData);

            const filtered = {
              city: weather.name,
              description: weather.weather[0].description,
              temperature: weather.main.temp,
              max_temp: weather.main.temp_max,
              min_temp: weather.main.temp_min,
              humidity: weather.main.humidity,
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(filtered));
          });

        }).on('error', () => {
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

server.listen(port, () => {
  console.log(`Server running on port ${port}`);


});


