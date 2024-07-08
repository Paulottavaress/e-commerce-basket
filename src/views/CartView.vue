<template>
  <div 
    v-if="user?.basket?.products?.length > 0 && shippingMethods.length > 0 && !isLoading && !isBEErr"
    class="d-flex flex-column flex-md-row ga-4 pa-md-4"
  >
    <div class="d-flex flex-column ga-4 w-100 w-md-75">
      <div 
        v-for="product in user.basket.products" 
        :key="product.id"
        class="w-100"
        :style="`height: ${$vuetify.display.smAndUp ? 230 : 350}px`"
      >
        <basic-card class="h-100">
          <v-card-item class="h-100">
            <div class="d-flex flex-column flex-sm-row h-100 ga-4">
              <div class="d-flex justify-center align-center border rounded-lg w-100 w-sm-25 overflow-hidden">
                <img 
                  :src="product.image" 
                  width="auto" 
                  height="100%"
                />
              </div>
              <div class="d-flex flex-column h-100 w-100 w-sm-75">
                <div class="d-flex justify-space-between align-center">
                  <v-card-title class="font-weight-bold">{{ product.name }}</v-card-title>
                  <v-btn
                    color="blue-darken-1"
                    variant="plain"
                    icon="mdi-delete-outline"
                    @click="remove(product.id)"
                  />
                </div>
                <p>{{ CurrencyFormatter(product.currency, product.price) }} per {{ product.amount_unit }}</p>
                <p>{{ sumProdTotal(product) }}</p>
                <div class="d-flex justify-center align-center">
                  <v-btn
                    color="blue-darken-1"
                    variant="plain"
                    icon="mdi-minus"
                    :disabled="this.isShippingLoading"
                    @click="decrease(product.id)"
                  />
                  <div>
                    <p>{{ product.amount }}</p>
                  </div>
                  <v-btn
                    color="blue-darken-1"
                    variant="plain"
                    icon="mdi-plus-outline"
                    :disabled="product.amount === product.amount_in_stock || this.isShippingLoading"
                    @click="increase(product.id)"
                  />
                </div>
                <p class="text-body-2">{{ amountInStock(product) }} in stock</p>
              </div>
            </div>
          </v-card-item>
        </basic-card>
      </div>
    </div>
    <div class="w-100 w-md-25">
      <basic-card class="h-100">
        <v-form
          validate-on="submit"
          :readonly="isLoading"
          @submit.prevent="handleFormSubmission"
        >
          <p class="font-weight-bold">Subtotal</p>
          <p>{{ CurrencyFormatter('USD', USDBasketSubtotal) }} | {{ CurrencyFormatter('EUR', EURBasketSubtotal) }}</p>
          <v-divider class="my-2"/>
          <p class="font-weight-bold">Shipping </p>
          <v-select
            v-model="selectedShippingMethod"
            class="my-1"
            name="shipping-method"
            density="compact"
            variant="outlined"
            hide-details
            :loading="isShippingLoading"
            :disabled="isShippingLoading"
            required
            :items="shippingMethods"
          />
          <div v-if="selectedShippingMethod">
            <p>{{ CurrencyFormatter('USD', selectedShippingMethod.USDShippingPrice) }} | {{ CurrencyFormatter('EUR', selectedShippingMethod.EURShippingPrice) }}</p>
            <p class="text-body-2">Delivers in {{ selectedShippingMethod.delivery_expectation }} {{ selectedShippingMethod.delivery_unit }}</p>
          </div>
          <v-divider class="my-2"/>
          <p class="font-weight-bold">Total </p>
          <p>{{ CurrencyFormatter('USD', USDTotal) }} | {{ CurrencyFormatter('EUR', EURTotal) }}</p>
          <v-divider class="my-2"/>
          <p class="font-weight-bold">Billing</p>
          <v-text-field
            v-model="email"
            label="Email"
            name="email"
            class="pt-1"
            density="compact"
            placeholder="Email for billing"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            autocomplete="on"
            maxlength="254"
            :error-messages="v$.email.$errors.map(e => e.$message)"
            @blur="v$.email.$touch"
            required
          />
          <v-btn
            type="submit"
            class="mt-2"
            color="blue-darken-1"
            variant="elevated"
            :disabled="isCheckoutBtnDisabled"
            :loading="isCheckoutLoading"
          >Checkout</v-btn>
        </v-form>
      </basic-card>
    </div>
  </div>
  <div 
    v-else-if="!isLoading"
    class="d-flex flex-column justify-center align-center ga-3 mt-15"
  >
    <p class="text-center text-blue-darken-1 text-h4">There are no items in the cart</p>
    <v-btn
      variant="text"
      color="blue-darken-1"
      class="text-wrap"
      to="/products-list"
      text="Click here to go to the products page and check our amazing products :)"
      append-icon="mdi-chevron-right"
      width="fit-content"
      size="large"
    />
  </div>
</template>

<script>
  // Services
  import { UsersService, ShippingService, PaymentService } from '@/services';

  // Components
  import BasicCard from '@/components/shared/BasicCard.vue';

  // Stores
  import { mapWritableState } from 'pinia';
  import { AppStore, AuthStore } from '@/stores';

  // Helpers
  import CurrencyFormatter from '@/helpers/CurrencyFormatter';

    // Libraries
  import { useVuelidate } from '@vuelidate/core';
  import { required, email, maxLength, helpers} from '@vuelidate/validators';
  import { cloneDeep } from 'lodash';

  export default {
    setup: () => ({
      v$: useVuelidate()
    }),
    components: {
      BasicCard
    },
    data() {
      return {
        isCheckoutLoading: false,
        isShippingLoading: false,
        email: '',
        shippingMethods: [],
        selectedShippingMethod: null,
        prevUserBasket: null,
        hasBasketLoadFailed: false,
        hasShippingMethodsLoadFailed: false
      }
    },
    computed: {
      ...mapWritableState(AppStore, ['isLoading', 'products']),
      ...mapWritableState(AuthStore, ['user']),
      EURBasketSubtotal() {
        const prods = this?.user.basket?.products || [];

        const total = prods.reduce((prev, curr) => 
          prev + curr.EURPrice * curr.amount
        , 0);

        return total;
      },
      USDBasketSubtotal() {
        const prods = this?.user.basket?.products || [];

        const total = prods.reduce((prev, curr) => 
          prev + curr.USDPrice * curr.amount
        , 0);

        return total;
      },
      totalItemsAmount() {
        const prods = this?.user?.basket?.products || [];

        const total = prods.reduce((prev, curr) => 
          prev + curr.amount
        , 0);

        return total;
      },
      USDTotal() {
        return this.USDBasketSubtotal + this.selectedShippingMethod?.USDShippingPrice;
      },
      EURTotal() {
        return this.EURBasketSubtotal + this.selectedShippingMethod?.EURShippingPrice;
      },
      isCheckoutBtnDisabled() {
        return this.isLoading || this.isShippingLoading || this.isCheckoutLoading || !this.selectedShippingMethod || this.isFormInvalid;
      },
      isFormInvalid() {
        return this.v$.$invalid;
      },
      isBEErr() {
        return this.hasBasketLoadFailed || this.hasShippingMethodsLoadFailed;
      }
    },
    async created() {
      this.isLoading = true;
      await this.loadBasket();
      await this.loadShippingMethods();
      this.isLoading = false;
    },
    validations() {
      return {
        email: { 
          required: helpers.withMessage('Required field.', required),
          maxLength: helpers.withMessage('Your email cannot contain more than 254 charactes.', maxLength(254)),
          email: helpers.withMessage('Invalid email.', email)
        },
      }
    },
    methods: {
      CurrencyFormatter,
      async loadBasket() {
        const res = await UsersService.fetchBasket(this.user.id);

        if (res.request.status === 500) return this.hasBasketLoadFailed = true;
        else if (res.data?.products?.length) {
          this.prevUserBasket = cloneDeep(res.data.products);
          this.user.basket = res.data;
        }

        this.hasBasketLoadFailed = false;
      },
      async loadShippingMethods() {
        const res = await ShippingService.fetchShippingMethods(this.totalItemsAmount);

        const is500 = res.request.status === 500;

        if (is500 && this.prevUserBasket && this.isShippingLoading) 
          return this.user.basket.products = cloneDeep(this.prevUserBasket);
        else if (is500) return this.hasShippingMethodsLoadFailed = true;
        else if (!res.data.length) return this.hasShippingMethodsLoadFailed = false;

        this.hasShippingMethodsLoadFailed = false

        this.shippingMethods = res.data.map(sm => ({
          ...sm,
          title: sm.name,
          value: sm
        }));

        const isSelectedShippingMethodAvailable = this.shippingMethods.find(sm => this.selectedShippingMethod && sm.id === this.selectedShippingMethod.id);

        this.prevUserBasket = cloneDeep(this.user.basket.products);

        if (isSelectedShippingMethodAvailable) return;

        this.selectedShippingMethod = this.shippingMethods.reduce((prev, curr) => {
          if (curr.price < prev.price) return curr;
          return prev;
        });
      },
      findProductById(id) {
        return this.user.basket.products.find(prod => prod.id === id);
      },
      increase(id) {
        const product = this.findProductById(id);
        product.amount++;
      },
      decrease(id) {
        const product = this.findProductById(id);

        if (product.amount > 1) product.amount--;
        else this.remove(id);
      },
      remove(id) {
        this.user.basket.products = this.user.basket.products.filter(prod => prod.id !== id);
      },
      amountInStock(product) {
        const isMultiple = product.amount_in_stock > 1;
        return `${product.amount_in_stock} ${product.amount_unit}${+ isMultiple ? 's' : ''}`;
      },
      sumProdTotal(product) {
        const total = product.price * product.amount;
        const isMultiple = product.amount > 1;
        return `${CurrencyFormatter(product.currency, total)} for ${product.amount} ${product.amount_unit}${isMultiple ? 's' : ''}`;
      },
      async handleFormSubmission() {
        try {
          this.isCheckoutLoading = true;

          const res = await PaymentService.checkout(this.user.id, this.selectedShippingMethod);

          if (res.request.status === 204) {
            this.user.basket.products = [];
            this.$router.push({ name: 'ProductsList' });
          }
        } finally {
          this.isCheckoutLoading = false;
        }
      }
    },
    watch: {
      async totalItemsAmount() {
        this.isShippingLoading = true;
        await this.loadShippingMethods();
        this.isShippingLoading = false;
      }
    }
  }
</script>

<style>
  .v-card-item__content {
    height: 100%;
  }
</style>