<template>
  <v-layout>
    <left-drawer />
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

  // Stores
  import { mapState } from 'pinia';
  import { AppStore } from '@/stores';

  // Libraries
  import { VSonner } from 'vuetify-sonner';
  import 'vuetify-sonner/style.css';
  
  // Components
  import LeftDrawer from './components/shared/LeftDrawer.vue'
  import LoadingOverlay from '@/components/shared/LoadingOverlay.vue'

  export default {
    components: {
      LeftDrawer,
      VSonner,
      LoadingOverlay
    },
    computed: {
      ...mapState(AppStore, ['isLoading']),
    },
  }
</script>

<style lang='scss'>
  .v-main {
    background-color: #e0e0e0;
    min-height: 100vh;
  }
</style>
