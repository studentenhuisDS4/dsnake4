<template>
  <div class="gameContainer">
    <h1>This is a snake game.</h1>
    <Game msg="DS4 Snake Game"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Game from '@/components/Game/Game.vue'

export default {
  name: 'Snake',
  components: {
    Game
  }
}
</script>
