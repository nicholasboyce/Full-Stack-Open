const Person = (props) => {
    const { name, number, id, handleDelete } = props;
    return (
      <li>{name} {number} <button onClick={() => handleDelete(id)}>delete</button></li>
    )
}

const Persons = (props) => {
    const { people, handleDelete } = props;
    return (
      <ul>
        {people.map(person => <Person key={person.id} name={person.name} number={person.number} id={person.id} handleDelete={handleDelete} />)}
      </ul>
    )
}

export default Persons;