import { useState, useEffect } from 'react';
import Button from './Button';
import axios from 'axios';

const Countries = ({ countries, searchTerm, setCountries }) => {
  const [weather, setWeather] = useState({});
  const apikey = import.meta.env.VITE_KEY;

  useEffect(() => {
    if (countries.length === 1) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${countries[0].capital}&appid=${apikey}`
        )
        .then((response) => {
          setWeather({
            temp: Number(response.data.main.temp) - 275.15,
            icon: response.data.weather[0].icon,
            alt: response.data.weather[0].description,
            wind: response.data.wind.speed,
          });
        });
    }
  }, [countries, apikey]);

  useEffect(() => {
    console.log(weather);
  }, [weather]);

  const objectValues = (object) => {
    return Object.values(object);
  };

  const findCountry = (countryName) => {
    const country = countries.find((c) => c.name === countryName);
    setCountries([].concat(country));
  };

  if (searchTerm.length === 0) {
    return <div>Type into the search bar to filter countries</div>;
  } else if (countries.length > 1 && countries.length <= 10) {
    return (
      <div className="countryList">
        {countries.map((country) => (
          <div key={country.name} className="country">
            {country.name}
            <Button showCountry={() => findCountry(country.name)} />
          </div>
        ))}
      </div>
    );
  } else if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length === 1) {
    return (
      <div>
        <h1>{countries[0].name}</h1>
        <div>Capital {countries[0].capital}</div>
        <div>Area {countries[0].area}</div>
        <h2>Languages</h2>
        <ul>
          {objectValues(countries[0].languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={countries[0].flag} alt={countries[0].alt} />
        <h1>Weather in {countries[0].capital}</h1>
        <div>Temperature {weather.temp.toFixed(2)} Celsius</div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.alt}
        />
        <div>Wind {weather.wind} m/s</div>
      </div>
    );
  }
};

export default Countries;
