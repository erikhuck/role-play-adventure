import React, {useCallback, useState, useEffect} from 'react'
import {apiFetch, getFormData} from '../lib.js'
import AbilityTemplates from '../components/gamemaster/AbilityTemplates.jsx'
import CollapsibleComponent from '../components/general/CollapsibleComponent.jsx'

const GameMaster = () => {
    const [abilityTemplates, setAbilityTemplates] = useState(undefined)
    const [itemTemplates, setItemTemplates] = useState(undefined)
    const [npcTemplates, setNpcTemplates] = useState(undefined)
    const [dataLoaded, setDataLoaded] = useState(false)
    useEffect(() => {
        (async () => {
            const {
                abilityTemplates,
                itemTemplates,
                npcTemplates
            } = await apiFetch('templates', 'GET')
            setAbilityTemplates(abilityTemplates)
            setItemTemplates(itemTemplates)
            setNpcTemplates(npcTemplates)
            setDataLoaded(true)
        })()
    }, [setAbilityTemplates, setItemTemplates, setNpcTemplates])
    const handleNewTemplate = useCallback(async (event, path, setTemplates) => {
        const newTemplate = getFormData(event)
        const {templates} = await apiFetch(path, 'POST', newTemplate)
        setTemplates(templates)
    }, [])
    const deleteTemplate = useCallback(async (name, path, setTemplates) => {
        const {templates} = await apiFetch(path, 'DELETE', {name})
        setTemplates(templates)
    }, [])
    const handleNewAbilityTemplate = useCallback(async (event) => {
        await handleNewTemplate(event, 'abilities/template', setAbilityTemplates)
    }, [handleNewTemplate])
    const deleteAbilityTemplate = useCallback(async (name) => {
        await deleteTemplate(name, 'abilities/template', setAbilityTemplates)
    }, [deleteTemplate])
    const handleNewItemTemplate = useCallback(async (event) => {
        await handleNewTemplate(event, 'inventory/item/template', setItemTemplates)
    }, [handleNewTemplate])
    const deleteItemTemplate = useCallback(async (name) => {
        await deleteTemplate(name, 'inventory/item/template', setItemTemplates)
    }, [deleteTemplate])
    const handleNewNpcTemplate = useCallback(async (event) => {
        await handleNewTemplate(event, 'npcs/template', setNpcTemplates)
    }, [handleNewTemplate])
    const deleteNpcTemplate = useCallback(async (name) => {
        await deleteTemplate(name, 'npcs/template', setNpcTemplates)
    }, [deleteTemplate])
    return (dataLoaded ? (
            <>
                <h1>Game Master</h1>
                <CollapsibleComponent label="Abilities">
                    <AbilityTemplates abilityTemplates={abilityTemplates}
                                      handleNewAbilityTemplate={handleNewAbilityTemplate}
                                      deleteAbilityTemplate={deleteAbilityTemplate}/>
                </CollapsibleComponent>
                <CollapsibleComponent label="Items">
                    <h2>Item Templates</h2>
                    <h3>Current Item Templates</h3>
                    <h3>Create New Item Template</h3>
                </CollapsibleComponent>
                <CollapsibleComponent label={'NPCs'}>
                    <h2>NPC Templates</h2>
                    <h3>Current NPC Templates</h3>
                    <h3>Create New NPC Template</h3>
                </CollapsibleComponent>
            </>
        ) : (
            <p>Loading data...</p>
        )
    )
}

export default GameMaster
