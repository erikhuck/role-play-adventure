export const Condition = {
    Health: 'health',
    Stamina: 'stamina',
    Fatigue: 'fatigue',
    Hunger: 'hunger',
    Thirst: 'thirst',
    Happiness: 'happiness'
}

export const MaxXp = 10
export const MaxLevel = 10

export const MaxItemWeight = 100

export const MaxItemPrice = 10000

export const MaxItemMaxCharges = 100

export const CharacterType = {
    Player: 'player',
    Npc: 'npc'
}

export const AbilityCheckTargetType = {
    DifficultyLevel: 'DifficultyLevel',
    Character: 'Character'
}

export const mapNames = models => models.map(model => model.name)

export const optionalNumber = numStr => numStr ? Number(numStr) : undefined
