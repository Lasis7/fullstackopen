import { useState, useEffect } from 'react';
import personService from './services/person';
import Numbers from './components/Numbers';
import Filter from './components/Filter';
import Inputs from './components/Inputs';
import Message from './components/Message';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFiltered] = useState('');
  const [message, setMessage] = useState(null);
  const [messageState, setMessageState] = useState('');

  useEffect(() => {
    personService.getAll().then((people) => {
      setPersons(people);
    });
  }, []);

  const filtered =
    filter.length < 1
      ? persons
      : persons.filter((person) => person.name.includes(filter));

  const addPerson = (event) => {
    event.preventDefault();
    // for (let person of persons) {
    //   if (person.name.toUpperCase() === newName.toUpperCase()) {
    //     alert(`${newName} is already added to phonebook`);
    //     return;
    //   }
    // }
    for (let person of persons) {
      if (person.name.toUpperCase() === newName.toUpperCase()) {
        if (
          window.confirm(
            `${newName} is already in the phonebook, replace the old number with the new one?`
          )
        ) {
          const updatedUser = { ...person, number: newNumber };
          personService
            .update(person.id, updatedUser)
            .then((response) => {
              setPersons(
                persons.map((guy) => (guy.id !== person.id ? guy : response))
              );
              setMessageState('success');
              setMessage(`${newName}'s number updated`);

              setTimeout(() => {
                setMessage(null);
              }, 3000);
            })
            .catch(() => {
              setMessageState('error');
              setMessage(
                `Information of ${person.name} has already been deleted from the server`
              );

              setTimeout(() => {
                setMessage(null);
              }, 3000);
            });
        }
        return;
      }
    }
    const newPerson = { name: newName, number: newNumber };
    personService.create(newPerson).then((response) => {
      const name = newName;
      setPersons(persons.concat(response));
      setNewName('');
      setNewNumber('');
      setMessageState('success');
      setMessage(`${name} added successfully`);

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFiltered(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <Message message={message} messageState={messageState} />
      <form onSubmit={addPerson}>
        <Inputs text={'name'} value={newName} handleChange={handleNameChange} />
        <Inputs
          text={'number'}
          value={newNumber}
          handleChange={handleNumberChange}
        />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Numbers
        filtered={filtered}
        setPersons={setPersons}
        setMessageState={setMessageState}
        setMessage={setMessage}
      />
    </div>
  );
};

export default App;
