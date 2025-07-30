import { useState, useEffect } from 'react';
import Input from './components/Input';
import axios from 'axios';
import Countries from './components/Countries';

const App = () => {
  const [searchTerm, setSeachTerm] = useState('type here...');
  const [countries, setCountries] = useState([]);

  const filteredCountries = countries.filter((country) =>
    country.name.toUpperCase().includes(searchTerm.toUpperCase())
  );

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(
          response.data.map((country) => ({
            name: country.name.common,
            capital: country.capital,
            area: country.area,
            languages: country.languages,
            flag: country.flags.png,
            alt: country.flags.alt,
          }))
        );
      });
  }, []);

  const handleSearchChange = (event) => {
    setSeachTerm(event.target.value);
  };

  const emptySearchbar = () => {
    if (searchTerm === 'type here...') {
      setSeachTerm('');
    }
  };

  return (
    <div>
      <Input
        value={searchTerm}
        emptySearchbar={emptySearchbar}
        searchChange={handleSearchChange}
      />
      <Countries
        countries={filteredCountries}
        searchTerm={searchTerm}
        setCountries={setCountries}
      />
    </div>
  );
};

export default App;
