import {useContext} from 'react'
import GlobalContext from '../../main/GlobalContext.jsx'
import ConditionSliders from './ConditionSliders.jsx'
import {sortByName} from '../../lib.js'

const AbilityTemplates = ({
                              handleNewAbilityTemplate,
                              deleteAbilityTemplate
                          }) => {
    const {globalState} = useContext(GlobalContext)
    return (
        <>
            <h2>Ability Templates</h2>
            <h3>Current Ability Templates</h3>
            <table className="table-w-deletes">
                <thead>
                <tr>
                    <th className="no-style"></th>
                    <th>Name</th>
                    <th>Effected Conditions</th>
                </tr>
                </thead>
                <tbody>
                {
                    sortByName(globalState.abilityTemplates).map(({
                                                                      name,
                                                                      effectedConditions
                                                                  }) => (
                        <tr key={name}>
                            <td>
                                <button onClick={async () => await deleteAbilityTemplate(name)}>DELETE</button>
                            </td>
                            <td>
                                <p>{name}</p>
                            </td>
                            <td>
                                {
                                    Object.entries(effectedConditions).map(([condition, value]) => (
                                        <span key={condition}>
                                    <strong>{condition}:</strong> {value};&nbsp;
                                </span>
                                    ))
                                }
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
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
