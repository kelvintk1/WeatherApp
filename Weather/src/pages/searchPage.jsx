import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoText } from '../components/VideoText.tsx';
import './searchPage.css';
import LiquidGlassCard from '../components/LiquidGlassCard.jsx';
import LiquidGlassSpinner from '../components/LiquidGlassSpinner.jsx';
import { TextAnimate } from '../components/TextAnimate.tsx';
import { GradientButton} from '../components/gradient-button';
import search from '../assets/search.gif';
import location from '../assets/location.gif';
import refresh from '../assets/refresh1.gif';

export default function SearchPage() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const API_KEY = '71f83a8fe0e34645887102209251808'; // <-- Replace with your WeatherAPI key

  // Helper to format date as YYYY-MM-DD
  const toISODate = d => d.toISOString().slice(0,10);

  // Fetch past 7 days and next 7 days (WeatherAPI needs separate calls)
  async function fetchWeather(cityName) {
    try {
      const today = new Date();
      const startHistory = new Date();
      startHistory.setDate(today.getDate() - 7);

      // 1. Fetch past 7 days (history)
      const historyPromises = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startHistory);
        date.setDate(startHistory.getDate() + i);
        const url = `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${encodeURIComponent(cityName)}&dt=${toISODate(date)}`;
        historyPromises.push(fetch(url).then(res => {
          if (res.status === 429) throw new Error("Too many requests. Please wait and try again.");
          if (!res.ok) throw new Error("Not found");
          return res.json();
        }));
      }
      const historyResults = await Promise.all(historyPromises);

      // 2. Fetch today + next 7 days (forecast)
      const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(cityName)}&days=8&aqi=no&alerts=no`;
      const forecastRes = await fetch(forecastUrl);
      if (forecastRes.status === 429) throw new Error("Too many requests. Please wait and try again.");
      if (!forecastRes.ok) throw new Error("Not found");
      const forecastData = await forecastRes.json();

      // 3. Combine all days into a single array
      const days = [
        ...historyResults.map(h => ({
          ...h.forecast.forecastday[0],
          source: 'history'
        })),
        ...forecastData.forecast.forecastday.map(f => ({
          ...f,
          source: 'forecast'
        }))
      ];

      // 4. Return a unified object similar to your previous API
      return {
        location: forecastData.location,
        days,
        timezone: forecastData.location.tz_id,
        city: forecastData.location.name
      };
    } catch (err) {
      alert(err.message);
      return null;
    }
  }

  const handleSearch = async () => {
    if (!city.trim()) return;
    setIsSearching(true);
    const cacheKey = `weatherapi_${city.trim().toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setTimeout(() => {
        navigate('/result', { state: { weatherData: JSON.parse(cached), city } });
        setIsSearching(false);
      }, 2000);
      return;
    }
    const weatherData = await fetchWeather(city.trim());
    setTimeout(() => {
      setIsSearching(false);
      if (weatherData) {
        localStorage.setItem(cacheKey, JSON.stringify(weatherData));
        navigate('/result', { state: { weatherData, city } });
      }
    }, 2000);
  };

  // Get weather for user's current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = `${latitude},${longitude}`;
        const cacheKey = `weatherapi_${coords}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setTimeout(() => {
            navigate('/result', { state: { weatherData: JSON.parse(cached), city: "Your Location" } });
            setIsSearching(false);
          }, 2000);
          return;
        }
        const weatherData = await fetchWeather(coords);
        setTimeout(() => {
          setIsSearching(false);
          if (weatherData) {
            localStorage.setItem(cacheKey, JSON.stringify(weatherData));
            navigate('/result', { state: { weatherData, city: "Your Location" } });
          }
        }, 2000);
      },
      (error) => {
        setIsSearching(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location access denied. Please turn on your device location and allow access.");
        } else {
          alert("Unable to retrieve your location.");
        }
      }
    );
  };

  // Main fixes for video blinking and flash
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const fadeTimeout = useRef(null);
  const slider = [
    { id: 1, title: 'Sunny Day Image', description: 'A bright and sunny day image', url: 'https://res.cloudinary.com/dcmcrc4v3/image/upload/v1755204414/zklmxn4w3oaffvztwh5c.jpg' },
    { id: 2, title: 'Sunny Day', description: 'A bright and sunny day', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755203923/wpqph4m0pfcb5lnexqsm.mp4' },
    { id: 3, title: 'Rainy Day', description: 'A gloomy and rainy day', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204459/egg1qcvp1z2rmptqcbwk.mp4' },
    { id: 4, title: 'Rainy Day', description: 'A gloomy and rainy day', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204501/rtqrlbtwl6tqocjph1pu.mp4' },
    { id: 5, title: 'Cloud Day', description: 'A gloomy and rainy day', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204529/az93vypbj2xonx3d4ugo.mp4' },
    { id: 6, title: 'Rainy Day', description: 'A cloudy day with overcast skies', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204614/se2lxuws3dwigjtjyy4i.mp4' },
    { id: 7, title: 'Cloudy Day', description: 'A cloudy day with overcast skies', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204674/ho7sz9myun6tcl4bpzec.mp4' },
    { id: 8, title: 'Cloudy Day', description: 'A cloudy day with overcast skies', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204739/elchoqvkskusz7n5dovq.mp4' },
    { id: 9, title: 'Sunny Day', description: 'A bright and sunny day', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755206775/wiaa0qmj7xe2pp5sgvce.mp4' }
  ];

  const rainbow = 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755206775/wiaa0qmj7xe2pp5sgvce.mp4';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    let mounted = true;
    const interval = setInterval(() => {
      setFade(false); // start fade out
      fadeTimeout.current = setTimeout(() => {
        if (mounted) {
          setPrevIndex(currentIndex); // store old slide
          setCurrentIndex((prev) => (prev + 1) % slider.length);
          setMediaLoaded(false); // reset loaded
        }
      }, 500); // fade duration
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, [currentIndex, slider.length]);

  // When media is loaded and fade is not shown yet, fade in
  useEffect(() => {
    if (mediaLoaded) {
      setFade(true);
    }
  }, [mediaLoaded]);

  const currentSlide = slider[currentIndex];
  const prevSlide = prevIndex !== null ? slider[prevIndex] : null;
  const isVideo = currentSlide.url.endsWith('.mp4');
  const prevIsVideo = prevSlide && prevSlide.url.endsWith('.mp4');

  return (
    <div className="slider-container" style={{background: '#000', position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden'}}>
      {/* Crossfade Previous and Current Slides as BACKGROUND layer */}
      <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",zIndex:0, pointerEvents:'none'}}>
        {/* Previous Slide: fade out */}
        {prevSlide && (
          <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",zIndex:1, opacity: fade ? 0 : 1, transition:"opacity 0.5s"}}>
            {prevIsVideo ? (
              <video
                src={prevSlide.url}
                autoPlay
                loop
                muted
                playsInline
                className="background-media"
                style={{width:'100%',height:'100%',objectFit:'cover'}}
              />
            ) : (
              <div
                className="background-image"
                style={{backgroundImage: `url(${prevSlide.url})`,width:'100%',height:'100%',backgroundSize:'cover',backgroundPosition:'center'}}
              />
            )}
          </div>
        )}
        {/* Current Slide: fade in */}
        <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",zIndex:2, opacity: fade ? 1 : 0, transition:"opacity 0.5s"}}>
          {isVideo ? (
            <video
              src={currentSlide.url}
              autoPlay
              loop
              muted
              playsInline
              className="background-media"
              onLoadedData={() => setMediaLoaded(true)}
              style={{width:'100%',height:'100%',objectFit:'cover'}}
            />
          ) : (
            <div
              className="background-image"
              style={{backgroundImage: `url(${currentSlide.url})`,width:'100%',height:'100%',backgroundSize:'cover',backgroundPosition:'center'}}
              onLoad={() => setMediaLoaded(true)}
            />
          )}
        </div>
      </div>

      {/* Foreground content with position/context ABOVE background (z-index: 1+) */}
      <div style={{position: 'relative', zIndex: 10}}>
        <div className="relative flex flex-col justify-center items-center text-white pt-4">
          <VideoText src={rainbow} fontSize={10} fontWeight="bold">
            Weather App
            </VideoText>
          <p className="text-2xl text-center italic -mt-25 lg:-mt-19">
            Get detailed weather information for any location
          </p>
        </div>
        <div className='relative flex justify-center items-center mt-15'>
          {/* Show the card only if not searching */}
          {!isSearching && (
            <LiquidGlassCard>
              <div className='flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-3'>
                <span>
                  <input
                    type='text'
                    placeholder='Enter city name...'
                    className='p-3 rounded-md w-full lg:w-100 border-3 font-bold text-2xl'
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    name="city" // <-- Add this line
                    id="city-input" // <-- Optionally add this line
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                </span>
                <span className='flex items-center justify-center'>
                  <img
                    src={location}
                    alt='location-icon'
                    title="Use my location"
                    className='w-13 absolute right-3 lg:relative lg:ml-5 bg-amber-50 rounded-4xl cursor-pointer active:scale-115 transition-transform duration-300 ease-in-out'
                    onClick={handleUseCurrentLocation}
                  />
                  <img
                    src={refresh}
                    alt='refresh-icon'
                    title="Clear"
                    className='w-13 absolute left-3 lg:relative lg:-ml-3 bg-amber-50 rounded-4xl cursor-pointer active:scale-115 transition-transform duration-300 ease-in-out'
                    onClick={() => setCity("")}
                  />
                </span>
              </div>
              <GradientButton
                className='mt-6 w-35 h-15 rounded-2xl text-white font-bold text-2xl cursor-pointer flex justify-center items-center active:scale-110 transition-transform duration-300 ease-in-out'
                onClick={handleSearch}
              >
                <img src={search} alt='search-icon' className='w-7' />
                <p>Search</p>
              </GradientButton>
            </LiquidGlassCard>
          )}
        </div>
        {/* Loading Spinner and animated text shown after search click */}
        {isSearching && (
          <div className='flex flex-col justify-center items-center mt-10'>
            <LiquidGlassSpinner className='absolute top-0 left-0 w-full h-full flex items-center justify-center' />
            <TextAnimate text='Loading...' type='popIn' />
          </div>
        )}
      </div>
    </div>
  );
}
