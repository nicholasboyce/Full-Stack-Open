const Notification = (props) => {
    const { message, isError } = props;
    const messageStyle = isError ? 'error':'success';
    if (message === '') {
        return null;
    } else {
        return (
            <div className={messageStyle}>
                {message}
            </div>
        )
    }
}

export default Notification;