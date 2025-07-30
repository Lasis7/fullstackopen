import '../index.css';

const Input = ({ value, emptySearchbar, searchChange }) => {
  return (
    <div>
      find countries
      <input value={value} onClick={emptySearchbar} onChange={searchChange} />
    </div>
  );
};

export default Input;
