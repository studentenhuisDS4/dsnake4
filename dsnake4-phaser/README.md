# dsnake4-phaser

This project runs in Vue and uses the `npm run <COMMAND>` as basis. This runs the `vue-cli-service` in turn.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Generate helpful JSON Schema's
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
```
npm run build
```
### Run tests with Jest (work-in-progress)
```
npm run test

npm run test:unit
```
### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
