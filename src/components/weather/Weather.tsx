import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import api from '@/service/axios.ts';

const onSearchWeather = async (cityName: string) => {
  try {
    let url = `/data/2.5/weather?q=${cityName}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

const Weather = () => {
  const [search, setSearch] = useState<string>('');
  const [weather, setWeather] = useState<any>({
    humidity: 0,
    windSpeed: 0,
    temp: '-',
    location: '-',
    icon: '',
  });

  const onSearch = async (search: string) => {
    if (!search) return;

    console.log('onSearch :>> ', search);
    try {
      const data = await onSearchWeather(search);
      console.log('data :>> ', data);
      setWeather({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temp: Math.floor(data.main.temp),
        location: data.name,
        icon: `https://openweathermap.org/payload/api/media/file/${data.weather[0].icon}.png` || '',
      });
    } catch (error) {}
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(search);
    }, 400);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  return (
    <>
      <div className='bg-slate-200 h-screen p-5 flex justify-center items-center'>
        <div className='bg-indigo-800 h-[650px] w-[450px] rounded-xl p-5 grid grid-row-12'>
          <div className='row-span-1'>
           <TextField
  label="Search"
  value={search}
  variant="filled"
  fullWidth
  onChange={(e) => setSearch(e.target.value)}
  sx={{
    '& .MuiFilledInput-root': {
      borderRadius: '10px',
      backgroundColor: 'white',
      // overflow: 'hidden',
    },
  }}
/>
          </div>
          <div className='text-white row-span-9 p-3 rounded-lg flex flex-col gap-y-3 items-center'>
            <img src={weather.icon} className='w-[190px] h-[190px]' alt='weather-icon' />
            <div className='flex flex-col text-center'>
              <span className='font-medium text-7xl'>{weather.temp}°C</span>
              <span className='text-center text-4xl font-light mt-2'>{weather.location}</span>
            </div>
          </div>
          <div className='flex gap-x-2'>
            <div className='w-1/2 mt-4 gap-2'>
              <div className='col-span-1 border border-slate-400 p-3 rounded-lg flex flex-col items-start'>
                <span className='text-center text-base text-yellow-500'>Humidity</span>
                <span className='text-white text-2xl font-light'>{weather.humidity ?? 0} %</span>
              </div>
            </div>

            <div className='w-1/2 mt-4 gap-2'>
              <div className='col-span-1 border border-slate-400 p-3 rounded-lg flex flex-col items-start'>
                <span className='text-center text-base text-yellow-500'>Wind Speed</span>
                <span className='text-white text-2xl font-light'>{weather.windSpeed ?? 0} Km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Weather;
