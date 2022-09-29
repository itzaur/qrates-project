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
