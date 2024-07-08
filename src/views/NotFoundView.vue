<template>
  <div class="d-flex flex-column justify-center align-center ga-3 mt-15">
    <p class="text-center text-blue-darken-1 text-h3">This page does not exist</p>
    <v-btn
      variant="text"
      color="blue-darken-1"
      class="text-wrap"
      :to="redirectRoutePath"
      :text="redirectText"
      append-icon="mdi-chevron-right"
      width="fit-content"
      size="large"
    />
  </div>
</template>

<script>
  // Store
  import { AuthStore } from '@/stores';
  import { mapState } from 'pinia';

  export default {
    computed: {
      ...mapState(AuthStore, ['isAuthenticated']),
      redirectText() {
        return this.isAuthenticated ? 'Click here to go back to the products page' : 'Click here to login to your account';
      },
      redirectRoutePath() {
        return this.isAuthenticated ? '/products-list' : '/login';
      }
    }
  }
</script>