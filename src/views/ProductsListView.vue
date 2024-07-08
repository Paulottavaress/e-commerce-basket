<template>
  <div 
    v-if="!isLoading && products?.length"
    class="d-flex flex-column ga-4 pa-4"
  >
    <div class="d-flex flex-wrap ga-4">
      <div 
        v-for="product in products" 
        :key="product.id"
        :style="itemWidth"
      >
        <basic-card class="h-100">
          <v-card-item class="h-100">
            <div class="d-flex flex-column h-100">
              <v-card-title class="font-weight-bold">{{ product.name }}</v-card-title>
              <div class="d-flex align-center justify-center flex-grow-1 border rounded-lg overflow-hidden my-4">
                <img 
                  :src="product.image" 
                  width="100%" 
                  height="auto"
                />
              </div>
              <p>{{ CurrencyFormatter(product.currency, product.price) }}</p>
              <p :class="[product.amount_in_stock > 0 ? 'text-dark' : 'text-red font-weight-bold']">{{ amountInStock(product) }}</p>
              <v-btn
                class="mt-2"
                color="blue-darken-1"
                variant="elevated"
                :disabled="!product.amount_in_stock"
                @click="addToCart(product)"
              >Add to cart</v-btn>
            </div>
          </v-card-item>
        </basic-card>
      </div>
    </div>
  </div>
  <div 
    v-else-if="!isLoading"
    class="d-flex flex-column justify-center align-center ga-3 mt-15"
  >
    <p class="text-center text-blue-darken-1 text-h4">There are no products available</p>
    <v-btn
      variant="text"
      color="blue-darken-1"
      class="text-wrap"
      text="Click here to find products again, something new might show up!"
      append-icon="mdi-chevron-right"
      width="fit-content"
      size="large"
      @click="loadProducts();"
    />
  </div>
</template>

<script>
  // Services
  import { ProductsService } from '@/services';

  // Components
  import BasicCard from '@/components/shared/BasicCard.vue';

  // Stores
  import { mapWritableState, mapState } from 'pinia';
  import { AppStore, AuthStore } from '@/stores';

  // Helpers
  import CurrencyFormatter from '@/helpers/CurrencyFormatter';

  //Handlers
  import { warn } from '@/handlers/NotificationsHandler';

  export default {
    components: {
      BasicCard
    },
    data() {
      return {}
    },
    computed: {
      ...mapWritableState(AppStore, ['isLoading', 'products']),
      ...mapState(AuthStore, ['isAuthenticated',]),
      ...mapWritableState(AuthStore, ['user']),
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

          const res = await ProductsService.fetchAllProducts();

          this.products = res.data;
        } finally {
          this.isLoading = false;
        }
      },
      addToCart(product) {
        if (!this.isAuthenticated) {
          const notificationMsg = 'You must sign in to add items to the cart.';
          return warn({ notificationMsg });
        } 

        const isBasketEmpty = !this.user.basket.products || !this.user.basket.products.length;

        if (isBasketEmpty) {
          this.user.basket.products = [{
            ...product,
            amount: 1
          }];

          return this.$router.push({ name: 'Cart' });
        }

        const productInTheBasket = this.user.basket.products.find(prod => prod.id === product.id);

        if (productInTheBasket) productInTheBasket.amount++;
        else this.user.basket.products.push({
          ...product,
          amount: 1
        });

        this.$router.push({ name: 'Cart' });
      },
      amountInStock(product) {
        const isMultiple = product.amount_in_stock > 1;
        const amountInStock = product.amount_in_stock || 'Out of Stock';
        const amountUnit = product.amount_in_stock
          ? product.amount_unit
          : '';
        const text = amountInStock === 'Out of Stock' 
          ? '' 
          : 'in stock';

        return `${amountInStock} ${amountUnit}${+ isMultiple ? 's' : ''} ${text}`;
      }
    },
  }
</script>

<style>
  .v-card-item__content {
    height: 100%;
  }
</style>