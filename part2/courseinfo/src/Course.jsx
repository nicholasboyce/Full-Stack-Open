const Total = (props) => {
    const { parts } = props;
    const total = parts.reduce((acc, curr) => acc + curr.exercises, 0);
    return <p><strong>total of {total} exercises</strong></p>
  }
  
const Part = (props) => {
    const { name, exercises } = props;
    return <p>{name} {exercises}</p>
}
  
const Content = (props) => {
    const { parts } = props;
    return (
      parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)
    )
}
  
const Heading = ({ course }) => {
    return <h1>{course}</h1>
}
  
const Course = ({ course }) => {
    return (
      <>
      <Heading course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
      </>
    )
}

export default Course;