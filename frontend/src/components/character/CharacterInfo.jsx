import CollapsibleComponent from '../general/CollapsibleComponent.jsx'
import CharacterConditions from './CharacterConditions.jsx'
import CharacterAbilities from './CharacterAbilities.jsx'
import CharacterInventory from './CharacterInventory.jsx'
import {useCallback} from 'react'
import {apiFetch} from '../../lib.js'

const CharacterInfo = ({
                           characterType,
                           conditionData,
                           character
                       }) => {
    // noinspection com.haulmont.rcb.ExhaustiveDepsInspection
    const sleep = useCallback(async () => {
        await apiFetch('/sleep', 'POST', {
            character,
            characterType
        })
    }, [character, characterType])
    return (
        <>
            <CollapsibleComponent label="Conditions">
                <CharacterConditions characterType={characterType} conditionData={conditionData}/>
            </CollapsibleComponent>
            <CollapsibleComponent label="Abilities">
                <CharacterAbilities characterType={characterType} character={character}/>
            </CollapsibleComponent>
            <CollapsibleComponent label="Inventory">
                <CharacterInventory characterType={characterType} character={character}/>
            </CollapsibleComponent>
            <hr/>
            <button onClick={sleep}>Sleep</button>
            <br/>
        </>
    )
}

export default CharacterInfo
