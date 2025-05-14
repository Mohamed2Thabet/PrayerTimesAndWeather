import axios from "axios";

const WEATHER_API_KEY = "924adc21623e42b48e2155352251405";

export const fetchCountries = async () => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    return response.data
      .sort((a, b) => a.name.common.localeCompare(b.name.common))
      .map(country => ({
        value: country.cca2,
        label: country.name.common,
        cities: country.capital ? [country.capital[0]] : []
      }));
  } catch (error) {
    throw new Error('Failed to fetch countries: ' + error.message);
  }
};

export const fetchCities = async (countryName) => {
  try {
    const response = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/cities',
      { country: countryName },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.data && response.data.data) {
      return response.data.data
        .sort((a, b) => a.localeCompare(b))
        .map(city => ({
          value: city,
          label: city
        }));
    }
    throw new Error('No cities found');
  } catch (error) {
    console.error('Error fetching cities:', error);
    // If API fails, return at least the capital city if available
    const countryResponse = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
    const country = countryResponse.data[0];
    if (country && country.capital) {
      return country.capital.map(city => ({
        value: city,
        label: city
      }));
    }
    return [];
  }
};

export const fetchPrayerTimes = async (city, country) => {
  try {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity`,
      {
        params: {
          city,
          country,
          method: 5, // Muslim World League method
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch prayer times: ' + error.message);
  }
};

export const fetchWeather = async (city) => {
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json`,
      {
        params: {
          key: WEATHER_API_KEY,
          q: city,
          aqi: 'no'
        }
      }
    );

    const data = response.data;
    return {
      temp: data.current.temp_c,
      condition: data.current.condition.text,
      icon: data.current.condition.icon,
      description: data.current.condition.text,
      humidity: data.current.humidity,
      wind_speed: data.current.wind_kph,
      feels_like: data.current.feelslike_c
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid Weather API key or unauthorized access');
    }
    throw new Error('Failed to fetch weather: ' + error.message);
  }
};
