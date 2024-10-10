import TextInput from '../general/TextInput.jsx'

const TemplateForm = ({
                          children,
                          handleNewTemplate
                      }) => {
    return (
        <>
            <form onSubmit={handleNewTemplate}>
                <TextInput label="Name"/>
                {children}
                <div>
                    <button type="submit">Create</button>
                </div>
            </form>
        </>
    )
}

export default TemplateForm
