<script setup>
  import { onMounted, ref } from 'vue';
  import axios from 'axios';

  const seats = ref([]);          // entire seats
  const selectedSeat = ref(null); // selected seats by user
  const reservedSeats = ref([]);  // reserved seats

  const reservation = ref([]);    // reservation object

  const roomId = ref(0);
  const phone = ref("");
  const mySeat = ref(0);

  // 전체 방 정보 가져오기
  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/all');
      seats.value = response.data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 사용중인 방 정보 가져오기
  const findReservedSeat = async () => {
    try {
      const response = await axios.get(`/api/seat`);
      reservedSeats.value = response.data.map(seat => seat.roomId);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  // 회원 조회 후 예약된 좌석이 있는지 확인
  async function findMemberByPhone() {
    if (!this.phone) {
      return alert('전화번호를 입력해주세요.');
    }

    try {
      const response = await axios.get(`/api/member/${this.phone}`);
      let member = response.data;

      alert(`환영합니다, ${member.memberPhone.substring(7,11)}님.\n현재 예약하신 좌석은 ${member.roomId}번입니다.`);
      this.mySeat = member.roomId;

    } catch (error) {
      alert("예약 내역이 존재하지 않습니다.")
    }
  };

  // 예약 테이블 데이터 생성
  async function reserveSeat() {
    try {
      const response = await axios.get(`/api/reservation/${this.phone}/${this.roomId}`);
      const reservationId = response.data.reservationId;

      checkIn(reservationId);
    } catch (error) {
      return alert("전화번호 입력 혹은 좌석 선택이 완료되지 않았습니다.");
      console.error('Error:', error);
    }
  };

  // 예약 테이블 데이터 수정(퇴실)
  async function cancelSeat() {
    try {
      const response = await axios.get(`/api/reservation/${this.phone}/${this.mySeat}`);
      const reservationId = response.data.reservationId;

      checkOut(reservationId);
    } catch (error) {
      return alert("현재 좌석을 이용하고 있지 않습니다.");
      console.error('Error:', error);
    }
  };

  // 자리 예약
  async function checkIn(reservationId) {

    try {
      const response = await axios.get(`/api/check-in/${reservationId}`);
      reservation.value = response.data;
    } catch (error) {
      console.error('Error:', error);
    }

    alert(`${reservation.value.roomId}번 좌석 예약이 완료되었습니다.`);
    window.location.reload();
  }

  // 자리 퇴실
  async function checkOut(reservationId) {
    try {
      const response = await axios.get(`/api/check-out/${reservationId}`);
      reservation.value = response.data;
    } catch (error) {
      console.error('Error:', error);
    }

    alert(`좌석 이용을 종료합니다. 이용해주셔서 감사합니다.`);
    window.location.reload();
  }

  async function setSelectedRoomId(roomId) {
    this.roomId = roomId;
    this.selectedSeat = roomId;
  }


  onMounted(fetchRooms);
  onMounted(findReservedSeat);
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
        <input type="text" style="flex-grow: 1; margin-right: 16px;" placeholder="전화번호 입력박스" v-model="phone"/>
        <button class="small-button" @click="findMemberByPhone()">조회</button>
      </div>
    </section>

    <section class="grid-layout">
      <h1 style="display: none">좌석버튼</h1>
      <div v-for="(seat, index) in seats" :key="index" style="margin-bottom: 20px;">
        <button class="seat-button"
                :class="{
                  'selected-seat': selectedSeat === seat.roomId,
                  'my-seat': mySeat === seat.roomId
                }"
                :disabled="reservedSeats.includes(seat.roomId)"
                @click="setSelectedRoomId(seat.roomId)">{{ seat.roomName }}</button>
      </div>
    </section>

    <section class="section-layout">
      <h1 style="display: none">자리예약/퇴실</h1>
      <div class="div-layout">
        <button v-if="mySeat" class="large-button" disabled>자리예약</button>
        <button v-else class="large-button" @click="reserveSeat()">자리예약</button>

        <button class="large-button" @click="cancelSeat()">퇴실</button>
      </div>
    </section>
</template>

<style scoped>

</style>