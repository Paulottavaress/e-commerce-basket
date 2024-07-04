<template>
  <div class="d-flex flex-column ga-4 pa-4">
    <div class="d-flex flex-wrap ga-4">
      <div 
        v-for="product in products" 
        :key="product.id"
        :style="itemWidth"
      >
        <basic-card class="h-100">
          <v-card-item class="h-100">
            <div class="d-flex flex-column h-100">
              <v-card-title>{{ product.name }}</v-card-title>
              <div class="d-flex align-center justify-center flex-grow-1 border rounded-lg overflow-hidden my-4">
                <img 
                  :src="product.image" 
                  width="100%" 
                  height="auto"
                />
              </div>
              <p>Price: {{ CurrencyFormatter(product.currency, product.price) }}</p>
              <p>Stock: {{ amountInStock(product) }}</p>
            </div>
          </v-card-item>
        </basic-card>
      </div>
    </div>
  </div>
</template>

<script>
  // APIs
  import ProductsAPI from '@/APIs/ProductsAPI';

  // Components
  import BasicCard from '@/components/shared/BasicCard.vue';

  // Stores
  import { mapWritableState } from 'pinia';
  import { AppStore } from '@/stores';

  // Helpers
  import CurrencyFormatter from '@/helpers/CurrencyFormatter';

  export default {
    components: {
      BasicCard
    },
    data() {
      return {
        products: []
      }
    },
    computed: {
      ...mapWritableState(AppStore, ['isLoading']),
      itemWidth() {
        let itemWidth = 'width: calc(100% / 4 - 16px);';

        if (this.$vuetify.display.xs) itemWidth = 'width: 100%;';
        else if (this.$vuetify.display.sm) itemWidth = 'width: calc(100% / 2 - 8px)';
        else if (this.$vuetify.display.md) itemWidth = 'width: calc(100% / 3 - 10.67px);';

        return itemWidth;
      }
    },
    async mounted() {
      await this.loadProducts();
    },
    methods: {
      CurrencyFormatter,
      async loadProducts () {
        try {
          this.isLoading = true;

          const res = await ProductsAPI.getProducts();

          this.products = res.data;
        } catch (e) {

        } finally {
          this.isLoading = false;
        }
      },
      amountInStock(product) {
        const isMultiple = product.amount_in_stock > 1;

        return `${product.amount_in_stock} ${product.amount_unit}${+ isMultiple ? 's' : ''}`;
      }
    },
  }
</script>

<style>
  .v-card-item__content {
    height: 100%;
  }
</style>