<script setup>
  import { onMounted, ref } from 'vue';
  import axios from 'axios';

  const seats = ref([]);
  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/all');
      seats.value = response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // call fetchRooms when component is mounted
  onMounted(fetchRooms);

  function checkIn() {
    alert('좌석 예약이 완료되었습니다.');
  }
  function checkOut() {
    alert('퇴실 처리 되었습니다.');
  }
</script>

<template>
    <section class="section-layout">
    <h1 style="display: none">스터디카페명</h1>
      <div>
        <h1>TUNA STUDY CAFE</h1>
      </div>
    </section>
    <section class="section-layout">
      <h1 style="display: none">전화번호 입력폼</h1>
      <div class="div-layout">
        <input type="text" style="flex-grow: 1" placeholder="전화번호 입력박스"/>
        <button class="small-button">조회</button>
      </div>
    </section>
    <section class="grid-layout">
      <h1 style="display: none">좌석버튼</h1>
      <div v-for="(seat, index) in seats" :key="index" style="margin-bottom: 20px;">
        <button class="seat-button">{{ seat.roomName }}</button>
      </div>
    </section>
    <section class="section-layout">
      <h1 style="display: none">자리예약/퇴실</h1>
      <div class="div-layout">
        <button class="large-button" @click="checkIn()">자리예약</button>
        <button class="large-button" @click="checkOut()">퇴실</button>
      </div>
    </section>
</template>

<style scoped>

</style>