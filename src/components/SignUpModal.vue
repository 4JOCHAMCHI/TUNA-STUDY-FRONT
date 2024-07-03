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

const checkedMember = ref(false);

function closeModal() {
  name.value = '';
  phone.value = '';
  email.value = '';
  checkedMember.value = false;

  emit('close');
};

async function signUp() {
  try {
    const response = await axios.post('/api/member', {
      memberPhone: phone.value,
      memberName: name.value,
      email: email.value,
    });
    console.log('회원가입 완료!', response.data);
    alert("환영합니다, 회원가입이 완료되었습니다.");
    closeModal();
  } catch (error) {
    console.error('Error:', error);
  }
};

async function checkSignedMember(phone) {
  if (!this.phone) {
    return alert('전화번호를 입력해주세요.');
  }

  try {
    const response = await axios.get(`/api/member-check/${phone}`);

    if (response.status == 200) {
      alert("이미 해당 전화번호로 가입된 회원이 존재합니다.");
      checkedMember.value = true;
      console.log(this.checkedMember);
    }
  } catch(error) {
    if (error.response.status == 404) {
      alert("해당 전화번호로 가입된 회원이 없습니다.\n회원가입을 진행해주세요.");
      checkedMember.value = false;
      console.log("다시 바꿔 ", this.checkedMember);
    }
    else {
      console.error('Error:', error);
    }
  }
};
</script>

<template>
  <transition name="modal">
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <section class="modal-content ">
      <h1 style="display: none">회원가입 모달</h1>
      <h2>회원가입</h2>
        <div class="div-layout-modal">
          <label class="modal-label" for="phone">전화번호</label>
          <input type="text" id="phone" v-model="phone" required />
          <button class="small-button" @click="checkSignedMember(phone)">조회</button>
        </div>
        <div class="div-layout-modal">
          <label class="modal-label" for="name">이름</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="div-layout-modal">
          <label class="modal-label" for="phone">이메일</label>
          <input type="text" id="email" v-model="email" required />
        </div>
        <div class="div-layout-modal-button">
          <button class="small-button" @click=signUp() :disabled="checkedMember">가입</button>
          <button class="small-button" type="button" @click="closeModal">닫기</button>
        </div>
    </section>
  </div>
  </transition>
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

  transition: opacity 1s;

}

.modal-label {
  width: 60px;
  text-align: left;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: grey;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
}

.div-layout-modal {
  /*padding-left: 20px;*/
  /*padding-right: 20px;*/
  gap: 20px;
  width: 350px;
  height: 32px;
  margin-bottom: 8px;
  display: flex;
}

.div-layout-modal-button {
  padding-left: 20px;
  padding-right: 20px;
  width: 350px;
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 30px;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 500ms;
}

.modal-enter-from, .modal-leave-to /* .modal-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>