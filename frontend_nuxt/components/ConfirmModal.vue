<template>
  <Modal :isOpen="isOpen" :title="title" @close="cancel">
    <div style="display:flex; flex-direction:column; gap:1.5rem;">
      <div style="color:var(--text-secondary); line-height:1.5; display:flex; align-items:flex-start; gap:0.75rem;">
        <AlertTriangleIcon v-if="isDanger" :size="24" style="color:var(--danger-color); flex-shrink:0;" />
        <InfoIcon v-else :size="24" style="color:var(--primary-color); flex-shrink:0;" />
        <div style="font-size: 1rem;">{{ message }}</div>
      </div>
      
      <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
        <button type="button" class="btn btn-secondary" @click="cancel">{{ cancelText }}</button>
        <button type="button" class="btn" :class="isDanger ? 'btn-danger' : 'btn-primary'" @click="confirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { AlertTriangle as AlertTriangleIcon, Info as InfoIcon } from 'lucide-vue-next'
import Modal from './Modal.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: 'Confirmation' },
  message: { type: String, required: true },
  confirmText: { type: String, default: 'Confirmer' },
  cancelText: { type: String, default: 'Annuler' },
  isDanger: { type: Boolean, default: true }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
</script>

<style scoped>
.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
}
.btn-danger:hover {
  background: #b91c1c;
}
</style>
