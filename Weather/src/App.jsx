import React, { useEffect, useState } from 'react';
import { VideoText } from './components/VideoText.tsx';
import './App.css';
import LiquidGlassCard from './components/LiquidGlassCard.jsx';
import { GradientButton} from './components/gradient-button';
import search from './assets/search.gif';

export default function App() {
  const slider = [
    { id: 1, title: 'Sunny Day', description: 'A bright and sunny day', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755203923/wpqph4m0pfcb5lnexqsm.mp4' },
    { id: 2, title: 'Sunny Day Image', description: 'A bright and sunny day image', url: 'https://res.cloudinary.com/dcmcrc4v3/image/upload/v1755204414/zklmxn4w3oaffvztwh5c.jpg' },
    { id: 3, title: 'Rainy Day', description: 'A gloomy and rainy day', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204459/egg1qcvp1z2rmptqcbwk.mp4' },
    { id: 4, title: 'Rainy Day', description: 'A gloomy and rainy day', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204501/rtqrlbtwl6tqocjph1pu.mp4' },
    { id: 5, title: 'Cloud Day', description: 'A gloomy and rainy day', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204529/az93vypbj2xonx3d4ugo.mp4' },
    { id: 6, title: 'Rainy Day', description: 'A cloudy day with overcast skies', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204614/se2lxuws3dwigjtjyy4i.mp4' },
    { id: 7, title: 'Cloudy Day', description: 'A cloudy day with overcast skies', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204674/ho7sz9myun6tcl4bpzec.mp4' },
    { id: 8, title: 'Cloudy Day', description: 'A cloudy day with overcast skies', url: 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755204739/elchoqvkskusz7n5dovq.mp4' }
  ];

  const rainbow = 'https://res.cloudinary.com/dcmcrc4v3/video/upload/v1755206775/wiaa0qmj7xe2pp5sgvce.mp4';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // fade out
      setTimeout(() => {
        setPrevIndex(currentIndex); // store old slide
        setCurrentIndex((prev) => (prev + 1) % slider.length);
        setFade(true); // fade in
      }, 500); // match fade duration
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, slider.length]);

  const currentSlide = slider[currentIndex];
  const prevSlide = prevIndex !== null ? slider[prevIndex] : null;
  const isVideo = currentSlide.url.endsWith('.mp4');
  const prevIsVideo = prevSlide && prevSlide.url.endsWith('.mp4');

  return (
    <div className="slider-container">
      {/* Previous Slide (fading out) */}
      {prevSlide && (
        <div className={`slide fade-out`}>
          {prevIsVideo ? (
            <video
              src={prevSlide.url}
              autoPlay
              loop
              muted
              playsInline
              className="background-media"
            />
          ) : (
            <div
              className="background-image"
              style={{ backgroundImage: `url(${prevSlide.url})` }}
            />
          )}
        </div>
      )}

      {/* Current Slide (fading in) */}
      <div className={`slide ${fade ? 'fade-in' : ''}`}>
        {isVideo ? (
          <video
            src={currentSlide.url}
            autoPlay
            loop
            muted
            playsInline
            className="background-media"
          />
        ) : (
          <div
            className="background-image"
            style={{ backgroundImage: `url(${currentSlide.url})` }}
          />
        )}
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-white pt-4">
        <VideoText src={rainbow} fontSize={10} fontWeight="bold">
          Weather App
        </VideoText>
        <p className="text-2xl text-center italic -mt-25 lg:-mt-19">
          Get detailed weather information for any location
        </p>
      </div>
      <div className='relative flex justify-center items-center mt-15'>
        <LiquidGlassCard>
          <div className='flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-3'>
            <span>
              <input type='text' placeholder='Enter city name...' className='p-3 rounded-md w-screen lg:w-100 border-2 font-bold text-2xl' />
            </span>
              <GradientButton className='ml-2 w-35 h-15 rounded-2xl text-white font-bold text-2xl cursor-pointer flex justify-center items-center'>
                <img src={search} alt='search-icon' className='w-7'/>
                <p>Search</p>
              </GradientButton>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}
