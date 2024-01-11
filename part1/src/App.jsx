function Heading(props) {
  return (
    <h1>{props.course}</h1>
  )
}

function Part(props) {
  return (
    <p>{props.part} {props.exercises}</p>
  )
}

function Content(props) {
  return (
    <div>
      <Part part={props.parts[0].name} exercises={props.parts[0].exercises} />
      <Part part={props.parts[1].name} exercises= {props.parts[1].exercises} />
      <Part part={props.parts[2].name} exercises={props.parts[2].exercises} />
    </div>
  )
}

function Total(props) {
  const total = props.parts.reduce((result, currPart) => result + currPart.exercises, 0)
  return (
    <>
     <p>Number of exercises {total}</p>
    </>
  )
}

function App() {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Heading course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App
