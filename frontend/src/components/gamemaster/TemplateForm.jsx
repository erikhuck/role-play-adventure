const TemplateForm = ({children, handleNewTemplate}) => {
    return (
        <>
            <form onSubmit={handleNewTemplate}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required/>
                {children}
                <button type="submit">Create</button>
            </form>
        </>
    )
}

export default TemplateForm
