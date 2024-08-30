import io from './websocket.js'
import {CharacterType, Condition} from '../../../shared.js'
import Database from './database.js'

class TurnManager {
    static #currentTurn = 0
    static #turns = []

    static get currentTurn() {
        return this.#currentTurn
    }

    static get turns() {
        return this.#turns
    }

    static addTurn(turn) {
        this.#turns.push(turn)
        io.emit('update-global-state', {turns: this.#turns})
    }

    static dropTurn(index) {
        let turn = null
        if (this.#turns.length > index) {
            turn = this.#turns[index]
            this.#turns.splice(index, 1)
            this.#currentTurn = 0
            io.emit('update-global-state', {
                currentTurn: this.#currentTurn,
                turns: this.#turns
            })
        }
        return turn
    }

    static async nextTurn() {
        const {
            name,
            characterType
        } = this.#turns[this.#currentTurn]
        this.#currentTurn = (this.#currentTurn + 1) % this.#turns.length
        if (characterType === CharacterType.Player) {
            const player = await Database.getPlayer(name)
            const players = await Database.updatePlayerConditions(player, {
                [Condition.Fatigue]: -1,
                [Condition.Happiness]: -1,
                [Condition.Hunger]: -1,
                [Condition.Thirst]: -1,
                [Condition.Stamina]: 1
            })
            io.emit('update-global-state', {
                currentTurn: this.#currentTurn,
                players
            })
        } else {
            io.emit('update-global-state', {currentTurn: this.#currentTurn})
        }
    }
}

export default TurnManager
