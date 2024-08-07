// noinspection JSUnresolvedReference
// noinspection JSUnresolvedReference
const socket = io();

socket.on('reload', function(_) {
    location.reload();  // Reload the page to reflect the updated turn
});

const endTurnButton = document.getElementById('end-turn-btn')
if (endTurnButton) {
    endTurnButton.onclick = function() {
        socket.emit('next_turn');
    }
}
