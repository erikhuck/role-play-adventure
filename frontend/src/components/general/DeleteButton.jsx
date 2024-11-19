const DeleteButton = ({deleteFunc, text = 'DELETE'}) => {
    return <button onClick={deleteFunc} class="delete">{text}</button>
}

export default DeleteButton
