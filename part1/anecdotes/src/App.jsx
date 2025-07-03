import { useState } from 'react';
import './App.css';

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;

const Title = ({ size, title }) => {
  const Tag = size;
  return <Tag>{title}</Tag>;
};

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.',
  ];
  const arrayWithZeros = new Uint8Array(anecdotes.length);

  const [selected, setSelected] = useState(0);
  const [votes, addVotes] = useState(arrayWithZeros);

  const generateAnecdoteIndex = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const addVote = () => {
    const votesCopy = [...votes];
    votesCopy[selected] += 1;
    addVotes(votesCopy);
  };

  return (
    <div>
      <Title size={'h1'} title={'Anecdote of the day'} />
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <Button text={'vote'} onClick={addVote} />
      <Button text={'Next anecdote'} onClick={generateAnecdoteIndex} />
      <Title size={'h1'} title={'Anecdote with most votes'} />
      <div>{anecdotes[votes.indexOf(Math.max(...votes))]}</div>
      <div>has {Math.max(...votes)} votes</div>
    </div>
  );
};

export default App;
