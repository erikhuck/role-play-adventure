import React, {useCallback, useContext} from 'react'
import GlobalContext from '../main/GlobalContext.jsx'
import {apiFetch, getFormData} from '../lib.js'
import TemplateComponent from '../components/gamemaster/TemplateComponent.jsx'
import ConditionSliders from '../components/gamemaster/ConditionSliders.jsx'
import AbilitySliders from '../components/gamemaster/AbilitySliders.jsx'
import NumberInput from '../components/gamemaster/NumberInput.jsx'
import Dropdown from '../components/gamemaster/Dropdown.jsx'
import CheckboxList from '../components/gamemaster/CheckboxList.jsx'
import {
    MaxItemWeight,
    MaxItemPrice,
    MaxItemMaxCharges,
    MaxContainerWeightCapacity,
    MaxNpcHealth,
    MaxNpcStamina,
    MaxNpcCarryCapacity,
    CharacterType,
    mapNames,
} from '../../../shared.js'
import TextInput from '../components/general/TextInput.jsx'
import TurnList from '../components/general/TurnList.jsx'
import NpcList from '../components/gamemaster/NpcList.jsx'
import CollapsibleComponent from '../components/general/CollapsibleComponent.jsx'

const GameMaster = () => {
    const {globalState} = useContext(GlobalContext)
    const npcTemplates = globalState.npcTemplates.map(template => {
        let {
            abilityTemplates,
            containerTemplates,
            ...rest
        } = template
        abilityTemplates = abilityTemplates.reduce((acc, template) => {
            const name = template.name
            acc[name] = template.level
            return acc
        }, {})
        containerTemplates = mapNames(containerTemplates)
        return {
            abilityTemplates,
            containerTemplates, ...rest
        }
    })
    const handleNewTemplate = useCallback(async (event, path) => {
        const newTemplate = getFormData(event)
        await apiFetch(path, 'POST', newTemplate)
    }, [])
    const deleteTemplate = useCallback(async (name, path) => {
        await apiFetch(path, 'DELETE', {name})
    }, [])
    const handleNewAbilityTemplate = useCallback(async (event) => {
        await handleNewTemplate(event, 'abilities/template')
    }, [handleNewTemplate])
    const deleteAbilityTemplate = useCallback(async (name) => {
        await deleteTemplate(name, 'abilities/template')
    }, [deleteTemplate])
    const handleNewItemTemplate = useCallback(async (event) => {
        await handleNewTemplate(event, 'inventory/item/template')
    }, [handleNewTemplate])
    const deleteItemTemplate = useCallback(async (name) => {
        await deleteTemplate(name, 'inventory/item/template')
    }, [deleteTemplate])
    const handleNewContainerTemplate = useCallback(async (event) => {
        await handleNewTemplate(event, 'inventory/container/template')
    }, [handleNewTemplate])
    const deleteContainerTemplate = useCallback(async (name) => {
        await deleteTemplate(name, 'inventory/container/template')
    }, [deleteTemplate])
    const handleNewNpcTemplate = useCallback(async (event) => {
        await handleNewTemplate(event, 'npcs/template')
    }, [handleNewTemplate])
    const deleteNpcTemplate = useCallback(async (name) => {
        await deleteTemplate(name, 'npcs/template')
    }, [deleteTemplate])
    const handleNextTurn = useCallback(async () => {
        await apiFetch('turns/next', 'PUT')
    }, [])
    return (
        <>
            <h1>Game Master</h1>
            <h2>NPCs and Turns</h2>
            <CollapsibleComponent label="NPC List">
                <NpcList/>
            </CollapsibleComponent>
            <h3>Turns</h3>
            <TurnList/>
            <button onClick={handleNextTurn} disabled={globalState.turns[globalState.currentTurn].characterType === CharacterType.Player}>End NPC Turn</button>
            <h2>Manage Templates</h2>
            <TemplateComponent templates={globalState.abilityTemplates} deleteTemplate={deleteAbilityTemplate}
                               handleNewTemplate={handleNewAbilityTemplate} templateType="Ability">
                <ConditionSliders category={'ability'}/>
            </TemplateComponent>
            <hr/>
            <TemplateComponent templates={globalState.itemTemplates} deleteTemplate={deleteItemTemplate}
                               handleNewTemplate={handleNewItemTemplate} templateType="Item">
                <NumberInput maxValue={MaxItemWeight} name={'Weight'}/>
                <NumberInput maxValue={MaxItemPrice} name={'Price'} required={false}/>
                <NumberInput maxValue={MaxItemMaxCharges} name={'Max Charges'} required={false}/>
                <Dropdown label={'Associated Ability'} options={mapNames(globalState.abilityTemplates)}
                          required={false}/>
                <AbilitySliders category="itemAbility"/>
                <ConditionSliders category="itemCondition" min={-50} max={50}/>
                <TextInput label="Description" required={false}/>
            </TemplateComponent>
            <hr/>
            <TemplateComponent templates={globalState.containerTemplates} deleteTemplate={deleteContainerTemplate}
                               handleNewTemplate={handleNewContainerTemplate} templateType="Container">
                <NumberInput maxValue={MaxContainerWeightCapacity} name="Weight Capacity"/>
            </TemplateComponent>
            <hr/>
            <TemplateComponent templates={npcTemplates} deleteTemplate={deleteNpcTemplate}
                               handleNewTemplate={handleNewNpcTemplate} templateType="NPC">
                <NumberInput maxValue={MaxNpcHealth} name="Max Health" required={false}/>
                <NumberInput maxValue={MaxNpcStamina} name="Max Stamina" required={false}/>
                <NumberInput maxValue={MaxNpcCarryCapacity} name="Carry Capacity" required={false}/>
                <AbilitySliders category="npc" label="Abilities" min={-5} max={15}/>
                <CheckboxList label="Containers" options={mapNames(globalState.containerTemplates)}/>
            </TemplateComponent>
        </>
    )
}

export default GameMaster
