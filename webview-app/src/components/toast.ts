import { createApp } from "vue";
import ComponentTemplate from "./toast.vue";
import { vuetify } from "../vuetify";

export const useToast = (opt: string | { text: string; timeout?: number; callback?: Function }) => {
    const vueMountModel = createApp(ComponentTemplate).use(vuetify);
    const vm = vueMountModel.mount(document.createElement("div")) as InstanceType<typeof ComponentTemplate>;
    document.body.appendChild(vm.$el);
    vm.show(opt);
};
