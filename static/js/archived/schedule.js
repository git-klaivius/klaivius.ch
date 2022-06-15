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

function getSchedule(month) {
  $.ajax({
    type: "POST",
    url: "http://localhost:5000/getschedule",
    dataType: "json",
    data: { month: month },
    beforeSend: function () {
      $("#errormsg").hide();
      $("#nostream").hide();
      $("#schedule-list-ctn").html("");
      $("#archived-sched-ctn").hide();
      $("#archived-sched-content ul").html("");
      loader("#sch-loader","show");
    },
    success: function (response) {
      loader("#sch-loader","hide");
      $(".month_button_active").removeClass("month_button_active");
      $(".month_button")
        .eq(month - 1)
        .addClass("month_button_active");

      if (response == "") {
        $("#nostream").show();
      } else {
        let now = new Date();
        savedDate = "";

        for (n = 0; n < response.length; n++) {
          let date = new Date(response[n][2] * 1000);
          let timeArray = get12hour(date);
          let stream_platform = response[n][6];

          if(stream_platform == 'twitch'){
            stream_link = "https://www.twitch.tv/klaivius";
          } else if(stream_platform =='youtube'){
            stream_link = "https://bit.ly/klvs-yt";
          }
          let stream_formatted_time =
            timeArray[0] + ":" + timeArray[1] + " " + timeArray[2];
          let stream_title = response[n][1];
          let stream_day = weekday[date.getDay()];
          let stream_date_day = date.getDate();
          let stream_date_month = months[date.getMonth()];
          let stream_date_year = date.getFullYear();

          if (response[n][7] == 1) {
            stream_canceled =
              '<div class="cancelled">//// Cancelled ////</div>';
          } else {
            stream_canceled = "";
          }

          if (date > now - 3600000) {
            if (date.getDate() != savedDate) {
              $("#schedule-list-ctn").html(
                $("#schedule-list-ctn").html() +
                  `

                <div class="sched-date-ctn mt-2">
                  <div class="sched-date-bg1"></div>
                  <div class="sched-date">
                    <div class="day">` +
                  stream_day +
                  `</div>
                    <div class="date">` +
                  stream_date_day +
                  ` ` +
                  stream_date_month +
                  ` ` +
                  stream_date_year +
                  `</div>
                  </div>
                  <div class="sched-date-bg2"></div>
                </div>`
              );
            }

            $("#schedule-list-ctn").html(
              $("#schedule-list-ctn").html() +
                `

                <a class="streamlink" target="_blank" href="`+stream_link+`">
              <div class="stream-ctn mt-1">` +
                stream_canceled +
                `
                <div class="stream-platform">
                  <svg>
                    <use href="#` +
                stream_platform +
                `_color"></use>
                  </svg>
                </div>
                <div class="stream-time">` +
                stream_formatted_time +
                `</div>
                <div class="stream-title">` +
                stream_title +
                `</div>
              </div>
              </a>`
            );

            savedDate = stream_date_day;
          } else {
            $("#archived-sched-ctn").show();

            $("#archived-sched-content ul").html(
              $("#archived-sched-content ul").html() +
                `

              <li>
                <svg>
                  <use href="#` +
                stream_platform +
                `_color"></use>
                </svg>
                [` +
                stream_date_day +
                ` ` +
                stream_date_month +
                ` ` +
                stream_date_year +
                `, ` +
                stream_day +
                `, ` +
                stream_formatted_time +
                `] ` +
                stream_title +
                `
              </li>`
            );
          }
        }

        list = $("#archived-sched-content ul");
        Array.from(list.children())
          .reverse()
          .forEach((element) => list.append(element));
      }
    },
    error: function () {
      loader("#sch-loader","hide");
      $("#errormsg").show();
    },
  });
}

//Copyright2022@klaivius
