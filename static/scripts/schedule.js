const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

$(document).ready(function () {
  getSchedule();
  $(window).on("load", function () {});
});
function getSchedule() {
  $.ajax({
    type: "POST",
    url: "https://klaivius.pythonanywhere.com/getschedule",
    dataType: "json",
    timeout: 15000,
    beforeSend: function () {},
    success: function (response) {
      if (response.length != 0) {
        for (x = 0; x < response.length; x++) {
          if (response[x][7] != 1) {
            addScheduleSlot(response[x][2], response[x][1], response[x][4]);
          }
        }
      } else {
        $("#nosched").show();
      }

      $("#sched_hello").hide();
    },
    error: function () {
      $("#schedbox").append(`<span style="color:var(--col1);font-size:1.25rem;text-align:center;">Sorry, I forgot where I put my schedule. <br><span style="color:var(--col2);">Please try again later ><<span></span>`);
      $("#sched_hello").hide();
    },
  });
}

function addScheduleSlot(epoch, title, banner) {
  let date = new Date(epoch * 1000);
  let timeArray = get12hour(date);
  let stream_formatted_time =
    timeArray[0] + ":" + timeArray[1] + " " + timeArray[2];
  let dateDate = date.getDate();
  let dateDay = weekday[date.getDay()];
  let dateMonth = months[date.getMonth()];
  let dateYear = date.getFullYear();
  elem =
    `
            <div class="slot">
                <span class="date">` +
    dateDate +
    ` ` +
    dateMonth +
    ` ` +
    dateYear +
    `</span>
                <span class="day">` +
    dateDay +
    `</span>
                <div class="banner">
                <span class="time">` +
    stream_formatted_time +
    `</span>
                    <img src="/static/media/sched_games/` +
    banner +
    `.webp" alt="" draggable="false">
                </div>
                <span class="title">` +
    title +
    `</span>
            </div>
            `;

  schedbox = $("#schedbox");

  schedbox.append(elem);
}
