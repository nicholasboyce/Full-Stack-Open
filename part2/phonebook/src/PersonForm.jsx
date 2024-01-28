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

export default PersonForm;