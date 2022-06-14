$("document").ready(function () {
  updateTime();
});

function navbarToggle() {
  let x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function updateTime() {
  let date = new Date();
  let date12 = get12hour(date);

  $("#hours").html(date12[0]);
  $("#minutes").html(date12[1]);
  $("#ampm").html(date12[2]);
  setTimeout(updateTime, 1000);
}

function get12hour(date){
  let h = date.getHours();
  let m = date.getMinutes();
  let ampm = h >= 12 ? " PM" : " AM";

  h = h % 12;
  h = h ? h : 12;
  m = m < 10 ? "0" + m : m;

  resultArray = [h,m,ampm]
  return(resultArray)
}
