import React, {useCallback, useContext} from 'react'
import GlobalContext from '../main/GlobalContext.jsx'
import {apiFetch, getFormData} from '../lib.js'
import AbilityTemplates from '../components/gamemaster/AbilityTemplates.jsx'
import ItemTemplates from '../components/gamemaster/ItemTemplates.jsx'
import CollapsibleComponent from '../components/general/CollapsibleComponent.jsx'

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
            <CollapsibleComponent label="Abilities">
                <AbilityTemplates handleNewAbilityTemplate={handleNewAbilityTemplate}
                                  deleteAbilityTemplate={deleteAbilityTemplate}/>
            </CollapsibleComponent>
            <CollapsibleComponent label="Items">
                <ItemTemplates handleNewItemTemplate={handleNewItemTemplate} deleteItemTemplate={deleteItemTemplate}/>
            </CollapsibleComponent>
            <CollapsibleComponent label={'NPCs'}>
                <h2>NPC Templates</h2>
                <h3>Current NPC Templates</h3>
                <h3>Create New NPC Template</h3>
            </CollapsibleComponent>
        </>
    )
}

export default GameMaster
