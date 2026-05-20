// 1. 建立與伺服器的 WebSocket 連線 (因為前後端在同個網域，直接呼叫 io() 即可)
const socket = io();

// 2. 取得畫面上的 DOM 元素
const loginSection = document.getElementById('login-section');
const chatSection = document.getElementById('chat-section');
const usernameInput = document.getElementById('username');
const roomInput = document.getElementById('room');
const joinBtn = document.getElementById('join-btn');
const roomTitle = document.getElementById('room-title');
const messagesDiv = document.getElementById('messages');
const msgInput = document.getElementById('msg-input');
const sendBtn = document.getElementById('send-btn');

// 記錄目前的使用者狀態
let currentUserName = '';
let currentRoomId = '';

// ==========================================
// 事件 A：按下「加入房間」按鈕
// ==========================================
joinBtn.addEventListener('click', () => {
    const userName = usernameInput.value.trim();
    const roomId = roomInput.value.trim();

    if (userName && roomId) {
        currentUserName = userName;
        currentRoomId = roomId;

        // 告訴後端：我要加入這個房間 (觸發後端的 join_room 事件)
        socket.emit('join_room', {
            roomId: currentRoomId,
            userName: currentUserName
        });

        // 切換畫面：隱藏登入區，顯示聊天區
        loginSection.style.display = 'none';
        chatSection.style.display = 'block';
        roomTitle.textContent = `📍 目前所在房間：${currentRoomId}`;
    } else {
        alert('名字和房間代碼都不能為空喔！');
    }
});

// ==========================================
// 事件 B：按下「發送」按鈕
// ==========================================
sendBtn.addEventListener('click', () => {
    const content = msgInput.value.trim();

    if (content) {
        // 告訴後端：我要發送訊息 (觸發後端的 send_message 事件)
        socket.emit('send_message', {
            roomId: currentRoomId,
            userName: currentUserName,
            content: content,
            timestamp: Date.now()
        });

        // 送出後清空輸入框
        msgInput.value = '';
    }
});

// (加碼) 讓輸入框按下 Enter 鍵也能發送
msgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

// ==========================================
// 事件 C：監聽伺服器傳來的「receive_message」廣播
// ==========================================
socket.on('receive_message', (data) => {
    // 建立一個新的 div 來裝這則訊息
    const msgElement = document.createElement('div');
    msgElement.classList.add('message');
    
    // 判斷是「自己發的」還是「別人發的」，決定顯示顏色
    if (data.userName === currentUserName) {
        msgElement.classList.add('my-msg');
        msgElement.textContent = `${data.content} :[你]`;
    } else {
        msgElement.classList.add('other-msg');
        msgElement.textContent = `[${data.userName}]: ${data.content}`;
    }

    // 將訊息塞進畫面中
    messagesDiv.appendChild(msgElement);
    
    // 讓對話框自動滾動到最底部的最新訊息
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});