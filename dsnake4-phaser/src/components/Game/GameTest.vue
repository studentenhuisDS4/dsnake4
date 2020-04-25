<template>
  <div>
    <h2 class="green-title">{{ title }}</h2>
    <div :id="canvasIdentifier"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { launchGame } from "./GameConfig";
import { UnitTestScene } from "./Scenes/TestScene";

@Component
export default class GameTest extends Vue {
  @Prop() private title!: string;
  private canvasIdentifier = "gameCanvas";
  private game!: Phaser.Game;

  constructor() {
    super();
    console.log("GAME - started");
  }

  created() {
    console.log("GAME - created");
  }

  mounted() {
    console.log("GAME - mounted");
    this.game = launchGame(this.canvasIdentifier);
    try {
      this.game.scene.run(UnitTestScene);
    } catch (e) {
        console.warn("Running UNIT TESTS failed with exception:", e);
    }
  }

  destroyed() {
    console.log("GAME - Destroy called");
    this.game.destroy(true);
  }
}
</script>

<style scoped>
div {
  font-family: "Consolas";
}
</style>