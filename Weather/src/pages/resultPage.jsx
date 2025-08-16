import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard.jsx';
import address from '../assets/address.gif';
import sun1 from '../assets/sun1.gif';
import sun2 from '../assets/sun2.gif';
import rain1 from '../assets/rainC1.gif';
import rain2 from '../assets/rainC2.gif';
import cloud1 from '../assets/cloud1.gif';
import cloud2 from '../assets/cloud2.gif';
import { useState, useEffect } from 'react';

function AnimatedWeatherGif({ weatherType, large }) {
  let gifs = null;
  let altText = '';
  if (weatherType === 'Sunny' || weatherType === 'clear-day') {
    gifs = [sun1, sun2];
    altText = 'Sunny Weather Animation';
  } else if (
    weatherType === 'Cloudy' ||
    weatherType === 'cloudy' ||
    weatherType === 'partly-cloudy-day' ||
    weatherType === 'partly-cloudy-night'
  ) {
    gifs = [cloud1, cloud2];
    altText = 'Cloudy Weather Animation';
  } else if (weatherType === 'Rain' || weatherType === 'rain') {
    gifs = [rain1, rain2];
    altText = 'Rainy Weather Animation';
  }
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!gifs) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % gifs.length), 3000);
    return () => clearInterval(timer);
  }, [gifs]);
  if (!gifs) return null;
  return (
    <img
      src={gifs[idx]}
      alt={altText}
      style={{ width: large ? 90 : 48, height: large ? 90 : 48, objectFit: 'cover', borderRadius: 14, boxShadow: '0 0 8px #ffffff55' }}
    />
  );
}

export default function ResultPage() {
  const locationData = useLocation();
  const apiData = locationData.state && locationData.state.weatherData;
  const searchedCity = (locationData.state && locationData.state.city) || '';

  // Prepare weather object from API data or fallback
  let weather = null;
  let weatherDateTime = '';
  if (apiData && apiData.currentConditions) {
    const cond = apiData.currentConditions;
    let iconType = 'Sunny';
    const condRaw = String(cond.conditions || '').toLowerCase();
    if (condRaw.includes('rain')) iconType = 'Rain';
    else if (condRaw.includes('cloudy') || condRaw.includes('overcast') || condRaw.includes('partly cloudy')) iconType = 'Cloudy';
    else if (condRaw.includes('clear')) iconType = 'Sunny';
    weather = {
      location: apiData.resolvedAddress || searchedCity,
      temp: cond.temp,
      icon: iconType,
      conditions: cond.conditions,
      windspeed: cond.windspeed,
      precipprob: cond.precipprob || cond.precip || 0,
      humidity: cond.humidity,
      visibility: cond.visibility || '--',
    };
    // Compose date-time (formatting to readable string)
    // Use both date and time, if available
    // Visual Crossing: days[0].datetime is date (YYYY-MM-DD), currentConditions.datetime is local time (HH:mm:ss or full ISO)
    const apiDate = (apiData.days && apiData.days.length > 0 && apiData.days[0].datetime) || '';
    const apiTime = cond.datetime || '';
    if (apiDate && apiTime) {
      // Join date and time to one string
      const isoCombined = `${apiDate}T${apiTime}`;
      try {
        const dt = new Date(isoCombined);
        if (!isNaN(dt)) {
          const month = dt.toLocaleString('en-US', { month: 'long' });
          const day = dt.getDate();
          const year = dt.getFullYear();
          let hour = dt.getHours();
          let minute = dt.getMinutes();
          let second = dt.getSeconds();
          const ampm = hour >= 12 ? 'PM' : 'AM';
          hour = hour % 12;
          hour = hour ? hour : 12;
          const mm = String(minute).padStart(2, '0');
          const ss = String(second).padStart(2, '0');
          weatherDateTime = `${month} ${day}, ${year}, ${hour}:${mm}:${ss} ${ampm}`;
        } else {
          weatherDateTime = `${apiDate} ${apiTime}`;
        }
      } catch {
        weatherDateTime = `${apiDate} ${apiTime}`;
      }
    } else if (cond.datetime) {
      // Old fallback if only time
      weatherDateTime = cond.datetime;
    }
  }
  // Fallback mock
  if (!weather) {
    weather = {
      location: searchedCity || 'Unknown Location',
      temp: 72,
      icon: 'Sunny',
      conditions: 'Sunny',
      windspeed: 5,
      precipprob: 0,
      humidity: 50,
      visibility: 10,
    };
    weatherDateTime = new Date().toLocaleString();
  }

  const backgroundImage = 'https://res.cloudinary.com/dcmcrc4v3/image/upload/v1755204414/zklmxn4w3oaffvztwh5c.jpg';

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      <div className='fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
        <LiquidGlassCard>
          <div className='p-4 w-screen lg:w-200'>
            <div className='absolute top-5 left-8 lg:left-5 flex justify-center items-center flex-col lg:flex-row group'>
              <Link to='/' className='flex justify-center items-center flex-col lg:flex-row'>
                <img src={address} alt='address-icon' className='w-10 h-10 mx-auto bg-amber-50 rounded-full group-active:scale-110 transition-transform duration-300 cursor-pointer' />
                <p className='text-[15px] lg:text-2xl ml-1 text-white font-bold cursor-pointer'>Location</p>
              </Link>
            </div>
            <div className='absolute top-5 right-8'>
              <p className='text-xl text-center font-bold'>
                {weatherDateTime ? weatherDateTime : '---'}
              </p>
              {/* <p>{weatherDateTime ? weatherDateTime : 'Time'}</p> */}
            </div>
            {/* WEATHER DISPLAY INTEGRATION START */}
            {/* Uses live API data from search if provided, fallback to mock if not */}
            {/* --- BEGIN WEATHER DISPLAY --- */}
            <div className="mb-8 text-center mt-10 flex flex-col justify-center items-center">
              <h2 className="text-3xl font-bold text-blue-700 mb-2 flex items-center justify-center gap-2">
                <span>{weather.location}</span>
              </h2>
              <AnimatedWeatherGif weatherType={weather.icon} large />
              <div className="text-4xl font-bold text-blue-900 mb-1">
                {Math.round(weather.temp)}°F
              </div>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {weather.conditions}
              </div>
              <div className="grid grid-cols-2 gap-6 mt-10 font-bold">
                <div className="flex justify-center items-center gap-2"><span role="img" aria-label="Wind">💨</span> {Math.round(weather.windspeed)} mph <span className="text-xl ml-1 text-white">Wind</span></div>
                <div className="flex justify-center items-center gap-2"><span role="img" aria-label="Rain">💧</span> {weather.precipprob}% <span className="text-xl ml-1 text-white">Rain</span></div>
                <div className="flex justify-center items-center gap-2"><span role="img" aria-label="Humidity">🌡️</span> {weather.humidity}% <span className="text-xl ml-1 text-white">Humidity</span></div>
                <div className="flex justify-center items-center gap-2"><span role="img" aria-label="Visibility">🔭</span> {weather.visibility} mi <span className="text-xl ml-1 text-white">Visibility</span></div>
              </div>
            </div>
            {/* WEATHER DISPLAY INTEGRATION END */}
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}
