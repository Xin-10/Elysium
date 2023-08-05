var t1 = new TimelineMax({ paused: true });

t1.to(".overlay", 1, {
  opacity: 1,
  ease: Expo.easeInOut
});

t1.staggerFrom(".menu ul li", 0.8, { y: 60, opacity: 0, ease: Expo.easeOut }, 0.1);

t1.reverse();
$(document).on("click", ".menu-btn", function () {
  t1.reversed(!t1.reversed());
  if (t1.reversed()) {
    $(".overlay").addClass("hidden");
    $("body").css("overflow", "auto");
  } else {
    $(".overlay").removeClass("hidden");
    $("body").css("overflow", "hidden");
  }
});

function setupNavigation() {
  var menuBtn = document.querySelector(".menu-btn");
  var overlay = document.querySelector(".overlay");

  menuBtn.addEventListener("click", function () {
    t1.reversed(!t1.reversed());
    if (t1.reversed()) {
      overlay.classList.add("hidden");
      document.body.style.overflow = "auto";
    } else {
      overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  });
}