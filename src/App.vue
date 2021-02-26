<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/3237_LOGO_YOOBOT.png" width="320">
    <pomodoro/>
  </div>
</template>

<script>
import Pomodoro from './components/Pomodoro/Pomodoro'

export default {
  name: 'App',
  components: {
    Pomodoro
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.pointer {
  cursor: pointer;
}
</style>
