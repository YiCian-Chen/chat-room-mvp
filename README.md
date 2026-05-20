# 💬 多對多聊天室 MVP (Multi-Room Chat)

這是一個基於 Node.js 與 Socket.IO 開發的即時多對多聊天室最小可行原型，透過與AI協作來完成。
支援多位使用者同時在線，並可自由加入或創建獨立的聊天房間（Room）進行即時文字通訊。

## 🚀 如何下載 / 安裝 / 開始此專案

請確認你的電腦已安裝 [Node.js](https://nodejs.org/)。

### 1. 下載專案
將此專案 Clone 到本地端：
```bash
git clone [https://github.com/YiCian-Chen/chat-room-mvp.git](https://github.com/YiCian-Chen/chat-room-mvp.git)
cd chat-room-mvp

```

### 2. 安裝相依套件

專案不包含 `node_modules`，請執行以下指令安裝伺服器所需的套件：

```bash
npm install

```

### 3. 啟動伺服器

我們使用 `nodemon` 作為開發伺服器，啟動指令如下：

```bash
npm run dev

```

啟動成功後，終端機會顯示：`伺服器已成功啟動！請在瀏覽器輸入 http://localhost:3000`

### 4. 開始使用

1. 開啟瀏覽器，進入 `http://localhost:3000`
2. 可以開啟多個瀏覽器分頁模擬多位使用者。
3. 輸入相同的「房間代碼」即可進入同一個聊天室互相傳送訊息。

---

## 🛠 核心技術說明

本專案將「網頁伺服器」與「即時通訊伺服器」整合於單一 Node.js 進程中，核心技術如下：

* **Node.js**: 採用非同步事件驅動架構的 JavaScript 執行環境，非常適合處理高併發的 I/O 密集型網路應用。
* **Express.js**: 輕量級的網頁伺服器框架，負責提供靜態檔案（HTML, CSS, JS）的路由服務。
* **Socket.IO**: 處理 WebSocket 雙向通訊的核心引擎。
* **雙向即時通訊**: 突破傳統 HTTP Request/Response 的單向限制，允許伺服器主動將新訊息「推播 (Push)」給客戶端。
* **發布/訂閱模式 (Pub/Sub) 與房間管理**: 利用 Socket.IO 內建的 `join(roomId)` 方法，讓不同的 WebSocket 連線在記憶體中進行邏輯分組。當發送訊息時，透過 `io.to(roomId).emit()` 即可達成精準的多對多路由廣播，確保訊息不會流到其他房間。
* **Vanilla HTML/JS**: 前端無需依賴複雜的框架，透過原生 JavaScript 監聽 DOM 事件並觸發 Socket 封包發送，達成最輕量化的 MVP 實作。
