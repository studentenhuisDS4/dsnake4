# Use generateSchemas.ts for an alternative:
# > `npm run schemas`
# EXPERIMENTAL ALTERNATIVE:Call typescript-json-schema tool
# > `npm run schemas-ts`

$path = "..\schemas\"
If (!(test-path $path))
{
    mkdir $path
}

# Install package globally with `npm i -g typescript-json-schema`
npx typescript-json-schema ".\src\components\Game\Data\Map\LevelData.ts" ILevel -o "..\schemas\level_schema.json" --noExtraProps
Write-Output "Generated 1 .json schema (.\schemas\level_schema.json) from class ILevel (.\src\components\Game\Data\Map\LevelData.ts)."