import { useState, useEffect } from 'react';
import axios from 'axios';
import Persons from './Persons';
import PersonForm from './PersonForm';
import { getAllPersons, createNewPerson, updatePerson, deletePerson } from './PersonService';


const Filter = (props) => {
  const { search, handleFilter } = props;
  return (
    <>
    filter shown with <input type="text" value={search} onChange={handleFilter} />
    </>
  )
}

const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [peopleToShow, setPeopleToShow] = useState(persons)

  const fetchPersons = () => {
      getAllPersons().then(response => {
        setPersons(response);
        setPeopleToShow(response);
      });
  }

  useEffect(fetchPersons, [])
  
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleFilter = (event) => {
    const newList = persons.filter((person) => {
      return (person.name.toLowerCase().startsWith(event.target.value.toLowerCase()) || person.number.startsWith(event.target.value));
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
      createNewPerson(newPerson).then(createdPerson => {
        setPersons(persons.concat(createdPerson));
        setPeopleToShow(persons.concat(createdPerson));
        setNewName('');
        setNewNumber('');
      });
      // const newPersonsList = persons.concat(newPerson);
    } else {
      alert(`${newPerson.name} is already added to the phonebook.`);
    }
  }

  const handleDelete = (id) => {
    deletePerson(id).then(deletedPerson => {
      setPersons(persons.filter(person => person.id !== deletedPerson.id));
      setPeopleToShow(persons.filter(person => person.id !== deletedPerson.id));
    });
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={searchTerm} handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm name={newName} number={newNumber} nameHandler={handleNameChange} numberHandler={handleNumberChange} handleSubmit={handleSubmit} />
      <h3>Numbers</h3>
      <Persons people={peopleToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
