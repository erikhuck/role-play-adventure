import {useContext, useState, useCallback} from 'react'
import _ from 'lodash'
import GlobalContext from '../../main/GlobalContext.jsx'
import Popup, {PopupButton} from '../general/Popup.jsx'
import {apiFetch, sortByName} from '../../lib.js'
import {AbilityCheckTargetType, MaxXp, MaxLevel, CharacterType} from '../../../../shared.js'
import ObjectDisplay from '../general/ObjectDisplay.jsx'
import TurnButtons from './TurnButtons.jsx'

const CharacterAbilities = ({characterType, character}) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const [ability, setAbility] = useState(undefined)
    return (
        <>
            <h2>{_.startCase(characterType)} Abilities</h2>
            {character.abilities.length > 0 ? (
                <>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Level</th>
                            {
                                characterType === CharacterType.Player && <th>XP</th>
                            }
                            <th>Temporary Difference</th>
                            <th>Effected Conditions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortByName(character.abilities).map(ability => (
                            <tr key={ability.name}>
                                <td>
                                    <PopupButton setIsVisible={setIsPopupVisible} data={ability} setData={setAbility} text={ability.name}/>
                                </td>
                                <td>
                                    {
                                        characterType === CharacterType.Player ? `${ability.level} / ${MaxLevel}` : ability.level
                                    }
                                </td>
                                {
                                    characterType === CharacterType.Player && <td>{ability.xp} / {MaxXp}</td>
                                }
                                <td>{ability.tmpDiff}</td>
                                <td><ObjectDisplay object={ability.effectedConditions}/></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Popup isVisible={isPopupVisible} setIsVisible={setIsPopupVisible}>
                        <AbilityCheckPopup characterType={characterType} ability={ability} npcName={characterType === CharacterType.Npc ? character.name : undefined}/>
                    </Popup>
                </>
            ) : (
                <p>No abilities yet</p>
            )}
        </>
    )
}

const difficultyLevels = [
    {
        difficultyLevel: 5,
        label: 'EASY'
    },
    {
        difficultyLevel: 10,
        label: 'MODERATE'
    },
    {
        difficultyLevel: 15,
        label: 'HARD'
    },
    {
        difficultyLevel: 20,
        label: 'VERY HARD'
    }
]

export const AbilityCheckPopup = ({characterType, ability, npcName, useItem}) => {
    const [targetType, setTargetType] = useState(undefined)
    const [abilityCheck, setAbilityCheck] = useState(undefined)
    const doAbilityCheck = useCallback(async (options) => {
        const abilityCheck = await apiFetch('abilities/check', 'POST', {
            targetType,
            abilityName: ability.name,
            characterType,
            npcName,
            ...options
        })
        setAbilityCheck(abilityCheck)
        if (useItem) {
            await useItem(abilityCheck.success)
        }
    }, [ability.name, targetType, characterType, npcName, useItem])
    return (
        <>
            <h2>{ability.name} Ability Check</h2>
            {abilityCheck ? (
                <>
                    <p>Level: {ability.level}</p>
                    <p>Temp Diff: {ability.tmpDiff}</p>
                    <p>
                        {_.startCase(characterType)} Check: {abilityCheck.check} + {ability.level} + {ability.tmpDiff} = {abilityCheck.total}
                    </p>
                    <p>Target Check: {abilityCheck.targetCheck}</p>
                    <p><b>{abilityCheck.success ? 'SUCCESS' : 'FAILURE'}</b></p>
                </>
            ) : (
                <>
                    {targetType ? (
                        targetType === AbilityCheckTargetType.DifficultyLevel ? (
                            <DifficultyLevelAbilityCheck doAbilityCheck={doAbilityCheck}/>
                        ) : (
                            <CharacterAbilityCheck doAbilityCheck={doAbilityCheck}/>
                        )
                    ) : (
                        <>
                            <button onClick={() => setTargetType(AbilityCheckTargetType.DifficultyLevel)}>
                                Difficulty Level
                            </button>
                            <button onClick={() => setTargetType(AbilityCheckTargetType.Character)}>
                                Character
                            </button>
                        </>
                    )}
                </>
            )}
        </>
    )
}

const DifficultyLevelAbilityCheck = ({doAbilityCheck}) => {
    return (
        <>
            {difficultyLevels.map(({
                                       difficultyLevel,
                                       label
                                   }) => (
                <button
                    key={difficultyLevel}
                    onClick={async () => await doAbilityCheck({difficultyLevel})}
                >
                    {label}
                </button>
            ))}
        </>
    )
}

const CharacterAbilityCheck = ({doAbilityCheck}) => {
    const {globalState} = useContext(GlobalContext)
    const [turn, setTurn] = useState(undefined)
    return (
        turn ? (
            <>
                {globalState.abilityTemplates.map((abilityTemplate) => (
                    <button
                        key={abilityTemplate.name}
                        onClick={() =>
                            doAbilityCheck({
                                targetName: turn.name,
                                targetCharacterType: turn.characterType,
                                targetAbilityName: abilityTemplate.name,
                            })
                        }
                    >
                        {abilityTemplate.name}
                    </button>
                ))}
            </>
        ) : (
            <TurnButtons setTurn={setTurn}/>
        )
    )
}

export default CharacterAbilities
