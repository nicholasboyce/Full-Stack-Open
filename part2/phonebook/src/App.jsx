import { useState } from 'react'

const Person = (props) => {
  const { name } = props;
  return (
    <li>{name}</li>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleInputChange = (event) => {
    setNewName(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName
    }
    const newPersonsList = persons.concat(newPerson);
    setPersons(newPersonsList);
    setNewName('');
  }

  const peopleToShow = persons.map(person => <Person key={person.name} name={person.name} />);

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleInputChange} />
        </div>
        <div>
          <button type="submit" onClick={handleSubmit} >add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {peopleToShow}
      </ul>
    </div>
  )
}

export default App
