<template>
    <v-dialog v-model="editForm.model" max-width="600">
        <v-card :title="editForm.title">
            <v-card-text>
                <v-row dense>
                    <v-col cols="24">
                        <v-text-field :label="editForm.nameLabel" required v-model="editForm.name"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="关闭" variant="plain" @click="closeEdit"></v-btn>

                <v-btn color="primary" text="确认" variant="tonal" @click="sureEdit"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { type FormDataModel } from "./types"
defineOptions({
    name: "ProjectManageInfoDialog"
})
const editForm = ref({
    model: false,
    title: '',
    nameLabel: '',
    name: '',
    groupKey: '',
    listKey: '',
    subInfo: '',
})
const emits = defineEmits<{
    'sure': [form: typeof editForm.value],
    'close': [form: typeof editForm.value]
}>()

const resetEditForm = () => {
    editForm.value.model = false;
    editForm.value.title = '';
    editForm.value.nameLabel = '';
    editForm.value.name = '';
    editForm.value.groupKey = '';
    editForm.value.listKey = '';
    editForm.value.subInfo = '';
}

const openEdit = (formData: FormDataModel) => {
    resetEditForm();
    editForm.value.title = formData.title || '';
    editForm.value.nameLabel = formData.nameLabel || '';
    editForm.value.name = formData.name || '';
    editForm.value.groupKey = formData.groupKey || '';
    editForm.value.listKey = formData.listKey || '';
    editForm.value.subInfo = formData.subInfo || '';
    editForm.value.model = true;
}
const closeEdit = ()=> {
    emits("close", editForm.value)
    resetEditForm();
}
const sureEdit = ()=> {
    emits("sure", editForm.value)
}
defineExpose({
    openEdit,
    resetEditForm
})
</script>