<template>
  <b-container>
    <b-row>
      <b-col cols="12" md="9" order-md="2">
        <b-row
          class="align-items-center justify-content-center text-center h-100"
        >
          <b-col class="text-center">
            <h1 class="counter">{{ timeRemaining }}</h1>
            <b-badge variant="info" style="font-size: 1em"
              >Tempo para o fim do ciclo de <b>{{ currentCycleName }}</b>
            </b-badge>
            <h1 class="mt-5">{{ elapsedTime }}</h1>
            <b-badge variant="info">Tempo decorrido até agora </b-badge>
          </b-col>
        </b-row>
      </b-col>
      <b-col
        cols="12"
        order-md="1"
        md="3"
        class="shadow-sm border-right border-left border-bottom rounded pt-2 pb-3 overflow-none mt-5 mt-md-0"
      >
        <h5>Configurações</h5>
        <b-row>
          <b-col cols="6" md="12">
            <y-b-form-input
              title="Tempo de foco:"
              v-model="focusTime"
              v-mask="'##h##'"
              readonly
            />
            <a href="#" @click="focusTime = '00h30'">30m</a>
            <a href="#" class="mx-3" @click="focusTime = '01h00'">1h</a>
            <a href="#" @click="focusTime = '01h45'">1h45</a></b-col
          >
          <b-col cols="6" md="12">
            <y-b-form-input
              title="Tempo de descanso:"
              v-model="restTime"
              v-mask="'##h##'"
              readonly
            />
            <a href="#" @click="restTime = '00h05'">5m</a>
            <a href="#" class="mx-3" @click="restTime = '00h08'">8m</a>
            <a href="#" @click="restTime = '00h15'">15m</a></b-col
          >
          <b-col cols="6" md="12">
            <y-b-form-input
              title="Inicia às:"
              v-model="startAtTime"
              v-mask="['##h##']"
              :disabled="!onlyInsideInterval"
          /></b-col>
          <b-col cols="6" md="12">
            <y-b-form-input
              title="Encerra às:"
              v-model="stopsAtTime"
              v-mask="['##h##']"
              :disabled="!onlyInsideInterval"
          /></b-col>
          <b-col>
            <b-checkbox
              switch
              v-model="onlyInsideInterval"
              class="pointer text-left"
              >Apenas no intervalo programado</b-checkbox
            >
            <b-checkbox switch v-model="sound.play" class="pointer text-left"
              >Notificação sonora</b-checkbox
            >
            <!-- <b-checkbox
              switch
              v-model="sharpTime"
              v-b-tooltip.right="
                'Considerar a diferença entre o horário real de início e horário de início programado'
              "
              class="pointer text-left"
              >Considerar diferença de horário de início</b-checkbox
            >-->
          </b-col>
          <b-col cols="6" md="12">
            <b-button
              class="mt-3"
              v-if="status < 2"
              :variant="status === 0 ? 'success' : 'danger'"
              @click="checkBehavior"
              >{{ currentButtonMessage }}</b-button
            >
            <b-button
              class="ml-2 mt-3"
              v-if="status >= 1"
              :variant="status === 1 ? 'secondary' : 'info'"
              @click="checkBehavior(2)"
              >{{ currentPauseButtonMessage }}</b-button
            >
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-modal
      id="waiting-time-modal"
      ok-disabled
      cancel-disabled
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
      hide-footer
    >
      <h1 class="counter">{{ timeToStart }}</h1>
      <b-badge variant="info" style="font-size: 1em"
        >Tempo até o início
      </b-badge>
      <br />
      <div class="d-flex w-100 mt-5 justify-content-end">
        <b-button variant="danger" @click="stopWaitingForStart">
          Cancelar espera
        </b-button>
      </div>
    </b-modal>
  </b-container>
</template>
<script>
import Bip from "../../assets/sound/bip.wav";
import RestStart from "../../assets/sound/focus-end.wav";
import FocusStart from "../../assets/sound/rest-interval-end.wav";
import moment from "moment";
import { PomodoroMixin } from "./mixins/pomodoro-mixin";
import YBFormInput from "../YBFormInput/YbFormInput";
export default {
  name: "Pomodoro",
  mixins: [PomodoroMixin],
  components: {
    YBFormInput,
  },
  data() {
    return {
      // Time to Start the cycle
      startAtTime: "08h00",
      // Time to stop
      stopsAtTime: "18h00",
      // time in seconds
      focusTime: "01h45",
      // Time to rest
      restTime: "00h15",
      // Cycle status 0 stopped, 1 running, 2 paused, 3 waiting for interval.
      status: 0,
      // Works only in the interval startTime < now < stopTime
      onlyInsideInterval: false,
      // Remove the difference between actual start time and startAtTime
      sharpTime: true,
      // Cycle history
      cycleCount: 0,
      // Amount of times the cycle was paused
      pauses: 0,
      // Current type of cicle 1 focus and 2 to rest, 0 to stopped.
      currentCycle: 0,
      // Actual start time
      cycleStartedAt: moment(),
      // Actual stop time
      cycleStoppedAt: "00:00:00",
      // Paused at
      cyclePausedAt: "00:00:00",
      // Resumed at
      cycleResumedAt: "00:00:00",
      // Time left to leave
      timeRemaining: "00:00:00",
      elapsedTime: "00:00:00",
      // Time cycle should end
      shouldEndAt: moment(),
      nextStart: moment(),
      d: moment,
      timeToStart: "00:00:00",
      sound: {
        play: true,
        bip: new Audio(Bip),
        restStart: new Audio(RestStart),
        focusStart: new Audio(FocusStart),
      },
      showSettings: true,
      toStartInterval: null,
    };
  },
  methods: {
    
  },
  watch: {
    timeRemaining(n) {
      if (n.match("00:00:00") && this.status === 1) {
        this.changeCycle();
      }
    },
  },
  computed: {
    currentStatus() {
      return this.status === 0
        ? "Parado"
        : this.status === 1
        ? "Em andamento"
        : this.status === 2
        ? "Em pausa"
        : " - ";
    },
    currentCycleName() {
      return this.currentCycle === 1 ? "Foco!" : "Descanso";
    },
    currentButtonMessage() {
      return this.status === 0 ? "Iniciar" : "Encerrar";
    },
    currentPauseButtonMessage() {
      return this.status === 1 ? "Pausar" : "Retomar";
    },
  },
  mounted() {
    this.$nextTick(() => {});
  },
};
</script>
<style scoped>
.pointer {
  cursor: pointer !important;
}
.counter {
  font-size: 7em;
}
</style>