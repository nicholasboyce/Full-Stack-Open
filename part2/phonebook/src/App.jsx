import { useState, useEffect } from 'react';
import Persons from './Persons';
import PersonForm from './PersonForm';
import Notification from './Notification';
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

  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  const fetchPersons = () => {
    let active = true;

    getAllPersons().then(response => {
      if (active) {
        setPersons(response);
        setPeopleToShow(response);
      }
    });

    return () => {
      active = false;
    }
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
    let valid = true;
    if (entry.name === '') return !valid;
    const candidate = entry.name.trim().toLowerCase();
    persons.forEach(person => {
      if (person.name.trim().toLowerCase() === candidate) {
        valid = false;
      }
    });
    return valid;
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
      createNewPerson(newPerson)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson));
          setPeopleToShow(persons.concat(createdPerson));
          setNewName('');
          setNewNumber('');
          setMessage(`Successfully added ${createdPerson.name}!`);
          setError(false);
          setTimeout(() => setMessage(''), 5000);
        })
        .catch(error => {
          setMessage(error.response.data.error);
          setError(true);
          console.log(error.response.data.error)
        });
      // const newPersonsList = persons.concat(newPerson);
    } else {
      if(window.confirm(`${newPerson.name} is already added to the phonebook, replace the old number with the new one?`)) {
        const target = persons.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase());
        const changedPerson = {...target, number: newPerson.number};
        updatePerson(changedPerson.id, changedPerson)
          .then(updated => {
            setPersons(persons.map(person => person.id !== updated.id ? person : updated));
            setPeopleToShow(persons.map(person => person.id !== updated.id ? person : updated));
            setNewName('');
            setNewNumber('');
          })
          .catch((error) => {
            setMessage(error.response.data.error);
            setError(true);
            setTimeout(() => setMessage(''), 5000);
          });
      }
    }
  }

  const handleDelete = (id) => {
    const target = persons.find(person => person.id === id);
    if (window.confirm(`Delete ${target.name}?`)) {
      deletePerson(id).then(deletedPerson => {
        setPersons(persons.filter(person => person.id !== deletedPerson.id));
        setPeopleToShow(persons.filter(person => person.id !== deletedPerson.id));
      })
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isError={error} />
      <Filter search={searchTerm} handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm name={newName} number={newNumber} nameHandler={handleNameChange} numberHandler={handleNumberChange} handleSubmit={handleSubmit} />
      <h3>Numbers</h3>
      <Persons people={peopleToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
