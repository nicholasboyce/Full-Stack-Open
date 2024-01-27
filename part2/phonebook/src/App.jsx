import { useState } from 'react'

const Person = (props) => {
  const { name, number } = props;
  return (
    <li>{name} {number}</li>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const validInput = (entry) => {
    const candidate = JSON.stringify(entry);
    if (entry.name === '') return false;
    persons.forEach(person => {
      if (JSON.stringify(person) === candidate) {
        return false;
      }
    })
    return true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if (newPerson.name == '') {
      alert('A name must be added.');
    } else if (validInput(newPerson)) {
      const newPersonsList = persons.concat(newPerson);
      setPersons(newPersonsList);
      setNewName('');
      setNewNumber('');
    } else {
      alert(`${newPerson.name} is already added to the phonebook.`);
    }
  }

  const peopleToShow = persons.map(person => <Person key={person.name} name={person.name} number={person.number} />);

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
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
