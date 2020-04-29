# dsnake4-phaser

This project runs in Vue and uses the `npm run <COMMAND>` as basis. This runs the `vue-cli-service` in turn.

## How to install

You have one option:
1) NPM
> Install [NodeJS](https://nodejs.org/en/)
2) Install
> Go to **./dsnake4-phaser** folder and perform `npm install`

### Once setup:
> Run NPM command by running the Chrome/Brave/Firefox target in the [VS Code](https://code.visualstudio.com/) Debug-panel.

## (Manual / terminal) Project setup
> Go to **./dsnake4-phaser** folder.
```
npm install
```

### Compiles and hot-reloads for development
> Go to **./dsnake4-phaser** folder.
```
npm run serve
```

### Generate helpful JSON Schema's
> Go to **./dsnake4-phaser** folder.
This will generate any hard-coded schema's based on the typescript interfaces specified in the project. This is to make f.e. manual level generation in VS Code much easier.

```
npm run schemas
```

Note: you need to adjust .vscode/settings.json to add any generated schema:
```
"json.schemas": [
    {
        "fileMatch": [
            "**/Level*"
        ],
        "url": "./schemas/level_schema.json"
    }
]
```

# Other useful commands
The next commands are useful for compiling distributable code and running tests.

### Compiles and minifies for production
> Production build ready for the ds4 server.
```
npm run build
```
### Run tests with Jest (work-in-progress)
> Not working yet.
```
npm run test
npm run test:unit
```
### Lints and fixes files
> Check code styling with lint command.
```
npm run lint
```

### Customize configuration
> Vue configuration below.
See [Configuration Reference](https://cli.vuejs.org/config/).
