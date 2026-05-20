const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// 1. 初始化 Express 與 HTTP 伺服器
const app = express();
const server = http.createServer(app);

// 2. 將 Socket.IO 綁定到 HTTP 伺服器上
const io = new Server(server);

// 3. 設定靜態檔案目錄 (之後前端的 html, js, css 會放在這裡)
app.use(express.static('public'));

// 4. Socket.IO 的核心邏輯：監聽連線與事件
io.on('connection', (socket) => {
    // 每個連線進來的使用者，都會有一個專屬的 socket.id
    console.log(`[系統] 有新使用者連線了！Socket ID: ${socket.id}`);

    // 事件 A：監聽使用者「加入房間」
    socket.on('join_room', (data) => {
        socket.join(data.roomId); // Socket.IO 內建的房間管理功能
        console.log(`[系統] ${data.userName} (${socket.id}) 加入了房間: ${data.roomId}`);
    });

    // 事件 B：監聽使用者「發送訊息」
    socket.on('send_message', (data) => {
        console.log(`[房間 ${data.roomId}] ${data.userName}: ${data.content}`);
        
        // 將訊息「廣播」給該房間內的所有人 (包含發送者自己)
        io.to(data.roomId).emit('receive_message', data);
    });

    // 事件 C：監聽使用者「斷線」
    socket.on('disconnect', () => {
        console.log(`[系統] 使用者斷線了！Socket ID: ${socket.id}`);
    });
});

// 5. 啟動伺服器，監聽 3000 埠口
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`伺服器已成功啟動！請在瀏覽器輸入 http://localhost:${PORT}`);
});