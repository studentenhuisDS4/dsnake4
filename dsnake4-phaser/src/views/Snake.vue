<template>
  <div class="gameContainer">
    <Game title="DSnake4" />
  </div>
</template>

<script>
// @ is an alias to /src
import Game from "@/components/Game/Game.vue";

export default {
  name: "Snake",
  components: {
    Game
  }
};
</script>