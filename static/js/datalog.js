nextCriteriaCount = "none";
function fetchDatalogData() {
  $.ajax({
    type: "POST",
    url: "http://klaivius.pythonanywhere.com/datalog",
    contentType: "application/json;charset=UTF-8",
    dataType: "json",
    beforeSend: function () {
      
    },
    success: function (response) {
      loader("#console-loader", "hide");
      $("#data-recovery-success").show();

      console.log(response);
      $("#record-count").html(
        response.datalogs.length +
          " record(s) found. " +
          response.unlocked_records +
          " record(s) successfully recovered. Select record to view."
      );

      populateRecords(response);

      $("#soc-count-twt").html(response.followers.followerCount.twitter);
      $("#soc-count-tw").html(response.followers.followerCount.twitch);
      $("#soc-count-yt").html(response.followers.followerCount.youtube);

      if (nextCriteriaCount != "none") {
        $("#soc-console").show();

        averageFollower = response.followers.followerCount.average;
        percentComplete = parseFloat(((averageFollower / nextCriteriaCount) * 100).toFixed(2));

        barCount = Math.floor(percentComplete / 5);
        barCount_hidden = 20 - barCount;
        bar = "&#x25A0;";
        visible_bar = bar.repeat(barCount);
        hidden_bar = bar.repeat(barCount_hidden);
        current_progbar = visible_bar + "<h-idden>" + hidden_bar + "</h-idden>";

        $("#soc-progbar").html(
          `<span id="progbar_full">
          &#x3010;<span id="prog">` +
            current_progbar +
            `</span>&#x3011;
            <span style="font-size: var(--fsmin4)">` +
            averageFollower +
            `/` +
            nextCriteriaCount +
            ` (` +
            percentComplete +
            `%)</span>
          </span>
          <br />
          <span id="nextupdate"></span>`
        );

        $("#soc-progbar").show();
      } else {
        $("#next-target").html(
          `NOTICE // NO OTHER RECORDS FOUND AT THIS TIME.`
        );
      }

      if (response.followers.nextUpdate < 1) {
        $("#nextupdate").html("NEXT UPDATE IN LESS THAN A MINUTE.");
      } else {
        $("#nextupdate").html(
          "NEXT UPDATE IN " + response.followers.nextUpdate + " MINUTE(S)."
        );
      }
    },
    error: function () {
      loader("#console-loader", "hide");
      $("#data-recovery-failed").show();
    },
  });
}

function populateRecords(response) {
  for (n = 0; n < response.datalogs.length; n++) {
    if (response.datalogs[n].datalog_unlock == 1) {
      $("#record-list").append(
        `
      <li>
        <button onclick="viewRecord(` +
          response.datalogs[n].datalog_id +
          `);">Record #` +
          response.datalogs[n].datalog_no +
          `: ` +
          response.datalogs[n].datalog_title +
          `</button>
      </li>
      <div class="record-ctn" id="record-` +
          response.datalogs[n].datalog_id +
          `-ctn">
          <h4 style="color:var(--col1);font-weight:normal;">`+response.datalogs[n].datalog_desc+`</h4>
      ` +
          response.datalogs[n].datalog_record +
          `
      </div>
      `
      );
    } else {
      $("#next-target").html(
        `NOTICE // NEXT RECOVERY REQUIRES PROG.26 TO <span style="color:rgba(255,255,255,0.6)">[` +
          response.datalogs[n].datalog_criteria +
          `]</span>`
      );
      nextCriteriaCount = response.datalogs[n].datalog_criteria_count;
      break;
    }
  }
}

function viewRecord(id) {
  $("#record-" + id + "-ctn").toggleClass("toggle-record-ctn");
}
