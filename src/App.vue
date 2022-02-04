<template>
  <div id="app" class="pt-4">
    <h1>Pomodoro Timer</h1>
    <p>
      Made with <span class="text-danger">♥</span> by
      <a target="_blank" href="https://github.com/mury12/pomodoro">Mury12</a>
    </p>
    <pomodoro />
    <footer
      class="
        position-absolute
        w-100
        border-top
        d-flex
        flex-column
        justify-content-center
        py-3
      "
    >
      <small>
        Please report related bugs in our&nbsp;
        <a target="_blank" href="https://github.com/Mury12/pomodoro/issues/new"
          >repository</a
        >
      </small>
      <small>
        If I helped you in some way and you want to contribute, you can make a
        donation in BNB, MATIC or ETH to <br />
        <a href="#" @click.prevent="copy"
          >0xd7d1DB401EA825b0325141Cd5e6cd7C2d01825f2</a
        >
      </small>
    </footer>
  </div>
</template>

<script>
import Pomodoro from "./components/Pomodoro/Pomodoro";

export default {
  name: "App",
  components: {
    Pomodoro,
  },
  methods: {
    /**
     * Copies a content to the clipboard. Note that if the content is `typeof object`, then the content
     * will be JSON.stringified.
     *
     * @param content the content to be copied
     * @returns void
     */
    copyToClipboard(content) {
      let clipboard;
      if (typeof content === "object") {
        clipboard = JSON.stringify(content);
      } else clipboard = content;

      const target = document.createElement("textarea");
      target.value = clipboard;
      document.body.appendChild(target);

      target.select();

      this.$bvToast.toast("Address copied to clipboard.", {
        type: "success",
      });

      document.execCommand("copy");
      document.body.removeChild(target);
    },
  },
};
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

footer {
  bottom: 0;
}
</style>
