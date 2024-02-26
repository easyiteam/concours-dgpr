<template>
  <div class="spinner"></div>
</template>

<style lang="scss" scoped>
.spinner {
  width: 42px;
  height: 42px;
  background-color: transparent;
  border-top: solid 3.5px rgba($color: #085a03, $alpha: 1);
  border-right: solid 3.5px rgba($color: #085a03, $alpha: 0.75);
  border-bottom: solid 3.5px rgba($color: #085a03, $alpha: 0.5);
  border-left: solid 3.5px rgba($color: #085a03, $alpha: 0.25);
  border-radius: 50%;
  animation: rotate 0.5s linear infinite forwards;
}
</style>