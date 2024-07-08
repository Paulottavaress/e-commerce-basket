<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    mobile-breakpoint="0"
    expand-on-hover
  >
    <div class="d-flex flex-column justify-space-between h-100">
      <v-list nav>
        <v-list-item to="/">
          <v-img
            class="mx-auto my-6"
            max-width="150"
            src="/images/generic-logo.svg"
          ></v-img>
        </v-list-item>
        <v-list-item v-if="isAuthenticated" :title="userFirstName">
          <template #prepend>
            <v-avatar color="blue-darken-1">
              <span class="text-subtitle-2">{{ userNameInitials }}</span>
            </v-avatar>
          </template>
        </v-list-item>
        <v-list-item v-if="isAuthenticated" to="cart" prepend-icon="mdi-cart-outline" title="Cart" :color="activeColor"></v-list-item>
        <v-divider></v-divider>
        <v-list-item to="products-list" prepend-icon="mdi-shopping-outline" title="Shop" :color="activeColor"></v-list-item>
      </v-list>
      <v-list nav>
        <v-list-item v-if="isAuthenticated" prepend-icon="mdi-logout" title="Logout" :color="activeColor" @click="logout"></v-list-item>
        <v-list-item v-else-if="isAuthRoutes" to="/login" prepend-icon="mdi-login" title="Login" :color="activeColor"></v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
  <v-app-bar v-if="$vuetify.display.smAndDown">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title class="mr-4">{{ $route.name }}</v-app-bar-title>
    <v-img
      class="mx-auto mr-5"
      max-width="125"
      src="/images/generic-logo.svg"
      @click="goToHomePage"
    ></v-img>
  </v-app-bar>
</template>

<script>
  // Stores
  import { mapState, getActivePinia } from 'pinia';
  import { AuthStore } from '@/stores';

  // Router
  import { authRoutesList } from '@/router';

  export default {
    data () {
      return {
        drawer: true,
        rail: true,
        activeColor: 'blue-darken-1'
      }
    },
    beforeMount() {
      if (this.$vuetify.display.smAndDown) {
        this.drawer = false;
        this.rail = false;
      }
    },
    methods: {
      logout() {
        getActivePinia()._s.forEach(store => store.$reset());
        this.$router.push({ name: 'Login' });
      },
      goToHomePage() {
        this.$router.push({ name: 'Home' });
      }
    },
    computed: {
      ...mapState(AuthStore, ['isAuthenticated', 'userFirstName', 'userNameInitials']),
      isAuthRoutes() {
        return !authRoutesList.includes(this.$route.name);
      }
    },
    watch: {
      "$vuetify.display.smAndDown"(_, newVal) {
        this.drawer = newVal;
        this.rail = newVal;
      },
      "$route"() {
        if (this.$vuetify.display.smAndDown) this.drawer = false;
      }
    }
  }
</script>