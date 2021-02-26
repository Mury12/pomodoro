import moment from "moment";

export const PomodoroMixin = {
    data() {
        return {
            iv: null,
        }
    },
    methods: {
        start() {
            this.pauses = 0;
            this.status = 1;
            this.cycleCount = 0;
            this.elapsedTime = '00:00:00';
            this.cycleStartedAt = moment();
            this.changeCycle();
            this.updateTime();
        },
        stop() {
            this.status = 0;
            this.currentCycle = 0;
            this.timeRemaining = this.elapsedTime = "00:00:00";
            this.cycleStoppedAt = moment();
            this.stopUpdatingTime();
        },
        pause() {
            this.pauses++;
            this.status = 2;
            this.cyclePausedAt = moment();
            this.stopUpdatingTime();
        },
        resume() {
            this.status = 1;
            this.shouldEndAt.add(moment().diff(this.cyclePausedAt), 'millisecond');
            this.updateTime();
            this.cycleResumedAt = moment();
        },
        updateTime() {
            this.stopUpdatingTime();
            this.iv = setInterval(() => {

                if (this.onlyInsideInterval) {
                    const t = this.stopsAtTime.replace('h', ':');
                    if (t === moment().format('HH:mm')) {
                        this.stop();
                        this.checkBehavior();
                    }
                }

                this.elapsedTime = this.dateDiff(this.cycleStartedAt, moment());
                this.timeRemaining = this.dateDiff(this.shouldEndAt, moment())
                if (this.timeRemaining === '00:00:03' ||
                    this.timeRemaining === '00:00:02' ||
                    this.timeRemaining === '00:00:01'
                ) {
                    this.play('bip');
                }
            }, 990)
        },
        stopUpdatingTime() {
            if (this.iv) {
                clearInterval(this.iv)
            }
        },
        changeCycle() {
            if (this.currentCycle === 1) {
                this.currentCycle = 2;
                this.setRemainingTime('rest');
                this.play('restStart');
            } else {
                this.cycleCount++;
                this.currentCycle = 1;
                this.setRemainingTime('focus');
                this.play('focusStart');
            }
        },
        setRemainingTime(type) {
            let t = this[type + 'Time'].split('h');
            const endTime = moment().add(t[0], 'hour').add(t[1], 'minutes');
            this.shouldEndAt = endTime;
        },
        dateDiff(start, end) {
            const date1 = new Date(moment(start).format("YYYY/MM/DD HH:mm:ss"));
            let date2 = new Date(moment().subtract(3, 'hours'));
            if (end)
                date2 = new Date(moment(end).format("YYYY/MM/DD HH:mm:ss"));

            let diffTime = Math.abs(date2 - date1);

            let seconds = Math.floor((diffTime / 1000) % 60)
            let minutes = Math.floor((diffTime / (1000 * 60)) % 60)
            let hours = Math.floor((diffTime / (1000 * 60 * 60)))

            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            return hours + ":" + minutes + ":" + seconds;
        },
        isInSetInterval() {
            const start = this.startAtTime.split('h');
            const end = this.stopsAtTime.split('h');
            const now = moment().format("HH:mm").split(':');
            /**
             * Checks if hour and minute is inside the interval 
             * when the end time minus the current time is
             *  greater than the current time
             */
            if (Number(now.join('')) >= Number(end.join(''))) {
                return false;
            }
            else if (
                Number(now[0]) >= Number(start[0]) && Number(now[0]) < Number(end[0])
                && Number(now[1] >= Number(start[1]))
            ) {
                return true;
            }
            else if (
                Number(now[0]) === Number(start[0]) && Number(now[1]) >= Number(start[1])) {
                return true;
            }
            else if (
                Number(now[0] === Number(end[0]) && (Number(end[1] - Number(now[1]) >= Number(end[1]) / 2)))
            ) {
                return true;
            }
            return false;
        },
        checkBehavior: function (s) {
            if (s === 2) {
                if (this.status === 2) {
                    this.resume();
                } else {
                    this.pause();
                }
            } else {
                switch (this.status) {
                    case 0:
                        if (this.onlyInsideInterval && !this.isInSetInterval()) {
                            this.getNextStartDate();
                            clearInterval(this.toStartInterval);
                            this.$bvModal.show("waiting-time-modal");
                            this.toStartInterval = setInterval(() => {
                                this.timeToStart = this.dateDiff(this.nextStart, moment());
                                if (
                                    moment().format("hh:mm") ===
                                    this.startAtTime.replace("h", ":")
                                ) {
                                    clearInterval(this.toStartInterval);
                                    this.$bvModal.hide('waiting-time-modal')
                                    this.start();
                                }
                            }, 990);
                        } else {
                            this.$bvModal.hide("waiting-time-modal");
                            this.start();
                        }
                        break;
                    case 1:
                        this.stop();
                }
            }
        },
        stopWaitingForStart: function () {
            clearInterval(this.toStartInterval);
            this.$bvModal.hide("waiting-time-modal");
        },
        getNextStartDate: function () {
            let isSetMinutes = false;
            const timeExpired = Number(moment().format('HHmm')) >= Number(this.stopsAtTime.replace('h', ''));
            let now = moment().format("HH");
            let start = this.startAtTime.split("h")[0]

            if (now === this.startAtTime.split("h")[0]) {
                isSetMinutes = true;
                now = moment().format('mm')
                start = this.startAtTime.split("h")[1]
            }

            if (
                Number(now) >= Number(start)
            ) {
                this.nextStart = moment(
                    moment().add(isSetMinutes && !timeExpired ? 0 : 1, "day").format("YYYY-MM-DD") +
                    " " +
                    `${this.startAtTime.replace('h', ':')}`
                );
            } else {
                this.nextStart = moment(
                    moment().format("YYYY-MM-DD") +
                    " " +
                    `${this.startAtTime.replace('h', ':')}`
                );
            }
        },
        play(soundName) {
            if (this.sound.play
                && this.sound[soundName]
                && typeof this.sound[soundName].play === 'function')
                this.sound[soundName].play();
        }
    }
}