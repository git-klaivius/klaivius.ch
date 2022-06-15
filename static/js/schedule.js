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

function initSchedule(date) {
  dateCursor = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // dateCursor = new Date("2022", "5" , "16");

  dateOffset = 86400000;

  for (x = 0; x < 7; x++) {
    dateEpoch = dateCursor.getTime() + dateOffset;
    dateDate = dateCursor.getDate();
    dateDay = weekday[dateCursor.getDay()];
    dateMonth = months[dateCursor.getMonth()];

    $("#sched").append(
      `
    <div data-epochStart="` +
        dateEpoch +
        `" class="le-schedule" id="sched` +
        x +
        `">
    <span class="s-time">-</span>
    <span class="s-date">
        <span style="font-size:var(--fs2);color:var(--col1);" class="s-s-date">` +
        dateDate +
        ` ` +
        dateMonth +
        `</span>
        <span style="font-size:var(--fsmin5);" class="s-s-day">` +
        dateDay +
        `</span>
    </span>
    <span class="s-title nostream">
   
    </span>
    <span class="s-title-pc"></span>
    </div>
    `
    );
    dateCursor = new Date(dateEpoch);
  }

  getSchedule(date.getMonth() + 1);
}

function getSchedule(month) {
  $.ajax({
    type: "POST",
    url: "http://klaivius.pythonanywhere.com/getschedule",
    dataType: "json",
    data: { month: month },
    beforeSend: function () {},
    success: function (response) {
      console.log(response);
      //response to array

      for (n = 0; n < 7; n++) {
        emptySchedEpoch_start = $("#sched" + n).data("epochstart");
        emptySchedEpoch_end = emptySchedEpoch_start + 86400000;

        for (x = 0; x < response.length; x++) {
          if (checkRange(emptySchedEpoch_start, response[x][2] * 1000)) {
            let date = new Date(response[x][2] * 1000);
            let timeArray = get12hour(date);
            let stream_formatted_time =
              timeArray[0] + ":" + timeArray[1] + " " + timeArray[2];
            let stream_title = response[x][1];
            let stream_banner = response[x][4];

            $("#sched" + n)
              .children(".s-time")
              .html(stream_formatted_time);
            $("#sched" + n)
              .children(".s-title")
              .removeClass("nostream");
            $("#sched" + n)
              .children(".s-title")
              .html(
                `<span class="s-title-mb">` +
                  stream_title +
                  `</span><span class="s-time-pc">` +
                  stream_formatted_time +
                  `</span>`
              );
            $("#sched" + n)
              .children(".s-title-pc")
              .html(stream_title);
          }
        }
      }
    },
    error: function () {
      console.log("bork");
    },
  });
}

function checkRange(epoch_start, epoch_target) {
  epoch_end = epoch_start + 86400000;
  if (epoch_target >= epoch_start && epoch_target < epoch_end) {
    return true;
  } else {
    return false;
  }
}

var SMode_state = false;
function toggleSMode() {
  if (SMode_state) {
    console.log("turned off");

    SMode_state = false;
  } else {
    console.log("turned on");
    
    $("#sched-second-icon").attr("style", "background-color:var(--col1);");
    $("#sched-second-link").attr("style", "color:var(--col1);");
    $("#sched-second-link").html("klaivius.ch");
    $("#second-icon").attr("src", "/static/img/url.png");
    $("#not-a-link").html(`
    <span style="font-size:1.5rem;font-family:var(--f-smooch);">
    All time shown are in <span style="font-size:1.5rem;font-family:var(--f-smooch);color:var(--col1);">UTC+8</span>.
    </span><br>Visit <span style="color:var(--col1);font-family:var(--f-smooch);">klaivius.ch/schedule</span> to view the schedule in your local time.`);
    

    SMode_state = true;
  }
}

function onKonamiCode(cb) {
  var input = '';
  var key = '38384040373937396665';
  document.addEventListener('keydown', function (e) {
    input += ("" + e.keyCode);
    if (input === key) {
      return cb();
    }
    if (!key.indexOf(input)) return;
    input = ("" + e.keyCode);
  });
}

onKonamiCode(function () {toggleSMode();})
//Copyright2022@klaivius
