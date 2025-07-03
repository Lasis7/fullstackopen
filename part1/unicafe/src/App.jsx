import { useState } from 'react';
import './app.css';

const Title = ({ size, title }) => {
  const Tag = size;
  return <Tag>{title}</Tag>;
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const StatisticsLine = ({ text, value }) => {
  if (text == 'positive') {
    return (
      <td>
        {text} {value} %
      </td>
    );
  }
  return (
    <td>
      {text} {value}
    </td>
  );
};

const Statistics = ({ good, neutral, bad, sum }) => {
  if (good == 0 && neutral == 0 && bad == 0) {
    return <div>no feedback given</div>;
  }
  return (
    <table>
      <tbody>
        <tr>
          <StatisticsLine text={'good'} value={good} />
        </tr>
        <tr>
          <StatisticsLine text={'neutral'} value={neutral} />
        </tr>
        <tr>
          <StatisticsLine text={'bad'} value={bad} />
        </tr>
        <tr>
          <StatisticsLine text={'sum'} value={sum} />
        </tr>
        <tr>
          <StatisticsLine
            text={'average'}
            value={(good + neutral * 0 + bad * -1) / sum}
          />
        </tr>
        <tr>
          <StatisticsLine text={'positive'} value={(good / sum) * 100} />
        </tr>
      </tbody>
    </table>
  );
};

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const sum = good + neutral + bad;

  const goodFeedback = () => setGood(good + 1);
  const neutralFeedback = () => setNeutral(neutral + 1);
  const badFeedback = () => setBad(bad + 1);

  return (
    <div>
      <Title size="h1" title={'give feedback'} />
      <Button onClick={goodFeedback} text={'good'} />
      <Button onClick={neutralFeedback} text={'neutral'} />
      <Button onClick={badFeedback} text={'bad'} />
      <Title size={'h2'} title={'statistics'} />
      <Statistics good={good} neutral={neutral} bad={bad} sum={sum} />
    </div>
  );
};

export default App;
