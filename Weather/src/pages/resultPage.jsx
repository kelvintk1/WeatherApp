import React from 'react';
import {Link} from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard.jsx';
import address from '../assets/address.gif';
import sun1 from '../assets/sun1.gif';
import sun2 from '../assets/sun2.gif';
import rain1 from '../assets/rainC1.gif';
import rain2 from '../assets/rainC2.gif';
import cloud1 from '../assets/cloud1.gif';
import cloud2 from '../assets/cloud2.gif';

// Component to animate between gifs for sunny, rain, and cloud
import { useState, useEffect } from 'react';
function AnimatedWeatherGif({ weatherType, large }) {
  // Only handle: Sunny, Cloudy, Rain
  let gifs = null;
  let altText = '';

  if (
    weatherType === 'Sunny' ||
    weatherType === 'clear-day'
  ) {
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
  } else if (
    weatherType === 'Rain' ||
    weatherType === 'rain'
  ) {
    gifs = [rain1, rain2];
    altText = 'Rainy Weather Animation';
  }

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!gifs) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % gifs.length), 3000); // 3s
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
    const Sunny = [
        {
            id: 1,
            title: 'Sunny Day',
            description: 'A bright and sunny day',
            url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755203923/wpqph4m0pfcb5lnexqsm.mp4'
        },
        {
            id: 2,
            title: 'Sunny Day Image',
            description: 'A bright and sunny day image',
            url: 'https://res.cloudinary.com/dcmcrc4v3/image/upload/v1755204414/zklmxn4w3oaffvztwh5c.jpg'
        }
    ];

    const Rainy = [
        {
            id: 1,
            title: 'Rainy Day',
            description: 'A gloomy and rainy day',
            url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204459/egg1qcvp1z2rmptqcbwk.mp4'
        },
        {
            id: 2,
            title: 'Rainy Day',
            description: 'A gloomy and rainy day',
            url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204501/rtqrlbtwl6tqocjph1pu.mp4'
        },
        {
            id: 4,
            title: 'Rainy Day',
            description: 'A cloudy day with overcast skies',
            url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204614/se2lxuws3dwigjtjyy4i.mp4'
        }
    ];

    const Cloudy = [
        {
            id: 1,
            title: 'Cloud Day',
            description: 'A gloomy and rainy day',
            url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204529/az93vypbj2xonx3d4ugo.mp4'
        },
        {
            id: 2,
            title: 'Cloudy Day',
            description: 'A cloudy day with overcast skies',
            url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204674/ho7sz9myun6tcl4bpzec.mp4'
        },
        {
            id: 3,
            title: 'Cloudy Day',
            description: 'A cloudy day with overcast skies',
            url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204739/elchoqvkskusz7n5dovq.mp4'
        }
    ];

    const backgroundImage = 'https://res.cloudinary.com/dcmcrc4v3/image/upload/v1755204414/zklmxn4w3oaffvztwh5c.jpg'

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
            {/* WEATHER DISPLAY INTEGRATION START */}
            {/* Simple demo of weather data usage, using a similar WeatherData structure as your WeatherApp */}
            {/* In production, replace getMockWeatherData() with real data or props as needed */}

            {/* --- BEGIN WEATHER DISPLAY --- */}
            {(() => {
              // Mock data – replace with your real source/props as needed!
              const getMockWeatherData = (searchLocation = "New York, NY") => {
                const locations = [
                  { name: "New York, NY", temp: 72, conditions: "Partly Cloudy", icon: "partly-cloudy-day" },
                  { name: "Los Angeles, CA", temp: 78, conditions: "Sunny", icon: "clear-day" },
                  { name: "Chicago, IL", temp: 65, conditions: "Cloudy", icon: "cloudy" },
                  { name: "Rainy City", temp: 58, conditions: "Rainy", icon: "rain" },
                ];
                const randomLocation = locations[Math.floor(Math.random() * locations.length)];
                const baseTemp = randomLocation.temp;
                const hours = [];
                for (let i = 0; i < 48; i++) {
                  const hour = new Date();
                  hour.setHours(hour.getHours() + i);
                  const tempVariation = Math.sin(i*0.2)*8 + Math.random()*6 - 3;
                  const temp = Math.round(baseTemp + tempVariation);
                  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"][Math.floor(Math.random()*5)];
                  const icons = ["clear-day", "partly-cloudy-day", "cloudy", "rain", "clear-night"];
                  const icon = hour.getHours() < 6 || hour.getHours() > 18 ? "clear-night" : icons[Math.floor(Math.random()*4)];
                  hours.push({
                    datetime: hour.toTimeString().slice(0, 5),
                    temp,
                    conditions,
                    icon,
                    windspeed: Math.round(Math.random()*15 + 5),
                    precipprob: Math.round(Math.random()*60),
                    date: hour.toISOString().slice(0,10),
                  });
                }
                return {
                  location: searchLocation,
                  currentConditions: {
                    temp: randomLocation.temp,
                    conditions: randomLocation.conditions,
                    icon: randomLocation.icon,
                    windspeed: Math.round(Math.random()*15 + 5),
                    precipprob: Math.round(Math.random()*40),
                    humidity: Math.round(Math.random()*30 + 40),
                    visibility: Math.round(Math.random()*5 + 5),
                  },
                  forecast48: hours,
                };
              };

              // Replace this with a prop or via state/effect if data should be dynamic
              const mockWeather = getMockWeatherData();

              return (
                <>
                  {/* CURRENT WEATHER */}
                  <div className="mb-8 text-center mt-10 flex flex-col justify-center items-center">
                    <h2 className="text-3xl font-bold text-blue-700 mb-2 flex items-center justify-center gap-2">
                      <span>{mockWeather.location}</span>
                    </h2>
                    {/* AnimatedWeatherGif swaps between imported gifs for sunny, rain, cloud */}
                    <AnimatedWeatherGif weatherType={mockWeather.currentConditions.icon} large className='' />
                    <div className="text-4xl font-bold text-blue-900 mb-1">
                      {Math.round(mockWeather.currentConditions.temp)}°F
                    </div>
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {mockWeather.currentConditions.conditions}
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-10 font-bold">
                      <div className="flex gap-2"><span role="img" aria-label="Wind">💨</span> {Math.round(mockWeather.currentConditions.windspeed)} mph <span className="text-xl ml-1 text-white">Wind</span></div>
                      <div className="flex gap-2 ml-0 lg:ml-15"><span role="img" aria-label="Rain">💧</span> {mockWeather.currentConditions.precipprob}% <span className="text-xl ml-1 text-white">Rain</span></div>
                      <div className="flex gap-2"><span role="img" aria-label="Humidity">🌡️</span> {mockWeather.currentConditions.humidity}% <span className="text-xl ml-1 text-white">Humidity</span></div>
                      <div className="flex gap-2 ml-0 lg:ml-15"><span role="img" aria-label="Visibility">🔭</span> {mockWeather.currentConditions.visibility} mi <span className="text-xl ml-1 text-white">Visibility</span></div>
                    </div>
                  </div>
                  {/* 48-Hour Forecast */}
                  {/* <div>
                    <div className="font-bold text-xl text-blue-700 mb-3 text-center">48-Hour Forecast</div>
                    <div className="overflow-x-auto">
                      <div className="flex gap-3 pb-3" style={{ width: 'max-content' }}>
                        {mockWeather.forecast48.map((hour, index) => (
                          <div
                            key={`${hour.date}-${hour.datetime}`}
                            className="flex-shrink-0 text-center p-3 rounded-lg bg-blue-50 border border-blue-200 min-w-[100px]"
                            style={{ opacity: 1 - Math.abs(index-24)/50 }}
                          >
                            <div className="text-xs text-blue-500 mb-1">
                              {hour.datetime}
                            </div>
                            <div className="mb-1 flex justify-center">
                              <AnimatedWeatherGif weatherType={hour.icon} />
                            </div>
                            <div className="text-lg font-semibold text-blue-900 mb-0.5">{Math.round(hour.temp)}°F</div>
                            <div className="text-xs text-blue-800 mb-1">{hour.conditions}</div>
                            <div className="flex justify-between text-xs text-blue-700">
                              <span>💨 {Math.round(hour.windspeed)}</span> <span>💧 {hour.precipprob}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div> */}
                </>
              );
            })()}
            {/* WEATHER DISPLAY INTEGRATION END */}
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  )
}
