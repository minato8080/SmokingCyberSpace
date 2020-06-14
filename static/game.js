﻿'use strict';

const socket = io();
const canvas = $('#canvas-2d')[0];
const mapImage = $('#map-image')[0];
const mapImageZ1 = $('#map-image-z1')[0];
const Controler = $('#controler')[0];
const Pixer = $('#pixer')[0];
const context = canvas.getContext('2d');
const playerImage = $('#player-image')[0];
const chatboxTop = $('#top')[0];
const chatboxMiddle = $('#middle')[0];
const chatboxUnder = $('#under')[0];

let movement = {};
let myplayerpos;
let movespeed = 3;
let DisplayTop = 0;
let DisplayCenter = 1750;
let isMove = false;



//------------------------------------
//           スタート処理
//------------------------------------

function gameStart() {
    socket.emit('game-start', { nickname: $("#nickname").val() });
    $("#start-screen").hide();
}
$("#start-button").on('click', gameStart);



//-------------------------------------
//　　　　　　通信処理
//-------------------------------------

$(document).on('keydown keyup', (event) => {
    const KeyToCommand = {
       // 'ArrowUp': 'forward',
       // 'ArrowDown': 'back',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
    };
    const command = KeyToCommand[event.key];
    if (command) {
        if (event.type === 'keydown') {
            movement[command] = true;
            isMove = true;
        } else { /* keyup */
            movement[command] = false;
            isMove = false;
        }
        socket.emit('movement', movement,isMove);
    }
    if (event.key === 'a' && event.type === 'keydown') {
        socket.emit('smoke');
    }
});

socket.on('state', function (players, ) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 10;
    context.beginPath();
    context.fillStyle = "rgb(62,12,15)"
   // context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
    context.stroke();
    //自プレイヤー
    Object.values(players).forEach((player) => {
        if (player.socketId === socket.id) {
            myplayerpos = player.x;
            context.save();
            //自分視点の背景を描画
            context.drawImage(mapImage, -myplayerpos * movespeed, +DisplayTop);
            context.font = textfont;
            context.fillStyle = textcolor;
            ChatWriter(player);
            NameWriter(player);
            //自プレイヤーを描画
            PlayerFrameChanger(player);
            context.drawImage(playerImage, player.frameX, player.frameY, player.width, player.height,
                DisplayCenter-240, 960 - player.height - 10 + DisplayTop, 480, 480);
            context.restore();
        }
    });
    //他プレイヤー
    Object.values(players).forEach((player) => {
        if (player.socketId !== socket.id) {
            context.save();
            context.font = textfont;
            context.fillStyle = textcolor;
            ChatWriter(player);
            NameWriter(player);
            //他プレイヤーを描画
            PlayerFrameChanger(player);
            context.drawImage(playerImage, player.frameX, player.frameY, player.width, player.height,
                (player.x - myplayerpos) * movespeed + DisplayCenter -240, 960 - player.height + DisplayTop, 480, 480);
            context.restore();
        }
    });

    context.drawImage(mapImageZ1, -myplayerpos * movespeed, +DisplayTop);
   // context.drawImage(Controler, DisplayCenter - 750, +DisplayTop + 1050);
    //ピクセルカウント用
    //context.drawImage(Pixer, 0,0);

    /*
    Object.values(bullets).forEach((bullet) => {
        context.beginPath();
        context.arc(bullet.x, bullet.y, bullet.width / 2, 0, 2 * Math.PI);
        context.stroke();
    });*/
});

socket.on('dead', () => {
    $("#start-screen").show();
});



//---------------------------------
//         チャット関連
//---------------------------------


//----------------------------------
//          チャットI/O

$(function () {
    $('#message_form').submit(function () {

        socket.emit('message', $('#input_msg').val());
        $('#input_msg').val('');
        return false;
    });
});
$('#sousin').on('click', function () {
    socket.emit('message', $('#input_msg').val());
    $('#input_msg').val('');
    return false;
});

//----------------------------------
//          チャット描画
//----------------------------------

//let textcolor = "rgb(180,104,100)";
//let textcolor = "rgb(64,26,36)";
//let textcolor = "rgb(72,58,64)";
let textcolor = "rgb(88,106,76)";
//let textcolor = "rgb(176,104,76)";
let textfont = '40px misaki2';
let margin = 60;
let oneline = 6;
let num, len, lines, chr;
let bufferSize = 0;
let buffer = '';
let chatarray = [];

let ChatWriter = function (player) {
    if (player.msg === '') {return}
    if (player.socketId !== socket.id) {
        num = (player.x - myplayerpos) * movespeed;
    } else {
        num = 0;
    }

    len = player.msg.length;
    lines = Math.ceil(len / oneline);
    for (let i = 0 ,bufferLength = 0; i < len; i++) {
        buffer += player.msg.charAt(i);
        chr = buffer.charCodeAt(bufferLength);
        if ((chr >= 0x00 && chr < 0x81) ||
            (chr === 0xf8f0) ||
            (chr >= 0xff61 && chr < 0xffa0) ||
            (chr >= 0xf8f1 && chr < 0xf8f4)) {
            //半角文字の場合は0.5を加算
            bufferSize += 0.5;
        } else {
            //それ以外の文字の場合は1を加算
            bufferSize += 1.0;
        }
        bufferLength++
        if (bufferSize >= oneline && i !== len - 1) {
            chatarray.push(buffer);
            buffer = '';
            bufferSize = 0;
            bufferLength = 0;
        }
        
    }
    chatarray.push(buffer);
    buffer = '';
    bufferSize = 0;

    context.drawImage(chatboxMiddle, 0, 0, 290, 35,
        num + DisplayCenter - (oneline * 20)-20, player.y - margin - 35  - chatarray.length * 40 + textfloater, 290, chatarray.length * 40);
    context.drawImage(chatboxTop, num + DisplayCenter - (oneline * 20)-20, player.y - margin - chatarray.length * 40 - 30 - 15 - 5 + textfloater);
    context.drawImage(chatboxUnder, num + DisplayCenter - (oneline * 20) -20, player.y - margin -30 -5 + textfloater);

    for (let i = 0; i < chatarray.length; i++) {
        context.fillText(chatarray[i], num + DisplayCenter - oneline * 20, player.y - margin + DisplayTop - (chatarray.length - i) * 40 + textfloater);
    }
    chatarray = [];
}

let NameWriter = function (player) {
    if (player.socketId !== socket.id) {
        num = (player.x - myplayerpos) * movespeed;
    } else {
        num = 0;
    }
    for (let i = 0; i < player.nickname.length; i++) {
        chr = player.nickname.charCodeAt(i);
        if ((chr >= 0x00 && chr < 0x81) ||
            (chr === 0xf8f0) ||
            (chr >= 0xff61 && chr < 0xffa0) ||
            (chr >= 0xf8f1 && chr < 0xf8f4)) {
            //半角文字の場合は0.5を加算
            bufferSize += 0.5;
        } else {
            //それ以外の文字の場合は1を加算
            bufferSize += 1.0;
        }
    }
    context.fillText('＠' + player.nickname, num + DisplayCenter - (Math.ceil(bufferSize) + 1) * 20, player.y - 30 + DisplayTop + textfloater);
    bufferSize = 0;
}


//----------------------------
//      フレーム更新
//----------------------------
let age = 0;
let frame4_1fps = 0;
let frame8_4fps = 0;
let textfloater = 0;
setInterval(() => {
    age++;
    frame8_4fps++; {}
    if (age % 4 === 0) {
        frame4_1fps++;
        if (frame4_1fps === 4) {
            frame4_1fps = 0;
        }
        if (frame4_1fps > 1) {
            textfloater += 5;
        } else { textfloater -= 5; }

        if (age % 8 === 0) {
            frame8_4fps = 0;
        }
    }
    
}, 1000 / 4);

//-----------------------------------
//    プレイヤーフレーム管理&更新
//------------------------------------

let PlayerFrameChanger = function (player) {
    if (player.isSmokeAction) { //喫煙
        SmokeActionFrameChanger(player);
    }
    else if (player.isSmoking) {//喫煙アイドル
        SmokingFrameChanger(player);
    }
    else if (player.isMove) { //歩行
        WalkFrameChanger(player);
    }
    else { // アイドル
        IdleFrameChanger(player);
    }
}
let SmokeActionFrameChanger = function (player) {
    if (player.angle < 0) {
        if (player.smokeActionFrame <= 14) {
            player.frameY = player.height * 2;
        } else { player.frameY = player.height * 4; }
    }else if (player.angle > 0) {
        if (player.smokeActionFrame <= 14) {
            player.frameY = player.height * 3;
        } else { player.frameY = player.height * 5; }
    }


    switch (player.smokeActionFrame) {
        case 0: player.frameX = 0; break;
        case 1: player.frameX = player.width * 1; break;
        case 2: player.frameX = player.width * 2; break;
        case 3: player.frameX = player.width * 3; break;
        case 4: player.frameX = player.width * 4; break;
        case 5: player.frameX = player.width * 5; break;
        case 6: player.frameX = player.width * 6; break;
        case 7: player.frameX = player.width * 7; break;
        case 8: player.frameX = player.width * 6; break;
        case 9: player.frameX = player.width * 7; break;
        case 10: player.frameX = player.width * 6; break;
        case 11: player.frameX = player.width * 7; break;
        case 12: player.frameX = player.width * 8; break;
        case 13: player.frameX = player.width * 9; break;
        case 14: player.frameX = player.width * 3; break;
        case 15: player.frameX = player.width * 3; break;
        case 16: player.frameX = player.width * 3; break;
        case 17: player.frameX = player.width * 3; break;
        case 18: player.frameX = player.width * 2; break;
        case 19: player.frameX = player.width * 1; break;
        case 20: player.frameX = player.width * 4; break;
        case 21: player.frameX = player.width * 5; break;
        case 22: player.frameX = player.width * 6; break;
        case 23: player.frameX = player.width * 7; break;
    }

}
let SmokingFrameChanger = function (player) {
    if (player.angle < 0) {
            player.frameY = player.height * 4;
    }
    else if (player.angle > 0) {
            player.frameY = player.height * 5;
    }
    if (player.isMove) {
        switch (frame8_4fps) {
            case 0: case 4: player.frameX = 0; break;
            case 1: case 5: player.frameX = player.width * 8; break;
            case 2: case 6: player.frameX = 0; break;
            case 3: case 7: player.frameX = player.width * 9; break;
        }
    }
    else {
        switch (player.smokingFrame % 32) {
            case 0: player.frameX = 0; break;
            case 1: player.frameX = player.width * 1; break;
            case 2: player.frameX = player.width * 2; break;
            case 3: player.frameX = player.width * 3; break;
            case 4: player.frameX = player.width * 3; break;
            case 5: player.frameX = player.width * 3; break;
            case 6: player.frameX = player.width * 3; break;
            case 7: player.frameX = player.width * 3; break;
            case 8: player.frameX = player.width * 3; break;
            case 9: player.frameX = player.width * 3; break;
            case 10: player.frameX = player.width * 2; break;
            case 11: player.frameX = player.width * 1; break;
            case 12: player.frameX = player.width * 0; break;
            case 13: player.frameX = player.width * 4; break;
            case 14: player.frameX = player.width * 5; break;
            case 15: player.frameX = player.width * 6; break;
            case 16: player.frameX = player.width * 7; break;
            case 17: case 18: case 19: player.frameX = 0; break;
            case 20: player.frameX = player.width * 4; break;
            case 21: player.frameX = player.width * 5; break;
            case 22: player.frameX = player.width * 6; break;
            case 23: player.frameX = player.width * 7; break;
            case 24: case 25: case 26: case 27: player.frameX = 0; break;
            case 28: player.frameX = player.width * 4; break;
            case 29: player.frameX = player.width * 5; break;
            case 30: player.frameX = player.width * 6; break;
            case 31: player.frameX = player.width * 7; break;
        }
    }
}
let IdleFrameChanger = function (player) {
    if (player.angle < 0) {
        player.frameY = player.height;
        switch (frame8_4fps) {
            case 0: case 1: case 2: case 3: player.frameX = 0; break;
            case 4: player.frameX = player.width * 1; break;
            case 5: player.frameX = player.width * 2; break;
            case 6: player.frameX = player.width * 3; break;
            case 7: player.frameX = player.width * 4; break;
        }
    }
    else if (player.angle > 0) {
        player.frameY = player.height;
        switch (frame8_4fps) {
            case 0: case 1: case 2: case 3: player.frameX = player.width * 5; break;
            case 4: player.frameX = player.width * 6; break;
            case 5: player.frameX = player.width * 7; break;
            case 6: player.frameX = player.width * 8; break;
            case 7: player.frameX = player.width * 9; break;
        }
    }
}
let WalkFrameChanger = function (player) {
    if (player.angle < 0) {
        player.frameY = 0;
        switch (frame8_4fps) {
            case 0: case 4: player.frameX = 0; break;
            case 1: case 5: player.frameX = player.width * 1; break;
            case 2: case 6: player.frameX = 0; break;
            case 3: case 7: player.frameX = player.width * 2; break;
        }
    }
    else if (player.angle > 0) {
        player.frameY = 0;
        switch (frame8_4fps) {
            case 0: case 4: player.frameX = player.width * 3; break;
            case 1: case 5: player.frameX = player.width * 4; break;
            case 2: case 6: player.frameX = player.width * 3; break;
            case 3: case 7: player.frameX = player.width * 5; break;
        }
    }
}






//------------------------------------
//       コントローラー
//------------------------------------
/*
let LKey = function (event) {
    if (event === 'down') {
        movement.right = false;
        movement.left = true;
        isMove = true;
    } else {
        movement.right = false;
        movement.left = false;
        isMove = false;
    }
    socket.emit('movement', movement, isMove);
}
let RKey = function (event) {
    if (event === 'down') {
        movement.right = true;
        movement.left = false;
        isMove = true;
    } else {
        movement.right = false;
        movement.left = false;
        isMove = false;
    }
    socket.emit('movement', movement, isMove);
}
let AKey = function () {
    socket.emit('smoke');
}

let BKey = function () {
}
*/

const ua = navigator.userAgent.toLowerCase();
const isSP = /iphone|ipod|ipad|android/.test(ua);
const L = document.getElementById('left');
const R = document.getElementById('right');
const A = document.getElementById('A');
const eventStart = isSP ? 'touchstart' : 'mousedown';
const eventEnd = isSP ? 'touchend' : 'mouseup';
const eventLeave = isSP ? 'touchmove' : 'mouseleave';

L.addEventListener(eventStart, e => {
    e.preventDefault();
    L.classList.add('active');
    movement.right = false;
    movement.left = true;
    isMove = true;
    socket.emit('movement', movement, isMove);
})

L.addEventListener(eventEnd, e => {
    e.preventDefault();
    L.classList.remove('active');
    movement.right = false;
    movement.left = false;
    isMove = false;
    socket.emit('movement', movement, isMove);
});

L.addEventListener(eventLeave, e => {
    e.preventDefault();
    let el;
    el = isSP ? document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) : L;
    if (!isSP || el !== L) {
        L.classList.remove('active');
        movement.right = false;
        movement.left = false;
        isMove = false;
        socket.emit('movement', movement, isMove);
    }
});

R.addEventListener(eventStart, e => {
    e.preventDefault();
    R.classList.add('active');
    movement.right = true;
    movement.left = false;
    isMove = true;
    socket.emit('movement', movement, isMove);
})

R.addEventListener(eventEnd, e => {
    e.preventDefault();
    R.classList.remove('active');
    movement.right = false;
    movement.left = false;
    isMove = false;
    socket.emit('movement', movement, isMove);
});

R.addEventListener(eventLeave, e => {
    e.preventDefault();
    let el;
    el = isSP ? document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) : R;
    if (!isSP || el !== R) {
        R.classList.remove('active');
        movement.right = false;
        movement.left = false;
        isMove = false;
        socket.emit('movement', movement, isMove);
    }
});
A.addEventListener(eventStart, e => {
    e.preventDefault();
    socket.emit('smoke');
})
