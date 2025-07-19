import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;

const startBtn = document.querySelector("[data-start]");

const dateInput = document.querySelector("#datetime-picker");

const days = document.querySelector("[data-days]");
const hours = document.querySelector("[data-hours]");
const minutes = document.querySelector("[data-minutes]");
const seconds = document.querySelector("[data-seconds]");


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  dateFormat: "Y-m-d H:i",
  onClose(selectedDates) {
    const now = new Date();
    const selected = selectedDates[0];

    if (selected <= now) {
      iziToast.warning({
        message: "Please choose a future date and time.",
        position: "topRight"
      });
      startBtn.disabled = true;
      userSelectedDate = null;
    } else {
      startBtn.disabled = false;
      userSelectedDate = selected;
    }
  }
};

flatpickr("#datetime-picker", options);

function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function resetTimerUI() {
  days.textContent = "00";
  hours.textContent = "00";
  minutes.textContent = "00";
  seconds.textContent = "00";
}

resetTimerUI();

let countdownInterval;
function startCountdown(targetDate) {
  countdownInterval = setInterval(() => {
    const now = new Date();
    const remainingTime = targetDate - now;

    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      resetTimerUI();
      iziToast.success({
        message: "Countdown finished!",
        position: "topRight"
      });
      return;
    }

    const { days: d, hours: h, minutes: m, seconds: s } = convertMs(remainingTime);

    days.textContent = addLeadingZero(d);
    hours.textContent = addLeadingZero(h);
    minutes.textContent = addLeadingZero(m);
    seconds.textContent = addLeadingZero(s);
  }, 1000);
}

startBtn.addEventListener("click", () => {
  if (!userSelectedDate) return;
  startBtn.disabled = true;
  startCountdown(userSelectedDate);
});