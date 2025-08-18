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
import left from '../assets/left.gif';
import right from '../assets/right.gif';
import { useState, useEffect, useRef } from 'react';
import { DateTime } from 'luxon';

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

  // Find index of today in days array (WeatherAPI uses 'date' field)
  function getTodayIndex(days, tz) {
    const now = tz
      ? DateTime.now().setZone(tz)
      : DateTime.now().toUTC();
    const todayStr = now.toISODate();
    return days ? days.findIndex(day => day.date === todayStr) : 0;
  }
  const [dayIndex, setDayIndex] = useState(0);
  const initialIndexSet = useRef(false);

  useEffect(() => {
    if (
      apiData &&
      apiData.days &&
      !initialIndexSet.current
    ) {
      const todayIdx = getTodayIndex(apiData.days, apiData.timezone);
      setDayIndex(todayIdx !== -1 ? todayIdx : 0);
      initialIndexSet.current = true;
    }
  }, [apiData]);

  // Get weather info for selected day
  let weather = null;
  let weatherDateTime = '';
  let dayData = null;
  if (apiData && apiData.days && apiData.days.length > 0 && apiData.days[dayIndex]) {
    dayData = apiData.days[dayIndex];
    // WeatherAPI: dayData.day contains the daily summary
    let iconType = 'Sunny';
    const condRaw = String(dayData.day?.condition?.text || '').toLowerCase();
    if (condRaw.includes('rain')) iconType = 'Rain';
    else if (condRaw.includes('cloud') || condRaw.includes('overcast') || condRaw.includes('partly')) iconType = 'Cloudy';
    else if (condRaw.includes('clear') || condRaw.includes('sun')) iconType = 'Sunny';
    weather = {
      location: apiData.location?.name || searchedCity,
      temp: dayData.day?.avgtemp_f,
      icon: iconType,
      conditions: dayData.day?.condition?.text,
      windspeed: dayData.day?.maxwind_mph,
      precipprob: dayData.day?.daily_chance_of_rain ?? dayData.day?.totalprecip_in ?? 0,
      humidity: dayData.day?.avghumidity,
      visibility: dayData.day?.avgvis_miles ?? '--',
    };
    // Date/time as readable format
    const apiDate = dayData.date || '';
    if (apiDate) {
      try {
        const dt = new Date(apiDate);
        if (!isNaN(dt)) {
          const today = new Date();
          const isToday = dt.getDate() === today.getDate() && dt.getMonth() === today.getMonth() && dt.getFullYear() === today.getFullYear();
          const dayOfWeek = dt.toLocaleString('en-US', { weekday: 'long' });
          const month = dt.toLocaleString('en-US', { month: 'long' });
          const day = dt.getDate();
          const year = dt.getFullYear();
          weatherDateTime = `${dayOfWeek} ${month} ${day}, ${year}${isToday ? ' (Today)' : ''}`;
        } else {
          weatherDateTime = `${apiDate}`;
        }
      } catch {
        weatherDateTime = `${apiDate}`;
      }
    }
  }
  // fallback if no data
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
    const dt = new Date();
    const dayOfWeek = dt.toLocaleString('en-US', { weekday: 'long' });
    const month = dt.toLocaleString('en-US', { month: 'long' });
    const day = dt.getDate();
    const year = dt.getFullYear();
    weatherDateTime = `${dayOfWeek} ${month} ${day}, ${year} (Today)`;
  }

  // Video arrays
  const sunny = [
    { id: 1, title: 'Sunny Day', description: 'A bright and sunny day', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755203923/wpqph4m0pfcb5lnexqsm.mp4' },
    { id: 2, title: 'Mist', description: 'A bright and mist', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755517403/ay85ywxiwhprsp7vxkjk.mp4' }
  ];
  const rainy = [
    { id: 1, title: 'Rainy Day', description: 'A gloomy and rainy day', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204501/rtqrlbtwl6tqocjph1pu.mp4' },
    { id: 2, title: 'Rainy Day (Thunder)', description: 'A rainy day with thunder', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204459/egg1qcvp1z2rmptqcbwk.mp4' }
  ];
  const cloudy = [
    { id: 1, title: 'Cloudy Day', description: 'A cloudy day with overcast skies', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204739/elchoqvkskusz7n5dovq.mp4' },
    { id: 2, title: 'Fog', description: 'A foggy day with low visibility', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755517231/cdcrotdy0honk0hlyviu.mp4' }
  ];

  // VIDEO SELECTION BASED ON WEATHER AND SPECIAL CONDITIONS
  let bgVideos = [sunny[0]]; // default to sunny id:1
  const condRaw = String(weather.conditions || '').toLowerCase();

  if (condRaw.includes('fog')) {
    bgVideos = [cloudy.find(v => v.id === 2)]; // Fog video
  } else if (weather.icon === 'Rain') {
    if (condRaw.includes('thunder')) {
      bgVideos = [rainy.find(v => v.id === 2)];
    } else {
      bgVideos = [rainy.find(v => v.id === 1)];
    }
  } else if (weather.icon === 'Cloudy') {
    bgVideos = [cloudy.find(v => v.id === 1)];
  } else if (weather.icon === 'Sunny') {
    if (condRaw.includes('mist')) {
      bgVideos = [sunny.find(v => v.id === 2)];
    } else {
      bgVideos = [sunny.find(v => v.id === 1)];
    }
  }

  // Crossfade/video cycling with reset on weather/bgVideos change
  const [vidIndex, setVidIndex] = useState(0);
  const [prevVidIndex, setPrevVidIndex] = useState(null);
  const [vidFade, setVidFade] = useState(true);
  const vidFadeTimeout = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    setVidIndex(0);
    setPrevVidIndex(null);
    setVidFade(true);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setVidFade(false);
      vidFadeTimeout.current = setTimeout(() => {
        setPrevVidIndex(prev => prev === null ? 0 : (prev + 1) % bgVideos.length);
        setVidIndex(prev => (prev + 1) % bgVideos.length);
      }, 500); // fade duration
    }, 5000); // video duration

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (vidFadeTimeout.current) clearTimeout(vidFadeTimeout.current);
    };
  }, [bgVideos]); // Only reset when bgVideos (weather) changes

  // Fade in after fade out
  useEffect(() => {
    if (vidFade) return;
    const timer = setTimeout(() => setVidFade(true), 1);
    return () => clearTimeout(timer);
  }, [vidFade]);

  const currentVid = bgVideos[0];

  return (
    <div
      key={weather.icon + (weather.conditions || '')}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* BACKGROUND VIDEO */}
      <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",zIndex: 0, pointerEvents:'none'}}>
        <video
          key={currentVid.url}
          src={currentVid.url}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="background-media"
          style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
      {/* FOREGROUND CARD */}
      <div className='fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
        <LiquidGlassCard>
          <div className='p-4 w-screen lg:w-200'>
            <div className='absolute top-5 left-8 lg:left-5 flex justify-center items-center flex-col lg:flex-row group'>
              <Link to='/' className='flex justify-center items-center flex-col lg:flex-row'>
                <img src={address} alt='address-icon' className='w-10 h-10 mx-auto bg-amber-50 rounded-full group-active:scale-110 transition-transform duration-300 cursor-pointer' />
                <p className='text-[15px] lg:text-2xl ml-1 text-white font-bold cursor-pointer'>Location</p>
              </Link>
            </div>
            <div className='absolute top-5 right-8 w-50 lg:w-80'>
              <p className='text-xl text-center font-bold'>
                {weatherDateTime ? weatherDateTime : '---'}
              </p>
            </div>
            <div className="mb-8 text-center mt-10 flex flex-col justify-center items-center">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <span>{weather.location}</span>
              </h2>
              <AnimatedWeatherGif weatherType={weather.icon} large />
              <div className="text-4xl font-bold text-white mb-1">
                {Math.round(weather.temp)}°F
              </div>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {weather.conditions}
              </div>
              <div className="grid grid-cols-2 gap-6 mt-10 font-bold">
                <div className="flex  items-center gap-2"><span role="img" aria-label="Wind">💨</span> {Math.round(weather.windspeed)} mph <span className="text-xl ml-1 text-white">Wind</span></div>
                <div className="flex  items-center gap-2"><span role="img" aria-label="Rain">💧</span> {weather.precipprob}% <span className="text-xl ml-1 text-white">Rain</span></div>
                <div className="flex  items-center gap-2"><span role="img" aria-label="Humidity">🌡️</span> {weather.humidity}% <span className="text-xl ml-1 text-white">Humidity</span></div>
                <div className="flex items-center gap-2"><span role="img" aria-label="Visibility">🔭</span> {weather.visibility} mi <span className="text-xl ml-1 text-white">Visibility</span></div>
              </div>
            </div>
            <div className='flex flex-row justify-between items-center mt-10'>
              <img
                src={left}
                alt="Left Arrow"
                className={`w-12 bg-white rounded-full cursor-pointer active:scale-110 transition-transform duration-300 ${dayIndex <= 0 ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => {
                  if (dayIndex > 0) setDayIndex(dayIndex - 1);
                }}
              />
              <img
                src={right}
                alt="Right Arrow"
                className={`w-12 bg-white rounded-full cursor-pointer active:scale-110 transition-transform duration-300 ${apiData && apiData.days && dayIndex >= apiData.days.length - 1 ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => {
                  if (apiData && apiData.days && dayIndex < apiData.days.length - 1) setDayIndex(dayIndex + 1);
                }}
              />
            </div>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}

// filepath: c:\Users\USER\Desktop\My-Frontend-Projects\WeatherApp\Weather\src\pages\searchPage.jsx
async function fetchWeather(cityName) {
  try {
    // ...existing code...
    const res = await fetch(url);
    if (res.status === 429) {
      throw new Error("Too many requests. Please wait and try again.");
    }
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();
    return data;
  } catch (err) {
    alert(err.message); // Or set an error state and show in UI
    return null;
  }
}