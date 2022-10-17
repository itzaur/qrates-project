"use strict";
import "./styles/index.scss";

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context("../src/images", false, /\.(png|jpe?g|svg)$/)
);

const btnsBox = document.querySelector(".header__login");
const btns = document.querySelectorAll(".btn");
const cursor = document.querySelector(".cursor");

btnsBox.addEventListener("click", (e) => {
  btns.forEach((btn) => {
    btn.classList.remove("active");
  });

  e.target.classList.toggle("active");
});

//ANCHOR Cursor functionality
gsap.set(cursor, {
  xPercent: -50,
  yPercent: -50,
  scale: 1,
});

let xTo = gsap.quickTo(cursor, "x", {
    duration: 0.6,
    ease: "power3",
  }),
  yTo = gsap.quickTo(cursor, "y", {
    duration: 0.6,
    ease: "power3",
  });

window.addEventListener("mousemove", (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});

document.querySelectorAll("a, [data-hover='hover']").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    el.classList.add("active-cursor");
    cursor.classList.add("active-cursor");
  });

  el.addEventListener("mouseleave", () => {
    el.classList.remove("active-cursor");
    cursor.classList.remove("active-cursor");
  });
});

const menuBtn = document.querySelector(".header__menu-logo");
const menuBtnPath = document.querySelector(".header__menu-logo svg path");
const menuList = document.querySelector(".header__nav ul:first-child");
const menuItem = menuList.querySelectorAll("li");
const menuTimeline = gsap.timeline({ paused: true });

menuTimeline.to(menuList, {
  y: 200,
  duration: 1.5,
  ease: "back.out",
});
// .from(
//   menuItem,
//   {
//     y: -80,
//     duration: 1.5,
//     stagger: { each: 0.2 },
//     ease: "power3.out",
//     clearProps: "all",
//   },
//   "<0"
// );
const menuLists = document.querySelectorAll(".openlist");
const linkAnim = gsap.timeline({ paused: true });

linkAnim
  .to(
    "[data-name='checklist1'] li",
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.4,
      ease: "power3.out",
      delay: 0.3,
      stagger: { each: 0.12 },
    },
    0
  )
  .to(
    "[data-name='checklist2'] li",
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.4,
      ease: "power3.out",
      delay: 0.2,
      stagger: { each: 0.15 },
    },
    0
  );

menuLists.forEach((list) =>
  list.addEventListener("click", (e) => {
    gsap.set(".checklist li", {
      autoAlpha: 0,
      y: -50,
    });

    linkAnim.restart();
  })
);

//ANCHOR Menu
const menuSvg = document.querySelector("#menu-wrapper");
const menuSvgPath = document.querySelector("#path");
const size = {
  w: window.innerWidth,
  h: window.innerHeight,
};
const leftTop = {
  x: 0,
  y: 0,
};
const middleTop = {
  x: size.w / 2,
  y: 0,
};
const rightTop = {
  x: size.w,
  y: 0,
};
let d = "";
let active = false;

const menuAnimate = () => {
  d = `
    M ${size.w}, 0
    L 0, 0
    L ${leftTop.x} ${leftTop.y}
    Q ${middleTop.x} ${middleTop.y}
    ${rightTop.x} ${rightTop.y}
  `;

  menuSvgPath.setAttribute("d", d);
  requestAnimationFrame(menuAnimate);
};
menuAnimate();

menuBtn.addEventListener("click", () => {
  active = !active;
  active ? menuTimeline.play() : menuTimeline.reverse();
  console.log(active);

  gsap.to([leftTop, rightTop], {
    y: active ? size.h : 0,
    ease: "power3.out",
    duration: 2,
  });

  gsap.to(middleTop, {
    y: active ? size.h : 0,
    ease: "power3.out",
    delay: 0.12,
    duration: 2,
  });

  menuBtn.classList.toggle("open");
  document.querySelector(".header__nav").classList.toggle("open");

  if (menuBtn.className.includes("open")) {
    menuBtnPath.setAttribute(
      "d",
      "m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"
    );
  } else {
    menuBtnPath.setAttribute("d", "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z");
  }
});

const handleResize = () => {
  size.w = window.innerWidth;
  size.h = window.innerHeight;
  menuSvg.setAttribute("width", size.w);
  menuSvg.setAttribute("height", size.h);
  middleTop.x = size.w / 2;
  rightTop.x = size.w;
};
handleResize();
window.addEventListener("resize", handleResize);

//ANCHOR Testing checkbox open / close
document.addEventListener("click", (e) => {
  const checkbox = document.querySelectorAll(".checkbox");
  checkbox.forEach((el) => {
    if (e.target !== el) {
      el.checked = false;
    }
  });
});

//ANCHOR Change text on resize page
let textBox = document.querySelector(".production");
const text = {
  mobile: `
  <h2 class="production__title fs-140"><span class="fs-240">Find your fit</span><br/>
      Choose the best Qrates project type to suit your needs <i class="bx bx-down-arrow-alt"></i></h2>
  `,
  desktop: `
<h2 class="production__title fs-150">No matter where you’re at in your career, we’ve got a production model
to suit you.</h2>
`,
};

function changeText() {
  let textElement = document.querySelector(".production__title");
  if (window.innerWidth < 900) {
    textBox.insertAdjacentHTML("afterbegin", text.mobile);
    textElement?.remove();
  } else {
    textBox.insertAdjacentHTML("afterbegin", text.desktop);
    textElement?.remove();
  }
}

window.addEventListener("resize", changeText);
changeText();

//ANCHOR Accordion functionality
const accordionGroups = gsap.utils.toArray(".accordion-group");
const accordionMenus = gsap.utils.toArray(".accordion-menu");
const accordionMenuToggles = accordionGroups.map(createAnimation);

accordionMenus.forEach((menu) =>
  menu.addEventListener("click", () => toggleMenu(menu))
);

function toggleMenu(clickedMenu) {
  accordionMenuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
}

function createAnimation(element) {
  let menu = element.querySelector(".accordion-menu");
  let box = element.querySelector(".accordion-content");
  let plusElement = element.querySelector(".accordion-plus");
  let minusElement = element.querySelector(".accordion-minus");

  gsap.set(box, {
    height: "auto",
  });

  let animation = gsap
    .timeline({ paused: true })
    .from(box, {
      height: 0,
      duration: 0.5,
      ease: "power1.inOut",
    })
    .from(
      minusElement,
      {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power1.out",
      },
      0
    )
    .to(
      plusElement,
      {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power1.out",
      },
      0
    )
    .reverse();

  return function (clickedMenu) {
    if (clickedMenu === menu) {
      animation.reversed(!animation.reversed());
    } else {
      animation.reverse();
    }
  };
}

//ANCHOR Ticker functionality
// const ticker = document.querySelector(".ticker");
// const tickerList = document.querySelector(".ticker__list");
// const ticker = gsap.timeline();
// ticker.to(".ticker__list", {
//   xPercent: -100,
//   repeat: -1,
//   ease: "none",
//   duration: 15,
// });

// const ticker = document.querySelector(".ticker");
// const tickerList = document.querySelector(".ticker__list");
// let clone = tickerList.cloneNode(true);
// let clone2 = tickerList.cloneNode(true);
// ticker.append(clone);
// ticker.append(clone2);

// const groups = gsap.utils.toArray(".accordion-group");
// const menus = gsap.utils.toArray(".accordion-menu");
// const menuToggles = groups.map(createAnimation);

// menus.forEach((menu) => menu.addEventListener("click", () => toggleMenu(menu)));
// function toggleMenu(clickedMenu) {
//   menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
// }

// function createAnimation(element) {
//   let menu = element.querySelector(".accordion-menu");
//   let box = element.querySelector(".accordion-content");
//   let plusElement = element.querySelector(".accordion-plus");
//   let minusElement = element.querySelector(".accordion-minus");

//   gsap.set(box, {
//     height: "auto",
//   });

//   const animation = gsap.timeline();
//   animation
//     .from(box, {
//       height: 0,
//       duration: 0.5,
//       ease: "power1.inOut",
//     })
//     .to(
//       plusElement,
//       {
//         autoAlpha: 0,
//         duration: 0.2,
//         ease: "none",
//       },
//       0
//     )
//     .from(
//       minusElement,
//       {
//         autoAlpha: 0,
//         duration: 0.2,
//         ease: "none",
//       },
//       0
//     )
//     .reverse();

//   return function (clickedMenu) {
//     if (clickedMenu === menu) {
//       // animation.reversed(!animation.reversed());
//       animation.play();
//     } else {
//       animation.reverse();
//     }
//   };
// }
//ANCHOR Slider functionality
const slider = document.querySelector(".slider");
const sliderBox = document.querySelectorAll(".slider__box");
const sliderCheckbox = document.querySelector(".slider__checkbox");
const sliderCheckboxElement = document.querySelectorAll(
  ".slider__checkbox div"
);

sliderCheckbox.addEventListener("click", (e) => {
  sliderCheckboxElement.forEach((el) => {
    el.classList.remove("active");
  });

  e.target.classList.add("active");

  sliderBox.forEach((box) => {
    if (e.target.textContent === "2") {
      box.style.transform = `translateX(-100%)`;
    } else {
      box.style.transform = `translateX(0%)`;
    }
  });
});

//ANCHOR Studio images functionality
// const studioImgs = gsap.utils.toArray(".studio-img");
const imagesAnim = gsap.timeline();
imagesAnim.from(".studio-img", {
  autoAlpha: 0,
  duration: 0.1,
  stagger: { each: 1.5 },
  ease: "none",
  repeat: -1,
  yoyo: true,
});
