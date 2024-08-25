import React, {useCallback} from 'react'
import {useNavigate} from "react-router-dom"
import {apiFetch, getFormData} from "../lib.js"
import ConditionSliders from "../components/ConditionSliders.jsx"
import CollapsibleComponent from "../components/CollapsibleComponent.jsx"

const GameMaster = () => {
    const navigate = useNavigate()
    const handleNewTemplate = useCallback(async (event, path, navigate) => {
        const newTemplate = getFormData(event)
        await apiFetch(path, 'POST', newTemplate)
    }, [])
    const handleNewAbilityTemplate = useCallback(async (event) => {
        await handleNewTemplate(event, 'abilities/template', navigate)
    }, [navigate, handleNewTemplate])
    const handleNewItemTemplate = useCallback(async (event) => {
        await handleNewTemplate(event, 'items/template', navigate)
    }, [handleNewTemplate, navigate])
    const handleNewNPCTemplate = useCallback(async (event) => {
        await handleNewTemplate(event, 'npcs/template', navigate)
    }, [handleNewTemplate, navigate])
    return (
        <>
            <h1>Game Master</h1>
            <CollapsibleComponent label='Abilities'>
                <h2>Ability Templates</h2>
                <h3>Current Ability Templates</h3>
                <h3>Create New Ability Template</h3>
                <form onSubmit={handleNewAbilityTemplate}>
                    <label htmlFor="abilityName">Ability name:</label>
                    <input type="text" id="abilityName" name="abilityName" required/>
                    <p>Effected conditions:</p>
                    <ConditionSliders sliderCategory={'ability'}/>
                    <button type="submit">Create Ability Template</button>
                </form>
            </CollapsibleComponent>
            <CollapsibleComponent label='Items'>
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
    )
}

export default GameMaster
