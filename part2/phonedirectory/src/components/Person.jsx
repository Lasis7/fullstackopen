import '../index.css';

const Person = ({ person, remove }) => {
  return (
    <li key={person.id}>
      <div>
        {person.name} {person.number}
        <button className="margin" onClick={remove}>
          delete
        </button>
      </div>
    </li>
  );
};

export default Person;
