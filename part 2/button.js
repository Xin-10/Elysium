document.addEventListener("DOMContentLoaded", function() {
    var cssFile = document.createElement("link");
    cssFile.rel = "stylesheet";
    cssFile.href = "../../part 2/button.css";
  
    document.head.appendChild(cssFile);
  
    var t1 = new TimelineMax({ paused: true });
  
    t1.to(".overlay", 1, {
      opacity: 1,
      ease: Expo.easeInOut
    });
  
    t1.staggerFrom(".menu ul li", 0.8, { y: 60, opacity: 0, ease: Expo.easeOut }, 0.1);
  
    t1.reverse();
    document.addEventListener("click", function(event) {
      if (event.target.closest(".menu-btn")) {
        t1.reversed(!t1.reversed());
        var overlay = document.querySelector(".overlay");
        var body = document.body;
        if (t1.reversed()) {
          overlay.classList.add("hidden");
          body.style.overflow = "auto";
        } else {
          overlay.classList.remove("hidden");
          body.style.overflow = "hidden";
        }
      }
    });
  });  