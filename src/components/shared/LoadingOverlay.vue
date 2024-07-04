<template>
  <v-overlay :modelValue="isLoading" persistent class="d-flex justify-center align-center">
    <v-progress-circular
      :size="90"
      :width="12"
      color="blue-darken-1"
      indeterminate
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
  export default {
    props: {
      isLoading: {
        required: true,
        type: Boolean
      }
    }
  }
</script>