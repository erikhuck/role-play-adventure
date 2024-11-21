import {useContext, useCallback} from 'react'
import GlobalContext from '../../main/GlobalContext.jsx'
import _ from 'lodash'
import ObjectDisplay from '../general/ObjectDisplay.jsx'
import SearchableDropdown from '../general/SearchableDropdown.jsx'
import {apiFetch} from '../../lib.js'
import {mapNames} from '../../../../shared.js'
import DeleteButton from '../general/DeleteButton.jsx'

const CharacterInventory = ({characterType, character}) => {
    const {globalState} = useContext(GlobalContext)
    const getContainerWeight = useCallback(container => container.items.reduce((acc, item) => item.template.weight + acc, 0))
    const addItem = useCallback(async (name, containerId) => {
        await apiFetch('inventory/item', 'POST', {name, containerId})
    }, [])
    const deleteItem = useCallback(async (id) => {
        await apiFetch('inventory/item', 'DELETE', {id})
    }, [])
    const addContainer = useCallback(async (name, characterName) => {
        await apiFetch('inventory/container', 'POST', {name, characterName, characterType})
    }, [characterType])
    const deleteContainer = useCallback(async (id) => {
        await apiFetch('inventory/container', 'DELETE', {id})
    }, [])
    const characterCarryWeight = character.containers.reduce((acc, container) => {
        const containerWeight = getContainerWeight(container)
        return containerWeight + acc
    }, 0)
    return (
        <>
            <h2>{_.startCase(characterType)} Inventory</h2>
            <p>Total Encumbrance: {characterCarryWeight} / {character.carryCapacity}</p>
            <table className="table-w-deletes">
                <thead>
                    <tr>
                        <th className="no-style"></th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Encumbrance</th>
                        <th>Items</th>
                    </tr>
                </thead>
                <tbody>
                {
                    character.containers.map(container => (
                        <tr key={container.id}>
                            <td>
                                <DeleteButton deleteFunc={async () => await deleteContainer(container.id)}/>
                            </td>
                            <td>{container.name}</td>
                            <td>{container.location}</td>
                            <td>{getContainerWeight(container)} / {container.weightCapacity}</td>
                            <td>
                                <table className="table-w-deletes">
                                    <thead>
                                        <tr>
                                            <th className="no-style"></th>
                                            <th>Name</th>
                                            <th>Weight</th>
                                            <th>Price</th>
                                            <th>Charges</th>
                                            <th>Effected Abilities</th>
                                            <th>Effected Conditions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        container.items.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <DeleteButton deleteFunc={async () => await deleteItem(item.id)}/>
                                                </td>
                                                {/*TODO similar to ability checks, replace with a button where the item name is the text and it opens up a menu to use the item.*/}
                                                <td>{item.template.name}</td>
                                                <td>{item.template.weight}</td>
                                                <td>{item.template.price}</td>
                                                <td>{item.charges} / {item.template.maxCharges}</td>
                                                <td><ObjectDisplay object={item.template.effectedAbilities}/></td>
                                                <td><ObjectDisplay object={item.template.effectedConditions}/></td>
                                            </tr>
                                        ))
                                    }
                                    <tr key="add-item">
                                        <td>
                                            <SearchableDropdown
                                                options={mapNames(globalState.itemTemplates)}
                                                placeholder="Add Item..."
                                                required={true}
                                                onSelectOption={async (itemName) => await addItem(itemName, container.id)}
                                            />
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    ))
                }
                <tr key="add-container">
                    <td>
                        <SearchableDropdown
                            options={mapNames(globalState.containerTemplates)}
                            placeholder="Add Container..."
                            required={true}
                            onSelectOption={async (containerName) => await addContainer(containerName, character.name)}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
        </>
    )
}

export default CharacterInventory
