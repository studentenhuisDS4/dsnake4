// index.ts
import { MenuScene } from './MenuScene';
import { HubScene } from './HubScene';
import { TestRunnerScene } from './TestScene';
import { PauseScene } from './PauseScene';
import { SnakeScene } from './SnakeScene';
export { MenuScene } from './MenuScene';
export { HubScene } from './HubScene';
export { TestRunnerScene } from './TestScene';
export { PauseScene } from './PauseScene';
export { SnakeScene } from './SnakeScene';
export { BootScene } from './BootScene';

// Order matters! (It defines drawing priority.)
export const SceneMap = {
    MENU: { name: "MainMenu", scene: MenuScene, start: true },
    HUB: { name: "Hub", scene: HubScene, start: false },
    GAME: { name: "Game", scene: SnakeScene, start: false },
    PAUSE: { name: "Pause", scene: PauseScene, start: false },
    TEST: { name: "TestScene", scene: TestRunnerScene, start: false }
};
