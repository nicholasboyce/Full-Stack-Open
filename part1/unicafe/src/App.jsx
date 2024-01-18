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

const Statistics = (props) => {
  const {good, neutral, bad} = props.counts;
  const total = good + neutral + bad;
  const average = total / 3;
  const positive = (good / total) * 100;

  return (
    <>
      <h1>statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {total}</p>
      <p>average {average}</p>
      <p>positive {positive} %</p>
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