import { globalHelpers } from '@/utils/helpers';
import i18n from '@/utils/i18n/i18n';
import { ComponentCustomProperties } from 'vue';
import VueRouter, { Route } from 'vue-router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $globalHelpers: typeof globalHelpers;
    $t: typeof i18n.t;
    $router: VueRouter

  }
}
