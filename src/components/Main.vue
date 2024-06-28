<script setup>
  import { onMounted, ref } from 'vue';
  import axios from 'axios';

  const seats = ref([]);


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
    <section class="section-layout" style="justify-content: space-between">
      <h1 style="display: none">좌석버튼</h1>
      <div>
        <div class="div-layout" style="margin-bottom: 20px;">
          <button class="seat-button">01</button>
          <button class="seat-button">02</button>
          <button class="seat-button selected-seat">03</button>
          <button class="seat-button unable-seat">04</button>
        </div>
        <div class="div-layout">
          <button class="seat-button unable-seat">05</button>
          <button class="seat-button">06</button>
          <button class="seat-button">07</button>
          <button class="seat-button">08</button>
        </div>
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