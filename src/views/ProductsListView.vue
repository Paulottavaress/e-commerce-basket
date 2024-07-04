<template>
  <div class="d-flex flex-column ga-4 pa-4">
    <p v-for="product in products" :key="product.id">{{ product.name }}</p>
  </div>
</template>

<script>
  import ProductsAPI from '@/APIs/ProductsAPI';

  export default {
    data() {
      return {
        // TO-DO: MAKE GLOBAL LOADING THROUH APP STORE
        isLoading: false,
        products: []
      }
    },
    methods: {
      async loadProducts () {
        try {
          this.isLoading = true;

          const res = await ProductsAPI.getProducts();
          debugger
          this.products = res.data;
        } catch (e) {

        } finally {
          this.isLoading = false;
        }
      }
    },
    async mounted() {
      await this.loadProducts();
    }
  }
</script>