import Person from './Person';
import personService from '../services/person';

const Numbers = ({ filtered, setPersons, setMessageState, setMessage }) => {
  const remove = (id) => {
    const person = filtered.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      const name = person.name;
      personService
        .remove(person.id)
        .then(() => {
          setPersons(filtered.filter((person) => person.id !== id));
          setMessageState('success');
          setMessage(`${name} deleted successfully`);

          setTimeout(() => {
            setMessage(null);
          }, 3000);
        })
        .catch(() => {
          setMessageState('error');
          setMessage(
            `Information of ${name} has already been deleted from the server`
          );

          setTimeout(() => {
            setMessage(null);
          }, 3000);
        });
    }
  };

  return (
    <ul>
      {filtered.map((person) => (
        <Person
          key={person.name}
          person={person}
          remove={() => remove(person.id)}
        />
      ))}
    </ul>
  );
};

export default Numbers;
