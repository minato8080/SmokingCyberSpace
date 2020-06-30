'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const pg = require('pg');
const connectionString = process.env.DATABASE_URL ||'postgres://gpzrlzstucgaol:f02aef829006a46ae2dc1f636cb7cba07e74b5c5a5a88ce0d1dad370dfa41fea@ec2-34-230-231-71.compute-1.amazonaws.com:5432/d87931jutk3o9b';
//const connectionString = process.env.DATABASE_URL ||'postgres://postgres:hijack69PG@localhost:5432/SCSlogs';//ローカル環境テスト用
const app = express();
const server = http.Server(app);
const io = socketIO(server);
//const fs = require('fs');
const pool = new pg.Pool({
    connectionString: connectionString
});
/*
const options = {
    flag: 'a',
    encoding: "utf8"
};
*/
const fps = 24;
let players = {};
//(ディスプレイ幅/2-遊び)/移動速度
//(1750-480)/3=423;
const ZeroPosition = 425;
//(元画像横幅-ディスプレイ幅/2-遊び)/移動速度
//(6090-1750-480)/3=1286
const MaxPosition = 1285;

let requestlist = [];
let whoserequest = [];

class GameObject {
    constructor(obj = {}) {
        this.id = Math.floor(Math.random() * 100000000);
        this.x = obj.x;
        this.y = obj.y;
        this.width = obj.width;
        this.height = obj.height;
    }
    move(distance) {
        const oldX = this.x;

        this.x += distance;

        let collision = false;
        if (this.x < -ZeroPosition || this.x >= MaxPosition) {
            collision = true;
        }

        if (collision) {
            this.x = oldX;
        }
        return !collision;
    }
    intersect(obj) {
        return (this.x <= obj.x + obj.width) &&
            (this.x + this.width >= obj.x);
    }
    toJSON() {
        return { id: this.id, x: this.x, y: this.y, width: this.width, height: this.height,};
    }
};

class Player extends GameObject {
    constructor(obj = {}) {
        super(obj);
        this.IP = obj.IP;
        this.socketId = obj.socketId;
        //if (obj.nickname === '') this.nickname = '\u540d\u7121\uff7c';
        if (obj.nickname === '') this.nickname = 'anonymous';
        else { this.nickname = obj.nickname;}
        this.width = 480;
        this.height = 480;
        this.x = 0;
        this.y = 480;
        this.angle = 1;
        this.frameX = 0;
        this.frameY = 0;
        this.speed = 5;
        this.isMove = false;
        this.movement = {};

        this.msg = '';
        this.msgCountDown = 0;

        this.isSmokeAction = false;
        this.smokeActionCountDown = 0;
        this.smokeActionFrame = 0;

        this.isSmoking = false;
        this.smokingCountDown = 0;
        this.smokingFrame = 0;
    }
    toJSON() {
        return Object.assign(super.toJSON(), {
            socketId: this.socketId, nickname: this.nickname, msg: this.msg,
            angle: this.angle, isMove: this.isMove,
            frameX: this.frameX, frameY: this.frameY,
            isSmoking: this.isSmoking, isSmokeAction: this.isSmokeAction,
            smokeActionFrame: this.smokeActionFrame, smokingFrame: this.smokingFrame,
        });
    }
};

io.on('connection', function (socket) {
    let player = null;
    socket.on('game-start', (config) => {
        player = new Player({
            IP: socket.conn.remoteAddress,
            socketId: socket.id,
            nickname: config.nickname,
        });
        console.log(socket.conn.remoteAddress);
        players[player.id] = player;
        io.sockets.emit('musicresponse', requestlist, whoserequest);
        //さんが入室しました。
        /*fs.writeFile("log.txt", LogWriter(player) + '\u3055\u3093\u304c\u5165\u5ba4\u3057\u307e\u3057\u305f\u3002' + '\n', options, (err) => {
            if (err) { console.log(err); throw err;}
        });*/
       pool
            .query('INSERT INTO roomlogs(time,ip,id,name,state) VALUES($1,$2,$3,$4,$5) RETURNING *',
                [timelog(),player.IP, player.id.toString(32), player.nickname, 'IN'])
            .then(res => {
                console.log(res.rows[0])
            })
            .catch(e => console.error(e.stack))
    });
    //------------------------------------
    //ユーザーアクション

    socket.on('movement', function (movement,isMove) {
        if (!player) { return; }
        if (!player.isSmokeAction) {
            player.movement = movement;
            if (movement > 0) { player.angle = 1; } else if (movement < 0) { player.angle = -1; }
            player.isMove = isMove;
        } else {
            player.movement.right = false;
            player.movement.left = false;
            player.isMove = false;
        }
    });
    socket.on('smoke', function () {
        if (!player) { return; }
        if (player.isSmoking) {
            player.smokingFrame = 1;
        } else {
            player.movement.right = false;
            player.movement.left = false;
            player.isMove = false;
            player.isSmokeAction = true;
            player.isSmoking = true;
            player.smokeActionCountDown = 6 * fps;
        }
    });
    socket.on('smokeend', function () {
        if (!player)return;
        if (player.isSmokeAction) return;
        else if (player.isSmoking) {
            player.smokeActionCountDown = 0;
            player.smokingFrame = 0;
            player.isSmoking = false;
        }
    });
    //チャット処理
    socket.on('message', function (msg) {
        player.msg = msg;
        if (msg === '' || msg === null) return;
        //let data = LogWriter(player) + msg + '\n';
        RequestChecker(player);
        player.msgCountDown = 30 * fps;
        /*if (msg !== '') fs.writeFile('log.txt', data , options, (err) => {
            if (err) {
                console.log(err);
                throw err;
            } else { "正常に出力されました" }
        });
        console.log(msg);*/
        pool
            .query('INSERT INTO chatlogs(time,ip,id,name,message) VALUES($1,$2,$3,$4,$5) RETURNING *',
                [timelog(), player.IP,player.id.toString(32), player.nickname, player.msg])
            .then(res => {
                console.log(res.rows[0])
            })
            .catch(e => console.error(e.stack))
    });
    socket.on('disconnect', () => {
        if (!player) { return; }
        //さんが退出しました。
        /*fs.writeFile("log.txt", LogWriter(player) + '\u3055\u3093\u304c\u9000\u51fa\u3057\u307e\u3057\u305f\u3002' + '\n', options, (err) => {
            if (err) { console.log(err); throw err;}
        });*/
        pool
            .query('INSERT INTO roomlogs(time,ip,id,name,state) VALUES($1,$2,$3,$4,$5) RETURNING *',
                [timelog(), player.IP,player.id.toString(32), player.nickname, 'OUT'])
            .then(res => {
                console.log(res.rows[0])
            })
            .catch(e => console.error(e.stack))
        delete players[player.id];
        player = null;
    });
});


let videoId;
let RequestChecker = function (player) {
    var msg = player.msg;
    //PC版のURL
    if (msg.indexOf('https://www.youtube.com/watch?v=') !== -1) {
        videoId = msg.split('https://www.youtube.com/watch?v=')[1];
    }
    //モバイルブラウザのURL
    else if (msg.indexOf('https://m.youtube.com/watch?feature=youtu.be&v=') !== -1) {
        videoId = msg.split('https://m.youtube.com/watch?feature=youtu.be&v=')[1];
    }
    //モバイルアプリ
    else if (msg.indexOf('https://youtu.be/') !== -1) {
        videoId = msg.split('https://youtu.be/')[1];
    } else { return; }
    // &=クエリパラーメターがついていることがあるので取り除く
    let ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition != -1) {
        videoId = videoId.substring(0, ampersandPosition);
    }
    //?クエリパラーメターがついていることがあるので取り除く
    let questionPosition = videoId.indexOf('?');
    if (questionPosition != -1) {
        videoId = videoId.substring(0, questionPosition);
    }
    // 正しいurlの形式だったとき送信
    if (videoId.length === 11) {
        requestlist.push(videoId);
        whoserequest.push(player.nickname);
        io.sockets.emit('musicresponse', requestlist, whoserequest);
        pool
            .query('INSERT INTO requestlist(date,ip,id,name,videoid) VALUES($1,$2,$3,$4,$5) RETURNING *',
                [datelog(), player.IP,player.id.toString(32), player.nickname, videoId])
            .then(res => {
                console.log(res.rows[0])
            })
            .catch(e => console.error(e.stack))
    }
}


setInterval(() => {
    Object.values(players).forEach((player) => {
        const movement = player.movement;
        /*if (movement.forward) {
            player.move(5);
        }
        if (movement.back) {
            player.move(-5);
        }*/
        if (movement.left) {
            player.move(-player.speed);
            player.angle = -1;
        }
        if (movement.right) {
            player.move(player.speed);
            player.angle = 1;
        }
        if (player.msgCountDown > 0) {
            player.msgCountDown--;
            if (player.msgCountDown === 0) player.msg = '';
        }
        if (player.smokeActionCountDown > 0) {
            player.smokeActionCountDown--;
            if (player.smokeActionCountDown % 6 === 0) player.smokeActionFrame++;
            if (player.smokeActionCountDown === 0) {
                player.isSmokeAction = false;
                player.smokeActionFrame = 0;
                player.smokingCountDown = 60*fps;
            }
        }
        if (player.smokingCountDown > 0) {
            player.smokingCountDown--;
            if (player.smokingCountDown % 6 === 0) player.smokingFrame++;
            if (player.smokingCountDown === 0) {
                player.isSmoking = false;
                player.smokingFrame = 0;
            }
        }
    });
    io.sockets.emit('state', players);
}, 1000 / fps);


//-----------------------------
//ログ関連
let timelog =()=>{
    let date = new Date();
    //日本時間に調整
    date.setHours(date.getHours() + 9);
    let yyyy = date.getFullYear();
    let mm = toDoubleDigits(date.getMonth() + 1);
    let dd = toDoubleDigits(date.getDate());
    let hh = toDoubleDigits(date.getHours());
    let mi = toDoubleDigits(date.getMinutes());
    let ss = toDoubleDigits(date.getSeconds());
    let time = yyyy + '/' + mm + '/' + dd + ' ' + hh + ':' + mi + ':' + ss;
    return time;
}
let datelog = () => {
    let date = new Date();
    //日本時間に調整
    date.setHours(date.getHours() + 9);
    let yyyy = date.getFullYear();
    let mm = toDoubleDigits(date.getMonth() + 1);
    let dd = toDoubleDigits(date.getDate());
    let day = yyyy + mm + dd;
    return day;
}
let toDoubleDigits = function (num) {
    num += "";
    if (num.length === 1) {
        num = "0" + num;
    }
    return num;
};
let weekhead = () => {
    let date = new Date();
    //日本時間に調整
    date.setHours(date.getHours() + 9);
    let d = date.getDay();//曜日取得
    if (d === 0) { d = 6; } else { d--; }//月曜スタート
    date.setDate(date.getDate() - d)//週の開始日をセット
    let yyyy = date.getFullYear();
    let mm = toDoubleDigits(date.getMonth() + 1);
    let dd = toDoubleDigits(date.getDate());
    let day = yyyy + mm + dd;
    return day;
}

pool
    .query('SELECT videoid,name FROM requestlist WHERE $1 <= date AND date <= $2', [weekhead(), datelog()])
    .then(res => { for (let i = 0; i < res.rows.length; i++) { requestlist.push(res.rows[i].videoid); whoserequest.push(res.rows[i].name); } console.log(requestlist); })
    .catch(e => console.error(e.stack))

/*
let LogWriter = function (player) {
    let date = new Date();
    let yyyy = date.getFullYear();
    let mm = toDoubleDigits(date.getMonth() + 1);
    let dd = toDoubleDigits(date.getDate());
    let hh = toDoubleDigits(date.getHours());
    let mi = toDoubleDigits(date.getMinutes());
    let ss = toDoubleDigits(date.getSeconds());
    let time = yyyy + '/' + mm + '/' + dd + ' ' + hh + ':' + mi + ':' + ss;
    //let log = player.msg + '\t'+time + ' id:' + player.id + ' name:' + player.nickname +   '\n';
    let log = time + '^ID:' + player.id.toString(32) + '@' + player.nickname + '<';
    return log;
}*/



app.use('/static', express.static(__dirname + '/static'));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '/static/index.html'));
});


server.listen(process.env.PORT || 3000, function () {
    console.log('Starting server on port 3000');
});
    /*
server.listen( 3000, function () {
    console.log('Starting server on port 3000');
});*/