<template>
  <div>
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src="/images/generic-logo.svg"
    />

    <v-card
      :class="formWrapperClasses"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <v-form
        validate-on="submit"
        :readonly="isLoading"
        @submit.prevent="handleFormSubmission"
      >
        <p class="text-center text-blue-darken-1 mb-3 text-h5">Login to your account</p>

        <v-text-field
          v-model="email"
          label="Email"
          name="email"
          class="pb-2"
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          autocomplete="on"
          maxlength="254"
          required
          :error-messages="v$.email.$errors.map(e => e.$message)"
          @blur="v$.email.$touch"
        />

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-end">
          <v-btn
            variant="text"
            color="blue-darken-1"
            to="/recover-password"
            text="Forgot your passsword?"
            append-icon="mdi-chevron-right"
            size="x-small"
          />
        </div>

        <v-text-field
          v-model="password"
          label="Password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          name="password"
          class="pb-2"
          density="compact"
          placeholder="Insert your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          autocomplete="on"
          maxLength="256"
          required
          :error-messages="v$.password.$errors.map(e => e.$message)"
          @blur="v$.password.$touch"
          @click:append-inner="visible = !visible"
        />

        <v-card
          :class="warningWrapperClasses"
          color="surface-variant"
          variant="tonal"
        >
          <v-card-text class="text-medium-emphasis text-caption">
            Warning: After 3 frustrated access attemps, your account will be temporarily blocked for 60 minutes. If you need to access your account now, you can click in "Forgot your passowrd?" down bellow to create a new password.
          </v-card-text>
        </v-card>

        <v-btn
          type="submit"
          class="mb-4"
          color="blue-darken-1"
          size="large"
          variant="tonal"
          block
          text="Login"
          :loading="isLoading"
          :disabled="isLoginBtnDisabled"
        />

        <v-card-text class="text-center">
          <v-btn
            variant="text"
            color="blue-darken-1"
            to="/signup"
            text="Sign in"
            append-icon="mdi-chevron-right"
            size="x-small"
          />
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script>
  // Stores
  import { mapWritableState } from 'pinia';
  import { AuthStore } from '@/stores';

  // Services
  import { UsersService } from '@/services';

  // Libraries
  import { useVuelidate } from '@vuelidate/core';
  import { required, email, maxLength, helpers} from '@vuelidate/validators';

  export default {
    setup: () => ({
      v$: useVuelidate()
    }),
    data: () => ({
      isLoading: true,
      email: '',
      password: '',
      visible: false,
      hasBEValidationFailed: false
    }),
    computed: {
      ...mapWritableState(AuthStore, ['user']),
      isLoginBtnDisabled() {
        return this.isLoading || this.isFormInvalid;
      },
      isFormInvalid() {
        return this.v$.$invalid;
      },
      formWrapperClasses() {
        let classes = 'mx-auto';

        if (this.$vuetify.display.smAndUp) classes += ' pa-12 pb-8';
        else classes += ' pa-6 pb-4';

        return classes;
      },
      warningWrapperClasses() {
        let classes = '';

        if (this.$vuetify.display.smAndUp) classes = 'mt-5 mb-12';
        else classes = 'mt-3 mb-8';

        return classes;
      }
    },
    validations() {
      return {
        email: { 
          required: helpers.withMessage('Required field.', required),
          maxLength: helpers.withMessage('Your email cannot contain more than 254 charactes.', maxLength(254)),
          email: helpers.withMessage('Invalid email.', email),
          hasBEValidationFailed: () => { return !this.hasBEValidationFailed }
        },
        password: { 
          required: helpers.withMessage('Required field.', required),
          maxLength: helpers.withMessage('Your email cannot contain more than 256 charactes.', maxLength(256)),
          hasBEValidationFailed: () => { return !this.hasBEValidationFailed }
        }
      }
    },
    mounted() {
      this.isLoading = false;
    },
    methods: {
      async handleFormSubmission() {
        try {
          this.isLoading = true;

          const res = await UsersService.login(this.email, this.password);

          const hasValidationSuccedeed = res.request.status === 200;
          const hasBEValidationFailed = res.request.status === 422;

          if (hasBEValidationFailed) return this.hasBEValidationFailed = true;
          if (!hasValidationSuccedeed) return;

          this.user = res.data;

          this.$router.push({ name: 'Home' });
        } finally {
          this.isLoading = false;
        }
      },
    },
    watch: {
      email() {
        this.hasBEValidationFailed = false;
      },
      password() {
        this.hasBEValidationFailed = false;
      }
    }
  }
</script>