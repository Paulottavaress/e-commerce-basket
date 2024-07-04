<template>
  <v-layout>
    <v-main>
      <v-container>
        <router-view />
        <loading-overlay :is-loading="isLoading" />
      </v-container>
    </v-main>
    <v-sonner position="top-right" />
  </v-layout>
</template>

<script>
  // Router
  import { RouterView } from 'vue-router'

  // Libraries
  import { VSonner } from 'vuetify-sonner';
  import 'vuetify-sonner/style.css';
  
  // Components
  import LoadingOverlay from '@/components/shared/LoadingOverlay.vue'

  export default {
    data() {
      return {
        isLoading: false
      }
    },
    components: {
      // LeftDrawer,
      VSonner,
      LoadingOverlay
    },
  }
</script>

<style lang='scss'>
  .v-main {
    background-color: #e0e0e0;
    min-height: 100vh;
  }
</style>
