import io from './websocket.js'

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

    static nextTurn() {
        this.#currentTurn = (this.#currentTurn + 1) % this.#turns.length
        io.emit('update-global-state', {currentTurn: this.#currentTurn})
    }
}

export default TurnManager
