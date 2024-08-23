<script>
import pageWelcomeMd from './PageWelcome.md'
export default {
  components: {
    pageWelcomeMd
  }
}
</script>

<template>
  <section class="page-welcome p-2 page-welcome-body markdown-text">
    <page-welcome-md />
  </section>
</template>

<style scoped lang="scss">
.page-welcome {
  &-header {
    background-color: orange;
    color: rgb(110, 72, 0);
  }

  &-body {
    color: rgb(41, 41, 164);
    background-color: rgb(242, 242, 242);
    border: 8px solid white;
    padding: 8px;
  }
}
</style>

<style></style>
