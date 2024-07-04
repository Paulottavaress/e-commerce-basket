<template>
    <v-card>
      <div class="color-mark" :style="{ backgroundColor }"></div>
      <div class="px-6 py-3 h-100">
        <slot></slot>
      </div>
    </v-card>
</template>

<script>
  export default {
    props: {
      backgroundColor: {
        required: false,
        default: '#1f76d2'
      }
    }
  };
</script>

<style scoped>
  .color-mark {
    height: 4px;
  }
</style>