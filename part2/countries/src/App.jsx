import { useState, useEffect } from 'react'
import axios from 'axios';



const Country = ({ data, isShowing }) => {
  const [weather, setWeather] = useState(null);

  const secretKey = import.meta.env.VITE_API_KEY;
  const title = data.name.common;
  const capital = data.capital[0];
  const area = data.area;
  const languages = Object.values(data.languages);
  const flag = data.flags.svg;

  useEffect(() => {
    let valid = true;

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${secretKey}`)
      .then(response => response.data)
      .then((json) => {
        if (valid) {
          setWeather(json);
        }
      })
  }, [capital])

  if (isShowing) {
    return (
      <>
      <h1>{title}</h1>
      <p>Capital: {capital}</p>
      <p>Area: {area}</p>
    
      <h3>Languages:</h3>
      <ul>
        {languages.map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={flag} />
      {weather && 
      <>
        <h2>Weather in {capital}</h2>
        <p>temperature: {weather.main.temp - 273} Celsius</p>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} />
        <p>wind {weather.wind.speed}m/s</p>
      </>
      }
      </>
    )
  }
}

const CountryLineItem = (props) => {
  const { name, data } = props;
  const [showCountry, setShowCountry] = useState(false);
  return (
    <li>
      {name} <button onClick={() => setShowCountry(!showCountry)}>{showCountry ? 'hide' : 'show'}</button>
      <Country data={data} isShowing={showCountry} />
    </li>
  )
}

const Countries = ({ list }) => {
  if (list.length > 10) {
    return <p>Too many countries, specify another filter</p>
  } else if (list.length === 1) {
    return <Country data={list[0]} isShowing={true} />
  } else {
    return (
      <ul>
        {list.map(country => <CountryLineItem key={country.name.official} name={country.name.official} data={country} />)}
      </ul>
    )
  }
}

function App() {

  const [countries, setCountries] = useState([]);
  const [countriesToShow, setCountriesToShow] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let valid = true;

    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => response.data)
      .then((data) => {
        if (valid) {
          setCountries(data)
        }
      });
    
    return () => valid = false;
  }, [])

  const handleQueryChange = (e) => {
    const search = e.target.value.toLowerCase();
    const newList = countries.filter(country => country.name.common.toLowerCase().startsWith(search));
    setCountriesToShow(newList);
    setQuery(search);
  }



  return (
    <>
    find countries: <input type="text" value={query} onChange={handleQueryChange} />
    <Countries list={countriesToShow} />
    </>
  )
}

export default App
