import {useContext, useCallback} from 'react'
import SearchableDropdown from '../general/SearchableDropdown.jsx'
import {CharacterType, mapNames} from '../../../../shared.js'
import GlobalContext from '../../main/GlobalContext.jsx'
import {apiFetch} from '../../lib.js'
import DeleteButton from '../general/DeleteButton.jsx'

const NpcList = () => {
    const {globalState} = useContext(GlobalContext)
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
                            {/* TODO the name cell should actually be a button that if clicked, brings a popup that shows more info about the NPC. This can probably be mostly re-used from the player screen, i.e. a shared component called CharacterInfo.*/}
                            <td>{npc.name}</td>
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
        </>
    )
}

export default NpcList
