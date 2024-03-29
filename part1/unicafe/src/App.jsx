import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>{props.text}</button>
  )
}

const Feedback = (props) => {
  return (
    <>
    <h1>give feedback</h1>
    <Button text='good' handleClick={props.goodClick} />
    <Button text='neutral' handleClick={props.neutralClick} />
    <Button text='bad' handleClick={props.badClick} />
    </>
  )
}

const StatisticLine = ({text, value}) => {
  let symbol = '';
  if (text === "positive") {
    symbol = '%'
  }
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
      <td>{symbol}</td>
    </tr>
      
  )
}

const Statistics = (props) => {
  const {good, neutral, bad} = props.counts;
  const total = good + neutral + bad;
  const average = ((good * 1) + (bad * -1)) / total;
  const positive = (good / total) * 100;

  if (!good && !neutral && !bad) {
    return (
      <p>No feedback given</p>
    )
  }

  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodClick = () => {
    const newGood = good + 1
    setGood(newGood)
  }

  const neutralClick = () => {
    const newNeutral = neutral + 1
    setNeutral(newNeutral)
  }

  const badClick = () => {
    const newBad = bad + 1
    setBad(newBad)
  }

  const counts = {
    good,
    neutral,
    bad
  }

  return (
    <div>
      <Feedback goodClick={goodClick} neutralClick={neutralClick} badClick={badClick} />
      <Statistics counts={counts} />
    </div>
  )
}

export default App