import {useContext, useCallback, useState} from 'react'
import GlobalContext from '../../main/GlobalContext.jsx'
import _ from 'lodash'
import ObjectDisplay from '../general/ObjectDisplay.jsx'
import SearchableDropdown from '../general/SearchableDropdown.jsx'
import {apiFetch} from '../../lib.js'
import {CharacterType, mapNames} from '../../../../shared.js'
import DeleteButton from '../general/DeleteButton.jsx'
import Popup, {PopupButton} from '../general/Popup.jsx'
import {AbilityCheckPopup} from './CharacterAbilities.jsx'
import TurnButtons from './TurnButtons.jsx'

const CharacterInventory = ({characterType, character}) => {
    const {globalState} = useContext(GlobalContext)
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const [item, setItem] = useState(undefined)
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
                                            <th>Associated Ability</th>
                                            <th>Effected Abilities</th>
                                            <th>Effected Conditions</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        container.items.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <DeleteButton deleteFunc={async () => await deleteItem(item.id)}/>
                                                </td>
                                                <td><PopupButton setIsVisible={setIsPopupVisible} text={item.template.name} setData={setItem} data={item}/></td>
                                                <td>{item.template.weight}</td>
                                                <td>{item.template.price}</td>
                                                <td>{item.charges} / {item.template.maxCharges}</td>
                                                <td>{item.template.abilityName}</td>
                                                <td><ObjectDisplay object={item.template.effectedAbilities}/></td>
                                                <td><ObjectDisplay object={item.template.effectedConditions}/></td>
                                                <td>{item.template.description}</td>
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
            <Popup setIsVisible={setIsPopupVisible} isVisible={isPopupVisible}>
                <ItemPopup item={item} character={character} characterType={characterType}/>
            </Popup>
        </>
    )
}

const ItemPopup = ({item, character, characterType}) => {
    return (
        <>
            {
                item.charges > 0 ? (
                    <UseItem item={item} character={character} characterType={characterType}/>
                ) : (
                    <ItemChargeReset item={item}/>
                )
            }
        </>
    )
}

const UseItem = ({item, character, characterType}) => {
    const associatedAbility = item.template.abilityName ? character.abilities.find(a => a.name === item.template.abilityName) : undefined
    const [itemTarget, setItemTarget] = useState(undefined)
    const [itemUsedWithoutAbility, setItemUsedWithoutAbility] = useState(false)
    // noinspection com.haulmont.rcb.ExhaustiveDepsInspection
    const useItem = useCallback(async (success) => {
        await apiFetch('inventory/item', 'PUT', {item, itemTarget, success})
    }, [item, itemTarget])
    const useItemWithoutAbility = useCallback(async () => {
        await useItem(true)
        setItemUsedWithoutAbility(true)
    }, [useItem, setItemUsedWithoutAbility])
    return (
        <>
            {
                itemTarget ? (
                    <>
                        {
                            associatedAbility ? (
                                <>
                                    <p>The item "{item.template.name}" requires an ability check</p>
                                    <AbilityCheckPopup
                                        characterType={characterType}
                                        ability={associatedAbility}
                                        npcName={characterType === CharacterType.Npc ? character.name : undefined}
                                        useItem={useItem}
                                    />
                                </>
                            ) : (
                                <>
                                    {
                                        itemUsedWithoutAbility ? (
                                            <p>"{item.template.name}" used on {itemTarget.name}</p>
                                        ) : (
                                            <>
                                                <p>Use "{item.template.name}" on {itemTarget.name}?</p>
                                                <button onClick={useItemWithoutAbility}>CONFIRM</button>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </>
                ) : (
                    <>
                        <p>Select Target</p>
                        <TurnButtons setTurn={setItemTarget}/>
                    </>
                )
            }
        </>
    )
}

const ItemChargeReset = ({item}) => {
    const [chargesReset, setChargesReset] = useState(false)
    const resetCharges = useCallback(async () => {
        await apiFetch('inventory/item/reset', 'PUT', {item})
        setChargesReset(true)
    }, [item])
    return <>
        {
            chargesReset ? (
                <p>"{item.template.name}" charges reset to {item.template.maxCharges}.</p>
            ) : (
                <>
                    <p>The item "{item.template.name}" is out of charges. Are you able to reset them?</p>
                    <button onClick={resetCharges}>RESET CHARGES</button>
                </>
            )
        }
    </>
}

export default CharacterInventory
