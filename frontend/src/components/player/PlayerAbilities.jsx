import {useContext, useState, useCallback} from 'react'
import GlobalContext from '../../main/GlobalContext.jsx'
import Popup from '../general/Popup.jsx'
import {getPlayer, apiFetch, sortByName} from '../../lib.js'
import {AbilityCheckTargetType, MaxXp, MaxLevel} from '../../../../shared.js'

const PlayerAbilities = () => {
    const {globalState} = useContext(GlobalContext)
    const player = getPlayer(globalState)
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const [ability, setAbility] = useState(undefined)
    const openAbilityCheckPopup = useCallback((ability) => {
        setAbility(ability)
        setIsPopupVisible(true)
    }, [])
    return (
        <>
            <h2>Player Abilities</h2>
            {player.abilities.length > 0 ? (
                <>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Level</th>
                            <th>XP</th>
                            <th>Temporary Difference</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortByName(player.abilities).map(ability => (
                            <tr key={ability.name}>
                                <td>
                                    <button onClick={() => openAbilityCheckPopup(ability)}>
                                        {ability.name}
                                    </button>
                                </td>
                                <td>{ability.level} / {MaxLevel}</td>
                                <td>{ability.xp} / {MaxXp}</td>
                                <td>{ability.tmpDiff}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Popup isVisible={isPopupVisible} setIsVisible={setIsPopupVisible}>
                        <AbilityCheckPopup ability={ability}/>
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

const AbilityCheckPopup = ({ability}) => {
    const [targetType, setTargetType] = useState(undefined)
    const [abilityCheck, setAbilityCheck] = useState(undefined)
    const doAbilityCheck = useCallback(async (options) => {
        const abilityCheck = await apiFetch('abilities/check', 'POST', {
            targetType,
            abilityName: ability.name,
            ...options
        })
        setAbilityCheck(abilityCheck)
    }, [ability.name, targetType])
    return (
        <>
            <h2>{ability.name} Ability Check</h2>
            {abilityCheck ? (
                <>
                    <p>Level: {ability.level}</p>
                    <p>Temp Diff: {ability.tmpDiff}</p>
                    <p>
                        Player Check: {abilityCheck.check} + {ability.level} + {ability.tmpDiff} = {abilityCheck.total}
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
                                characterName: turn.name,
                                characterType: turn.characterType,
                                characterAbilityName: abilityTemplate.name,
                            })
                        }
                    >
                        {abilityTemplate.name}
                    </button>
                ))}
            </>
        ) : (
            <>
                {globalState.turns.map((turn, index) => (
                    <button key={index} onClick={() => setTurn(turn)}>
                        {turn.name}
                    </button>
                ))}
            </>
        )
    )
}

export default PlayerAbilities
