const Person = (props) => {
    const { name, number } = props;
    return (
      <li>{name} {number}</li>
    )
}

const Persons = (props) => {
    const { people } = props;
    return (
      <ul>
        {people.map(person => <Person key={person.name} name={person.name} number={person.number} />)}
      </ul>
    )
}

export default Persons;