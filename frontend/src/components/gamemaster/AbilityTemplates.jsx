import ConditionSliders from './ConditionSliders.jsx'

const AbilityTemplates = ({
                              abilityTemplates,
                              handleNewAbilityTemplate,
                              deleteAbilityTemplate
                          }) => {
    return (
        <>
            <h2>Ability Templates</h2>
            <h3>Current Ability Templates</h3>
            <ul>
                {
                    abilityTemplates.map(({
                                              name,
                                              effectedConditions
                                          }) => (
                        <li key={name}>
                            <p>{name}</p>
                            Effected Conditions:
                            <ul>
                                {
                                    Object.keys(effectedConditions).map(condition => (
                                        <li key={condition}>
                                            <p>{condition}: {effectedConditions[condition]}</p>
                                        </li>
                                    ))
                                }
                            </ul>
                            <button key={name} onClick={() => deleteAbilityTemplate(name)}>DELETE</button>
                        </li>
                    ))
                }
            </ul>
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
