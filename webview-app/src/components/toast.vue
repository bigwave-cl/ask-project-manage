<template>
    <teleport to="body">
        <v-snackbar v-model="toastDisplay" :timeout="timeout">
            {{ text }}
            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="hide">
                    关闭
                </v-btn>
            </template>
        </v-snackbar>
    </teleport>
</template>
<script setup lang="ts">
import { ref } from "vue";
defineOptions({
    name: "ProjectManageToast"
})
const DEFAULT_TIME = 2000;
const toastDisplay = ref(false);
const timeout = ref(DEFAULT_TIME);
const text = ref('提示内容');
let callback: Function = () => { };

const show = (opt: string | { text: string, timeout?: number, callback?: Function }) => {
    let _text = "";
    let _timeout = DEFAULT_TIME;
    if (typeof opt === 'string') {
        _text = opt
    } else {
        _text = opt.text;
        _timeout = opt.timeout === undefined ? DEFAULT_TIME : opt.timeout;
        if (opt.callback) {
            callback = opt.callback
        }
    }
    text.value = _text;
    timeout.value = _timeout;
    toastDisplay.value = true;
}
const hide = () => {
    toastDisplay.value = false;
    callback && callback();
    callback = () => { };
    timeout.value = DEFAULT_TIME;
    text.value = "";
}
defineExpose({
    show,
    hide
})
</script>