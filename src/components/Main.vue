<script setup>
  import { onMounted, ref } from 'vue';
  import axios from 'axios';
  import dayjs from 'dayjs';
  import duration from "dayjs/plugin/duration"; // https://day.js.org/docs/en/plugin/duration
  import SignUpModal from './SignUpModal.vue';

  dayjs.extend(duration);

  const seats = ref([]);          // entire seats
  const selectedSeat = ref(null); // selected seats by user

  const reservation = ref([]);    // reservation object for check-in/out
  const reservationList = ref([]);

  const roomId = ref(0);
  const phone = ref("");
  const mySeat = ref(0);

  const clock = ref(dayjs());

  const isModalVisible = ref(false);

  // 모달 열기 함수
  function openModal() {
    isModalVisible.value = true;
  };

  // 전체 방 정보 가져오기
  async function fetchRooms() {
    try {
      const response = await axios.get('/api/all');
      seats.value = response.data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 사용중인 방 정보 가져오기
  async function findReservedSeat() {
    try {
      const response = await axios.get(`/api/seat`);
      reservationList.value = response.data;
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
      alert("현재 예약 내역이 존재하지 않습니다.")
    }
  };

  // 예약 테이블 데이터 생성
  async function reserveSeat() {
    try {
      const response = await axios.get(`/api/reservation/${this.phone}/${this.roomId}`);
      const reservationId = response.data.reservationId;

      checkIn(reservationId);
    } catch (error) {
      if (error.response) {
        // 서버에서 응답한 오류
        if (error.response.status === 404 && error.response.data.message === "존재하지 않는 회원입니다.") {
          alert("존재하지 않는 회원입니다. 회원가입을 진행해주세요.");
        } else if (error.response.status === 400 && error.response.data.message === "유효하지 않은 좌석입니다.") {
          alert("유효하지 않은 좌석입니다.");
        } else {
          alert("전화번호 입력 혹은 좌석 선택이 완료되지 않았습니다.");
        }
      } else {
        // 서버로부터의 응답이 없는 경우
        alert("서버와의 통신에 문제가 발생했습니다.");
      }
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

    alert(`${reservation.value.roomId}번 좌석 예약이 완료되었습니다.\n좌석 이용 시간은 2시간입니다.`);
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

  function setSelectedRoomId(roomId) {
    this.roomId = roomId;
    this.selectedSeat = roomId;
  }

  function getRemainingTime(roomId) {
    let r = this.reservationList.find(r => r.roomId === roomId);

    if (r == undefined)
      return "";

    let now = dayjs();
    let endDate = dayjs(r.endDate);
    let leftTime = endDate.diff(now, 'seconds');

    if (leftTime <= 0) {
      findReservedSeat();
    }

    // console.log(dayjs("2024-07-03T00:20:00").format('{YYYY} MM-DDTHH:mm:ss'));
    return dayjs.duration(leftTime, 'seconds').format("HH:mm:ss");
  }

  onMounted(fetchRooms);
  onMounted(findReservedSeat);
  onMounted(() => {
    // https://codesandbox.io/s/countdown-timer-in-vue-3-lnxsj2?file=/src/components/ProgressBar.vue:341-361
    setInterval(() => clock.value = dayjs(), 1000);
  })
</script>

<template>
  <section class="section-layout">
  <h1 style="display: none">스터디카페명</h1>
    <div>
      <h1>TUNA STUDY CAFE</h1>
      <div style="font-weight: bold">TUNA STUDY CAFE는 예약 1회당 2시간 이용할 수 있습니다.</div>
      <div>{{clock.format('YYYY-MM-DD HH:mm:ss')}}</div>
    </div>
  </section>

  <section class="section-layout">
    <h1 style="display: none">전화번호 입력폼</h1>
    <div class="div-layout">
      <input type="text" style="flex-grow: 1; margin-right: 16px;" placeholder="전화번호 입력박스" v-model="phone"/>
      <button class="small-button" @click="findMemberByPhone()">좌석조회</button>
      <button class="small-button" @click="openModal">회원가입</button>
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
              :disabled="reservationList.find(r => r.roomId == seat.roomId)"
              @click="setSelectedRoomId(seat.roomId)">
        <div>{{ seat.roomName }}</div>
        <div>{{ getRemainingTime(seat.roomId) }}</div>
      </button>
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

  <SignUpModal :isVisible="isModalVisible" @close="isModalVisible = false"/>
</template>

<style scoped>

</style>