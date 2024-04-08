import { forwardRef, useState, useImperativeHandle } from "react";

const ToggleBlogForm = forwardRef((props, refs) => {
    const [showForm, setShowForm] = useState(false);
    const [buttonTextIndex, setButtonTextIndex] = useState(0);

    const text = ['New note', 'Cancel'];
    const toggleVisibility = () => {
        setShowForm(!showForm);
        setButtonTextIndex((buttonTextIndex + 1) % 2);
    }

    useImperativeHandle(refs, () => {    
        return {
            toggleVisibility   
        }
    });

    return (
        <>
            {showForm && props.children}
            <button onClick={toggleVisibility}>{text[buttonTextIndex]}</button>
        </>
    )
})

ToggleBlogForm.displayName = 'ToggleBlogForm';

export default ToggleBlogForm;