// var currentPageID = "";
// var prevPageID = "";
var backtoPrev = "";
$("document").ready(function () {
  getCurrentPageID();
  changePage(currentPageID);
  updateTime();
  requestCountUpdate();
});

window.onpopstate = function (event) {
  // console.log(event.state);
  if (event.state != null) {
    //if history.back() to the first landing page
    changePage(event.state, "replace");
  }
};

function updateTime() {
  let date = new Date();
  let date12 = get12hour(date);

  $("#hours").html(date12[0]);
  $("#minutes").html(date12[1]);
  $("#ampm").html(date12[2]);
  setTimeout(updateTime, 1000);
}

function get12hour(date) {
  let h = date.getHours();
  let m = date.getMinutes();
  let ampm = h >= 12 ? " PM" : " AM";

  h = h % 12;
  h = h ? h : 12;
  m = m < 10 ? "0" + m : m;

  resultArray = [h, m, ampm];
  return resultArray;
}

function menuToggle(toggle) {
  if (toggle == "on") {
    $("#menu-area").removeClass("menu-area-close");
    $("#menuicon").attr("onclick", "menuToggle('off')");
    $("#menuicon").css("transform", "rotate(90deg)");
  } else if (toggle == "off") {
    $("#menu-area").addClass("menu-area-close");
    $("#menuicon").attr("onclick", "menuToggle('on')");
    $("#menuicon").css("transform", "");
  }
}

function getCurrentPageID() {
  let path = location.pathname;

  if (location.pathname != "/") {
    let pathArray = path.split("/");

    if (pathArray.length <= 2) {
      //if one subdir
      currentPageID = path.split("/")[1]; //the subdir
    } else {
      currentPageID = path.split("/")[1] + "-" + path.split("/")[2];
    }

    // console.log(currentPageID);
  } else {
    currentPageID = "about"; //if no path, go to about (default).
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function changePage(pageid, state = "push", subpage = false) {
  if (pageid != "404") {
    var url = "/ajax_content/" + pageid;
  } else {
    var url = "/ajax_content/404";
  }

  if (pageid.split("-").length > 1) {
    //if a subpage
    subpage = true;
    var subpageid = pageid.split("-")[1];
    pageid = pageid.split("-")[0];
    
  }

  $.ajax({
    type: "GET",
    url: url,
    dataType: "html",
    beforeSend: function () {
      clearTimeout(backtoPrev);
      loader("#nav-loader-" + pageid, "show");
      fadeContentArea("out"); //fadeout content area
    },
    success: function (response) {
      menuToggle("off");
      $(".nav-link").prop("disabled", false); //enable all buttons
      $(".nav-link").removeClass("nav-active"); //remove nav-active from all buttons
      $("#" + pageid).addClass("nav-active"); //add nav-active to selected button
      if ($("#" + pageid).hasClass("nav-link-hidden")) {
        $("#others").addClass("nav-active");
      }
      $("#" + pageid).prop("disabled", true); //disable selected button
      loader("#nav-loader-" + pageid, "hide");

      fadeContentArea("in"); //fadein content area

      $("#content-area").html(""); //reinit the content area
      $("#content-area").show();

      if (state == "push") {
        if(!subpage){
          window.history.pushState(pageid, "", "/" + pageid); //add entry to history
        } else { //if the page is a subpage
          window.history.pushState(pageid, "", "/" + pageid + "/" + subpageid); //add entry to history
          $("#" + pageid).prop("disabled", false); //disable selected button
        }
        
      } else if (state == "replace") {
        window.history.replaceState(pageid, "", "/" + pageid); //just replace the state??? sorry idk how to explain to future me tough luck
      }

      $("#content-area").html(response); //populate content area
      $("title").html(capitalizeFirstLetter(pageid) + " // Klaive Vius"); //change page title

      currentPageID = pageid; //update currentPageID
    },
    error: function (response) {
      loader("#nav-loader-" + pageid, "hide");
      $(".nav-link").prop("disabled", false); //enable all buttons
      $(".nav-link").removeClass("nav-active"); //remove nav-active from all buttons

      changePage("404", "replace");
      backtoPrev = setTimeout(function () {
        changePage(currentPageID);
      }, 3000);
    },
  });
}

// function testget(){
//   $.ajax({
//     type: "POST",
//     url: "https://klaivius.pythonanywhere.com/getschedule",
//     dataType: "json",
//     data:{month:'4'},
//     success: function (response) {
//       console.log(response);
//     },
//   });
// }

function fadeContentArea(fade) {
  if (fade == "out") {
    $("#content-area").css("opacity", "0");
    return;
  }

  if (fade == "in") {
    $("#content-area").css("opacity", "1");
    return;
  }
}

function loader(loader_id, status = "show") {
  if (status == "show") {
    $(loader_id).show();
    array = ["&#x25C6;", "&#x25C7;"];
    n = 0;
    if (typeof playLoader !== "undefined") {
      clearInterval(playLoader);
    }
    playLoader = setInterval(function () {
      $(loader_id).html(array[n]);
      n++;
      if (n == 2) {
        n = 0;
      }
    }, 300);
  } else if (status == "hide") {
    if (typeof playLoader !== "undefined") {
      $(loader_id).hide();
      clearInterval(playLoader);
    }
  } else {
    console.log("LOADER ERROR");
  }
}

function toggleOthers(s = true) {
  if (s) {
    $(".nav-others").toggle();
  } else {
    $(".nav-others").hide();
  }
}

$(document).click(function (tgt) {
  if (tgt.target.id != "others") {
    toggleOthers(false);
  }
});

function highlightOthers() {
  $("#others").addClass("nav-active");
}

function requestCountUpdate(){
  if (localStorage.getItem("localRequestedCount") === null) {
    
    $.post( "https://klaivius.pythonanywhere.com/addVisitor", function(data) {

      $("#data-request-count").html(data);
      localStorage.setItem("localRequestedCount",parseInt(data));

      });

      

  } else {
    
    $.post( "https://klaivius.pythonanywhere.com/countVisitor", function(data) {

      $("#data-request-count").html(data);

      });

  }
}