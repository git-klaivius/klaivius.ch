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

function initSchedule(override = false) {
  $("#sched").html("");

  let date = new Date();
  if (override == false) {
    dateCursor = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    console.log(date.getDate());
  } else {
    dateCursor = new Date(override[0], parseInt(override[1]), override[2]);
  }

  dateOffset = 86400000;

  for (x = 0; x < 7; x++) {
    dateEpoch = dateCursor.getTime()
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
    dateCursor = new Date(dateEpoch+dateOffset);
  }

  getSchedule(date.getMonth() + 1);
}

function getSchedule(month) {
  $.ajax({
    type: "POST",
    url: "https://klaivius.pythonanywhere.com/getschedule",
    dataType: "json",
    data: { month: month },
    beforeSend: function () {},
    success: function (response) {
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
                `<img draggable="false" src="/static/img/sched_games/` +
                  stream_banner +
                  `.png"/>
                <span class="s-title-mb">` +
                  stream_title +
                  `</span><span class="s-time-pc">` +
                  stream_formatted_time +
                  `</span>`
              );
            $("#sched" + n)
              .children(".s-title-pc")
              .html(stream_title);

              response.splice(x,1);
              // console.log(response);
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
  // console.log("start:" + epoch_start);
  // console.log("target:" + epoch_target);
  // console.log("end:" + epoch_end);
  if (epoch_target >= epoch_start && epoch_target < epoch_end) {
    return true;
  } else {
    return false;
  }
}

var schedview_mode = "relative"
function toggleSchedView(){
  if(schedview_mode=="relative"){//change to week view
    var today = new Date();
    nextMonday = addDays(today,Math.abs(today.getDay()-8));
    initSchedule([nextMonday.getFullYear(), nextMonday.getMonth(), nextMonday.getDate()]);

    $("#toggleView").html("Displaying week schedule.<br>Click me to change to relative schedule.")
    schedview_mode = "week";
  }else{
    initSchedule();
    $("#toggleView").html("Displaying relative schedule.<br>Click me to change to week schedule.")
    schedview_mode = "relative";
  }
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

var SMode_state = false;
function toggleSMode() {
  if (SMode_state) {
    location.reload();
    SMode_state = false;
  } else {
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
  var input = "";
  var key = "38384040373937396665";
  document.addEventListener("keydown", function (e) {
    input += "" + e.keyCode;
    if (input === key) {
      return cb();
    }
    if (!key.indexOf(input)) return;
    input = "" + e.keyCode;
  });
}

onKonamiCode(function () {
  toggleSMode();
  $("#toggleView").toggle();
});

//Copyright2022@klaivius
