<template>
  <section class="markdown markdown-body markdown-text p-2">
    <slot />
  </section>
</template>

<style lang="scss">
.markdown {
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

.markdown-text {
  h1 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
    color: hotpink;
  }
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.9rem;
  }
  h3 {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
  }
  h4 {
    font-size: 1.3rem;
    margin-bottom: 0.7rem;
  }
  h5 {
    font-size: 1.2rem;
    margin-bottom: 0.6rem;
  }
  h6 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 1rem;
  }
  ul {
    padding-left: 2rem;
    margin-bottom: 1rem;
  }

  blockquote {
    border-left: 0.4rem solid rgba(0, 0, 0, 0.255);
    padding: 0.8rem;
    margin-left: 0.4rem;
    margin-right: 0.4rem;
    margin-bottom: 1rem;
    font-style: italic;
    font-family: Georgia, 'Times New Roman', Times, serif;
    background-color: white;

    > *:only-child {
      margin-bottom: unset;
    }
  }
}
</style>
