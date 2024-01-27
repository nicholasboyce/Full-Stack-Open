import { useState } from 'react'

const Person = (props) => {
  const { name, number } = props;
  return (
    <li>{name} {number}</li>
  )
}

const PersonForm = (props) => {
  const { name, number, nameHandler, numberHandler, handleSubmit} = props;
  return (
    <form>
      <div>
        name: <input value={name} onChange={nameHandler} />
      </div>
      <div>
        number: <input value={number} onChange={numberHandler} />
      </div>
      <div>
        <button type="submit" onClick={handleSubmit} >add</button>
      </div>
  </form>
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

const Filter = (props) => {
  const { search, handleFilter } = props;
  return (
    <>
    filter shown with <input type="text" value={search} onChange={handleFilter} />
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [peopleToShow, setPeopleToShow] = useState(persons)
  
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }
  
  

  const handleFilter = (event) => {
    const newList = persons.filter((person) => {
      return (person.name.toLowerCase().startsWith(event.target.value) || person.number.startsWith(event.target.value));
    }); 
    setSearchTerm(event.target.value);
    setPeopleToShow(newList);
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


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={searchTerm} handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm name={newName} number={newNumber} nameHandler={handleNameChange} numberHandler={handleNumberChange} handleSubmit={handleSubmit} />
      <h3>Numbers</h3>
      <Persons people={peopleToShow} />
    </div>
  )
}

export default App
