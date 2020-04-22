<template>
  <div>
    <h2 class="green-title">{{ title }}</h2>
    <div :id="canvasIdentifier"></div>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import { launchGame } from "./GameConfig";

@Component
export default class Game extends Vue {
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
    
    // this.game.scene..restart();
  }

  destroyed() {
    console.log("GAME - Destroy called");
    this.game.destroy(true);
  }
}
</script>

<style scoped>
div {
  font-family: 'Consolas';
}
</style>