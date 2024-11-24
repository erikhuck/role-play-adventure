import CollapsibleComponent from '../general/CollapsibleComponent.jsx'
import CharacterConditions from './CharacterConditions.jsx'
import CharacterAbilities from './CharacterAbilities.jsx'
import CharacterInventory from './CharacterInventory.jsx'

const CharacterInfo = ({characterType, conditionData, character}) => {
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
        </>
    )
}

export default CharacterInfo
