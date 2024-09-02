import {useContext} from 'react'
import GlobalContext from '../../main/GlobalContext.jsx'
import ConditionSliders from './ConditionSliders.jsx'
import TemplatesTable from './TemplatesTable.jsx'

const AbilityTemplates = ({
                              handleNewAbilityTemplate,
                              deleteAbilityTemplate
                          }) => {
    const {globalState} = useContext(GlobalContext)
    return (
        <>
            <h2>Ability Templates</h2>
            <h3>Current Ability Templates</h3>
            <TemplatesTable templates={globalState.abilityTemplates} deleteTemplate={deleteAbilityTemplate}/>
            <h3>Create New Ability Template</h3>
            <form onSubmit={handleNewAbilityTemplate}>
                <label htmlFor="name">Ability name:</label>
                <input type="text" id="name" name="name" required/>
                <p>Effected conditions:</p>
                <ConditionSliders sliderCategory={'ability'}/>
                <button type="submit">Create Ability Template</button>
            </form>
        </>
    )
}

export default AbilityTemplates
