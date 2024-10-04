import React, {useCallback, useContext} from 'react'
import GlobalContext from '../main/GlobalContext.jsx'
import {apiFetch, getFormData} from '../lib.js'
import TemplateComponent from '../components/gamemaster/TemplateComponent.jsx'
import ConditionSliders from '../components/gamemaster/ConditionSliders.jsx'
import AbilitySliders from '../components/gamemaster/AbilitySliders.jsx'
import NumberInput from '../components/gamemaster/NumberInput.jsx'
import {MaxItemWeight, MaxItemPrice, MaxItemMaxCharges} from '../../../shared.js'

const GameMaster = () => {
    const {globalState} = useContext(GlobalContext)
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
    const handleNewNpcTemplate = useCallback(async (event) => {
        await handleNewTemplate(event, 'npcs/template')
    }, [handleNewTemplate])
    const deleteNpcTemplate = useCallback(async (name) => {
        await deleteTemplate(name, 'npcs/template')
    }, [deleteTemplate])
    return (
        <>
            <h1>Game Master</h1>
            <TemplateComponent templates={globalState.abilityTemplates} deleteTemplate={deleteAbilityTemplate}
                               handleNewTemplate={handleNewAbilityTemplate} templateType="Ability">
                <ConditionSliders category={'ability'}/>
            </TemplateComponent>
            <hr/>
            <TemplateComponent templates={globalState.itemTemplates} deleteTemplate={deleteItemTemplate}
                               handleNewTemplate={handleNewItemTemplate} templateType="Item">
                <NumberInput maxValue={MaxItemWeight} name={'Weight'}/>
                <NumberInput maxValue={MaxItemPrice} name={'Price'}/>
                <NumberInput maxValue={MaxItemMaxCharges} name={'Max Charges'}/>
                // TODO Include a dropdown where an associated ability can be selected.
                <AbilitySliders category="item"/>
                <ConditionSliders category="item"/>
            </TemplateComponent>
            <hr/>
            <TemplateComponent templates={globalState.npcTemplates} deleteTemplate={deleteNpcTemplate}
                               handleNewTemplate={handleNewNpcTemplate} templateType="NPC">
                <p>TODO insert new NPC template form</p>
            </TemplateComponent>
        </>
    )
}

export default GameMaster
