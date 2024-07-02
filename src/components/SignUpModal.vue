<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps({
  isVisible: Boolean
});

const emit = defineEmits(['close']);

const name = ref('');
const phone = ref('');
const email = ref('');

function closeModal() {
  emit('close');
};

async function submitForm() {
  try {
    const response = await axios.post('/api/member', {
      name: name.value,
      phone: phone.value,
      email: email.value,
    });
    console.log('회원가입 완료!', response.data);
    alert("환영합니다, 회원가입이 완료되었습니다.");
    closeModal();
  } catch (error) {
    console.error('Error:', error);
  }
};
</script>

<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <section class="modal-content ">
      <h1 style="display: none">회원가입 모달</h1>
      <h2>회원가입</h2>
        <div class="div-layout-modal">
          <label for="name">이름:</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="div-layout-modal">
          <label for="phone">전화번호:</label>
          <input type="text" id="phone" v-model="phone" required />
        </div>
        <div class="div-layout-modal">
          <label for="phone">이메일:</label>
          <input type="text" id="email" v-model="email" required />
        </div>
        <div class="div-layout-modal">
          <button @click=submitForm()>가입</button>
          <button type="button" @click="closeModal">닫기</button>
        </div>
    </section>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: grey;
  padding: 20px;
  border-radius: 5px;
  max-width: 600px;
  width: 100%;
}

.div-layout-modal {
  padding-left: 20px;
  padding-right: 20px;
  width: 240px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}
</style>