<template>
    <div class="ask-project-manage-wrap">
        <div class=""></div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>
<style scoped>
.read-the-docs {
    color: #888;
}

.logo {
    width: 200px;
    height: 100px;
    object-fit: cover;
}
</style>
