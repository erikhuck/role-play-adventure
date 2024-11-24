import {useContext, useCallback, useState} from 'react'
import SearchableDropdown from '../general/SearchableDropdown.jsx'
import {CharacterType, Condition, mapNames} from '../../../../shared.js'
import GlobalContext from '../../main/GlobalContext.jsx'
import {apiFetch} from '../../lib.js'
import DeleteButton from '../general/DeleteButton.jsx'
import Popup, {PopupButton} from '../general/Popup.jsx'
import CharacterInfo from '../character/CharacterInfo.jsx'
import _ from 'lodash'

const NpcList = () => {
    const {globalState} = useContext(GlobalContext)
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const [npcId, setNpcId] = useState(undefined)
    const addNpc = useCallback(async (name) => {
        await apiFetch('/npcs/', 'POST', {name})
    }, [])
    const deleteNpc = useCallback(async (id) => {
        await apiFetch('/npcs/', 'DELETE', {id})
    }, [])
    const addNpcToTurns = useCallback(async (name) => {
        await apiFetch('turns/add', 'POST', {name, characterType: CharacterType.Npc})
    }, [])
    const dropNpcFromTurns = useCallback(async (name) => {
        await apiFetch('turns/drop', 'DELETE', {name})
    })
    const turnNames = mapNames(globalState.turns)
    const npcInTurns = useCallback(name => turnNames.includes(name), [turnNames])
    const getConditionData = useCallback((npc) => {
        return npc ? (
            [Condition.Health, Condition.Stamina].map(condition => ({
                name: _.startCase(condition),
                value: npc[condition],
                max: npc[`max${_.startCase(condition)}`]
            }))
        ) : undefined
    }, [])
    const npc = globalState.npcs.find(npc => npc.id === npcId)
    return (
        <>
            <table className="table-w-deletes">
                <thead>
                <tr>
                    <th className="no-style"></th>
                    <th>Manage Turns</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {
                    globalState.npcs.map(npc => (
                        <tr>
                            <td>
                                <DeleteButton deleteFunc={async () => await deleteNpc(npc.id)}/>
                            </td>
                            <td>
                                {
                                    npcInTurns(npc.name) ? (
                                        <DeleteButton deleteFunc={async () => await dropNpcFromTurns(npc.name)} text='DROP'/>
                                    ) : (
                                        <button onClick={async () => await addNpcToTurns(npc.name)}>+ ADD</button>
                                    )
                                }
                            </td>
                            <td><PopupButton setIsVisible={setIsPopupVisible} data={npc.id} setData={setNpcId} text={npc.name}/></td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
            <SearchableDropdown
                options={mapNames(globalState.npcTemplates)}
                placeholder="Add NPC..."
                required={true}
                onSelectOption={addNpc}
            />
            <Popup isVisible={isPopupVisible} setIsVisible={setIsPopupVisible}>
                <CharacterInfo characterType={CharacterType.Npc} character={npc} conditionData={getConditionData(npc)}/>
            </Popup>
        </>
    )
}

export default NpcList
