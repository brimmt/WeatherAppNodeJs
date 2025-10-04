# 🌦️ Weather App (Node.js + OpenWeather API)

## Purpose

This project is a simple backend weather sevice build with **Node.js** and **HTTPS modules**.
It fetches real-time weather data from the **OpenWeatherMap API** and returns clean JSON responeses.

I previously built the same app in **Python**, and I’m now recreating it across different tech stacks to understand  
how various programming languages and environments handle the same problem “under the hood.”

## Features
- RESTful API using Node.js native HTTP/HTTPS modules
- Dynamic query parsing for city-based weather lookup
- Error handling for invalid requests or missing data
- Modular and ready for frontend integration (coming soon)


## Tech Stack
- Node.js
- HTTPS module
- dotenv
- OpenWeatherApp

**Frontend (HTML/CSS/Tailwind) or (React) coming soon**

## Example

**GET** http://localhost:8000/weather?city=Atlanta

**Response**:
```json
{
    "city": "Atlanta",
    "description": "clear sky",
    "temperature": 78.4,
    "max_temp": 82,
    "min_temp": 74,
    "humidity": 56
}
---


