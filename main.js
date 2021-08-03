import.meta.env;
import { io } from 'socket.io-client';
import { Notyf } from 'notyf';

const notyf = new Notyf({
    duration: 5000,
    position: {
        x: 'right',
        y: 'top'
    }
});

const socket = io(__SNOWPACK_ENV__.SNOWPACK_PUBLIC_SERV_HOST || 'http://localhost:3000/');

const loader = document.querySelector('.loader');
const boxes = document.querySelectorAll('.box');
const playerContainers = document.querySelectorAll('.player-container');
const resetButton = document.querySelector('.btn-reset');
const pieceSelectorItems = document.querySelectorAll('.pieceItem');
const loginForm = document.getElementById('login-form');
const createRoomBtn = document.getElementById('create-room');
const reloadRoomBtn = document.querySelector('.btn-reload');

/* CONNECTIONS */
socket.on('connect', () => {
    notyf.success(`You connected with id <b>${socket.id}</b>!`);
    loader?.classList.add('loaded');
});

/* RECEIVE */
socket.on('receive-connection', id => {
    notyf.success(`<b>${id}</b> joined the game!`);
})

socket.on('receive-disconnect', id => {
    notyf.error(`<b>${id}</b> left the game!`);
});

socket.on('receive-teams', teams => {
    editTeams(teams);
});

socket.on('receive-play', (box, team, size) => {
    play(box, team, size);
});

socket.on('receive-piece', (team, piecesData) => {
    const pieces = document.querySelectorAll('.circle.team');
    pieces.forEach(piece => {
        piece.addEventListener('click', () => {
            notyf.success(`${piece.innerHTML} was pressed`);
        });
    });
});

socket.on('receive-init-room', rooms => {
    initRoomList(rooms);
});

socket.on('receive-init', grid => {
    initGrid(grid);
});

socket.on('receive-active', activeTeam => {
    editActive(activeTeam);
});

socket.on('receive-win', (win, grid) => {
    notyf.success(`<b>${win}</b> win the match!`);
});

socket.on('receive-equality', () => {
    notyf.success(`Equality!`);
});

socket.on('receive-edit-piece', players => {
    editPieceSelector(players);
});

/* SEND */
boxes.forEach(box => {
    box.addEventListener('click', e => {
        socket.emit('play', box.id, function (error) {
            notyf.error(error);
        });
    });
});

resetButton?.addEventListener('click', e => {
    e.preventDefault();
    socket.emit('send-reset', function (error) {
        notyf.error(error);
    });
});

pieceSelectorItems.forEach(item => {
    item.addEventListener('click', e => {
        socket.emit('select-piece', item.closest('.player-container').id, item.id, function (error) {
            notyf.error(error);
        });
    });
});

loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    const username = loginForm.querySelector('#username').value;
    socket.emit('login', { name: username }, function (error) {
        if (error) return notyf.error(error);
        document.getElementById('login').style.display = 'none';
        document.getElementById('room').style.display = 'flex';
    });
});

createRoomBtn?.addEventListener('click', e => {
    e.preventDefault();
    socket.emit('create-room', function (error) {
        if (error) return notyf.error(error);
        document.getElementById('room').style.display = 'none';
        document.getElementById('game').style.display = 'flex';
    });
});

reloadRoomBtn?.addEventListener('click', e => {
    e.preventDefault();
    socket.emit('get-room', function (rooms) {
        initRoomList(rooms)
    });
});

/* FUNCTIONS */
function initRoomList(rooms) {
    const roomSelector = document.querySelector('.room-selector');
    roomSelector.innerHTML = '';
    rooms.forEach(room => {
        const slot = room.players.filter(player => player.id !== null).length;
        const roomItemHTML = `
        <li class="room-item" id="${room.id}">
            <span class="room-title"></span><span class="room-slot">${slot}/2</span>
        </li>
        `;
        roomSelector.innerHTML += roomItemHTML;
        const roomItem = document.getElementById(room.id);
        roomItem.querySelector('.room-title').innerText = room.name;
        roomItem.addEventListener('click', e => {
            e.preventDefault();
            socket.emit('join-room', room.id, function (error) {
                if (error) return notyf.error(error);
                document.getElementById('room').style.display = 'none';
                document.getElementById('game').style.display = 'flex';
            });
        });
    });
}

function editTeams(players) {
    players.forEach(player => {
        const el = document.getElementById(player.team);
        if (!el) return;
        socket.emit('get-username', player.id, function (username) {
            el.querySelector('.player-name').innerHTML = username ? username : 'Waiting for player...';
            el.querySelector('.player-score').innerHTML = player.score;
        });
    });
}

function initGrid(grid) {
    grid.forEach((box, index) => {
        if (box[0]) {
            play(index + 1, box[0], box[1]);
        } else {
            boxes[index].innerHTML = "";
        }
    });
}

function editActive(activeTeam) {
    playerContainers.forEach(container => {
        if (container.id === activeTeam) container.classList.add('active-player');
        else container.classList.remove('active-player');
    });
    const activeTeamContainer = document.getElementById(activeTeam);
    activeTeamContainer
}

function play(boxID, team, size = 'medium') {
    const box = document.getElementById(boxID);
    const span = document.createElement('span');
    span.classList.add(size, team);
    box.insertAdjacentElement('afterbegin', span);
}

function editPieceSelector(players) {
    players.forEach(player => {
        const el = document.querySelector(`#${player.team} .pieceSelector`);
        if (!el) return;
        el.querySelectorAll('.pieceItem').forEach(item => {
            const span = item.querySelector('.piece-item-number');
            span.innerHTML = `x${player.pieces[item.id]}`;
            player.activePiece === item.id ? item.classList.add('active') : item.classList.remove('active');
            if (player.pieces[item.id] <= 0) span.classList.add('disabled');
        });
    });
}