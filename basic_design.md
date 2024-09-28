SMOKING_CYBERSPACE
├─ .env
├─ .env.develop
├─ .gitignore
├─ basic_design.md
├─ package-lock.json
├─ package.json
├─ README.md
├─ webpack.config.js
│
├─ client
│   ├─ public
│   │   ├─ favicon.ico
│   │   ├─ index.html
│   │   │
│   │   └─ img
│   │       ├─ chatbox-middle-500.png
│   │       ├─ chatbox-top-500.png
│   │       ├─ chatbox-under-500.png
│   │       ├─ map.png
│   │       ├─ map_ad.png
│   │       ├─ map_front.png
│   │       ├─ masi-icon.png
│   │       ├─ masi.png
│   │       ├─ smoke.png
│   │       ├─ tatu-icon.png
│   │       ├─ tatu.png
│   │       └─ twittercard.png
│   │
│   └─ src
│       ├─ css
│       │   └─ style.css
│       │
│       ├─ fonts
│       │   └─ misaki_gothic_2nd.ttf
│       │
│       ├─ lib
│       │   └─ jquery.cookie.js
│       │
│       ├─ config            // 設定ファイル
│       │   └─ database.js   // データベース接続設定
│       │
│       ├─ controllers       // コントローラー
│       │   ├─ userController.js  // ユーザー関連の処理
│       │   └─ playerController.js // プレイヤー関連の処理
│       │
│       ├─ models            // モデル
│       │   ├─ userModel.js   // ユーザーモデル
│       │   └─ playerModel.js // プレイヤーモデル
│       │
│       ├─ routes            // ルーティング
│       │   ├─ userRoutes.js  // ユーザー関連のルート
│       │   └─ playerRoutes.js // プレイヤー関連のルート
│       │
│       ├─ services          // サービス層
│       │   ├─ userService.js  // ユーザー関連のビジネスロジック
│       │   └─ playerService.js // プレイヤー関連のビジネスロジック
│       │
│       ├─ utils             // ユーティリティ関数
│       │   └─ helper.js     // ヘルパー関数
│       │
│       ├─ middlewares       // ミドルウェア
│       │   └─ authMiddleware.js // 認証ミドルウェア
│       │
│       └─ main
│           ├─ const.js
│           └─ index.js
│
├─ dist
│   ├─ c9833d5faab9099f2334.ttf
│   ├─ favicon.ico
│   ├─ index.html
│   ├─ index.js
│   │
│   └─ img
│       ├─ chatbox-middle-500.png
│       ├─ chatbox-top-500.png
│       ├─ chatbox-under-500.png
│       ├─ map.png
│       ├─ map_ad.png
│       ├─ map_front.png
│       ├─ masi-icon.png
│       ├─ masi.png
│       ├─ smoke.png
│       ├─ tatu-icon.png
│       ├─ tatu.png
│       └─ twittercard.png
│
└─ server
    └─ src
        ├─ common
        │   ├─ const.js
        │   └─ global.js
        │
        ├─ controller
        │   ├─ onConnection.js
        │   └─ setUpdateFrame.js
        │
        ├─ lib
        │   ├─ GameObject.js
        │   └─ Player.js
        │
        ├─ main
        │   └─ server.js
        │
        └─ util
            └─ log.js