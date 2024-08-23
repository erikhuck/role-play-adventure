export const Condition = {
    Health: 'health',
    Stamina: 'stamina',
    Fatigue: 'fatigue',
    Hunger: 'hunger',
    Thirst: 'thirst',
    Happiness: 'happiness'
}

export const arraysEqual = (a1, a2) => a1.length === a2.length && a1.every((item, index) => objectsEqual(item, a2[index]))

export const objectsEqual = (o1, o2) => {
    if (typeof o1 !== 'object' || typeof o2 !== 'object' || o1 === null || o2 === null) {
        return o1 === o2
    }
    if (Array.isArray(o1) && Array.isArray(o2)) {
        return arraysEqual(o1, o2)
    }
    const keys1 = Object.keys(o1).sort()
    const keys2 = Object.keys(o2).sort()
    if (!arraysEqual(keys1, keys2)) {
        return false
    }
    return keys1.every(key => objectsEqual(o1[key], o2[key]))
}

export const objectInArray = (o1, a) => {
    for (const o2 of a) {
        if (objectsEqual(o1, o2)) {
            return true
        }
    }
    return false
}
