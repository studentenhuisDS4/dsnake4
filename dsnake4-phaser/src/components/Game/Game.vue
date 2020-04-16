<template>
  <div>
    <span>Message:{{ msg }}</span>
    <div id="content"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { SnakeGame, gameConfig } from "./Game";
@Component
export default class Game extends Vue {
  @Prop() private msg!: string;
  private game: SnakeGame;

  constructor() {
    super();
    this.game = new SnakeGame(gameConfig);
    console.log(this.game.canvas);
  }
}
</script>