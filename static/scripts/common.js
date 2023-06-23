
$( document ).ready(function() {
    if (window.location.host.substr(-10) == '.github.io' && window.location.protocol != 'https:') {
    window.location.protocol = 'https:';
}
});

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

if (localStorage.getItem("visited") === null) {
  $.ajax({
    type: "POST",
    url: "https://klaivius.pythonanywhere.com/addVisitor",
    dataType: "json",
    timeout: 15000,
    beforeSend: function () {},
    success: function (response) {
      console.log(response);
      localStorage.setItem("visited", true);
    },
  });
}
