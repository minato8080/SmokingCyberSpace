# Start of Selection
<pre>
root
├─ .env
├─ .gitignore
├─ basic_design.md
├─ package-lock.json
├─ package.json
├─ README.md
├─ webpack.config.js
│
├─ client
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ css
│  │  │  └─ style.css
│  │  ├─ fonts
│  │  │  └─ misaki_gothic_2nd.ttf
│  │  └─ img
│  │      ├─ chatbox-middle-500.png
│  │      ├─ chatbox-top-500.png
│  │      ├─ chatbox-under-500.png
│  │      ├─ map.png
│  │      ├─ map_ad.png
│  │      ├─ map_front.png
│  │      ├─ masi-icon.png
│  │      ├─ masi.png
│  │      ├─ smoke.png
│  │      ├─ tatu-icon.png
│  │      ├─ tatu.png
│  │      └─ twittercard.png
│  │
│  └─ src
│     ├─ index.html
│     └─ js
│         ├─ index.js
│         │
│         ├─ config
│         │  ├─ elementConfig.js
│         │  └─ gameConfig.js
│         │
│         ├─ controllers
│         │  ├─ keyboardController.js
│         │  └─ uiController.js
│         │
│         ├─ models
│         │  ├─ gameObjects.js
│         │  ├─ Helios.js
│         │  ├─ Radio.js
│         │  └─ Smoke.js
│         │
│         ├─ services
│         │  ├─ animationService.js
│         │  ├─ musicService.js
│         │  ├─ socketService.js
│         │  └─ uiService.js
│         │
│         └─ utils
│             ├─ animationFrameChanger.js
│             ├─ canvasHelper.js
│             └─ textUtils.js
│   
├─ dist
│  ├─ index.html
│  └─ index.js
│
└─ server
    └─ src
        ├─ common
        │  ├─ const.js
        │  └─ global.js
        │
        ├─ controller
        │  ├─ onConnection.js
        │  └─ setUpdateFrame.js
        │
        ├─ models
        │  ├─ GameObject.js
        │  └─ Player.js
        │
        ├─ main
        │  └─ server.js
        │
        └─ util
            └─ log.js
</pre>