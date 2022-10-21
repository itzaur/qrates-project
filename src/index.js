"use strict";
import "./styles/index.scss";

//ANCHOR Import all images for webpack
function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context("../src/images", false, /\.(png|jpe?g|svg|webp)$/)
);

//ANCHOR Preload all images
const preloadImages = (selector = "img") => {
  return new Promise((resolve) => {
    imagesLoaded(document.querySelectorAll(selector), resolve);
  });
};

preloadImages().then(() => {
  document.body.classList.remove("loading");
});

//ANCHOR Header buttons animation
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

//ANCHOR Menu navbar animation
const menuBtn = document.querySelector(".header__menu-logo");
const menuBtnPath = document.querySelector(".header__menu-logo svg path");
const menuList = document.querySelector(".header__nav ul:first-child");
const menuTimeline = gsap.timeline({ paused: true });

menuTimeline.to(menuList, {
  y: 100,
  duration: 1.5,
  ease: "back.out",
});

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

//ANCHOR Menu onclick animation
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
  active ? menuTimeline.timeScale(1).play() : menuTimeline.reverse();

  gsap.to([leftTop, rightTop], {
    y: active ? size.h : 0,
    ease: "power3.out",
    duration: 1,
  });

  gsap.to(middleTop, {
    y: active ? size.h : 0,
    ease: "power3.out",
    delay: 0.12,
    duration: 1,
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

  if (active) {
    middleTop.y = size.h;
    rightTop.y = size.h;
    leftTop.y = size.h;
  }

  if (window.innerWidth > 900 && active) {
    active = false;

    gsap.to([leftTop, rightTop], {
      y: !active ? 0 : size.h,
      ease: "power3.out",
      duration: 1,
    });

    gsap.to(middleTop, {
      y: !active ? 0 : size.h,
      ease: "power3.out",
      delay: 0.12,
      duration: 1,
    });

    menuTimeline.timeScale(4).reverse();

    document.querySelector(".header__nav").classList.remove("open");
  }

  if (window.innerWidth < 900 && !active) {
    menuBtnPath.setAttribute("d", "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z");
    menuBtn.classList.remove("open");
  }
};

window.addEventListener("resize", handleResize);

//ANCHOR Test checkbox open / close
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

//ANCHOR Slider functionality
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
const imagesAnim = gsap.timeline();
imagesAnim.from(".studio-img", {
  autoAlpha: 0,
  duration: 0.1,
  stagger: { each: 1.5 },
  ease: "none",
  repeat: -1,
  yoyo: true,
});

//ANCHOR Test ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

let headerTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".header",
    pin: true,
    pinSpacing: false,
    start: "top top",
    endTrigger: ".footer",
    scrub: 1,
  },
  backgroundColor: "red",
});

headerTimeline.to(".header", {
  backgroundColor: "white",
  duration: 1,
});

gsap.from(".choose .section__box:nth-child(2) > *", {
  x: 900,
  ease: "power1.out",
  stagger: { each: 0.2 },
  scrollTrigger: {
    trigger: ".about",
    toggleActions: "restart none none none",
    start: "bottom 80%",
  },
  duration: 0.6,
});

gsap.from(".choose .section__box:nth-child(1) > *", {
  x: -900,
  ease: "power1.out",
  stagger: { each: 0.2 },
  scrollTrigger: {
    trigger: ".about",
    toggleActions: "restart none none none",
    start: "bottom 80%",
  },
  duration: 0.6,
});

gsap.from(".production .section__box:nth-child(2) > *", {
  x: 900,
  ease: "power1.out",
  stagger: { each: 0.2 },
  scrollTrigger: {
    trigger: ".choose",
    toggleActions: "restart none none none",
    start: "bottom 80%",
  },
  duration: 0.6,
});

gsap.from(".production .section__box:nth-child(1) > *", {
  x: -900,
  ease: "power1.out",
  stagger: { each: 0.2 },
  scrollTrigger: {
    trigger: ".choose",
    toggleActions: "restart none none none",
    start: "bottom 80%",
  },
  duration: 0.6,
});

gsap.from(".services .services__info > *", {
  x: -900,
  rotation: -15,
  ease: "power1.out",
  stagger: { each: 0.2 },
  scrollTrigger: {
    trigger: ".production",
    toggleActions: "restart none none none",
    start: "bottom 90%",
  },
  duration: 0.6,
});

gsap.from(".services .services__accordion > *, .services__accordion", {
  y: 40,
  autoAlpha: 0,
  ease: "power1.out",
  stagger: { each: 0.1 },
  scrollTrigger: {
    trigger: ".production",
    toggleActions: "restart none none none",
    start: "bottom 90%",
  },
  duration: 0.6,
});

gsap.from(".support .support__network > *", {
  x: -900,
  ease: "power1.out",
  stagger: { each: 0.2 },
  scrollTrigger: {
    trigger: ".services",
    toggleActions: "restart none none none",
    start: "bottom 90%",
  },
  duration: 0.6,
});

gsap.from(".support .support__help > *", {
  x: 900,
  ease: "power1.out",
  stagger: { each: 0.2 },
  scrollTrigger: {
    trigger: ".services",
    toggleActions: "restart none none none",
    start: "bottom 90%",
  },
  duration: 0.6,
});

gsap.from(".community > *", {
  y: 200,
  autoAlpha: 0,
  ease: "power1.out",
  stagger: { each: 0.2 },
  scrollTrigger: {
    trigger: ".support",
    toggleActions: "restart none none none",
    start: "bottom 90%",
  },
  duration: 0.6,
});

gsap.from(".gallery__item", {
  y: 200,
  autoAlpha: 0,
  scale: 0,
  rotation: -90,
  ease: "power1.out",
  stagger: { each: 0.2 },
  scrollTrigger: {
    trigger: ".community",
    toggleActions: "restart none none none",
    start: "bottom 100%",
  },
  duration: 0.8,
  onStart: () => {
    document.querySelector(".gallery").style.backgroundColor = "transparent";
  },
  onComplete: () => {
    document.querySelector(".gallery").style.backgroundColor = "black";
  },
});

gsap.from(".slider", {
  y: 900,
  autoAlpha: 0,
  ease: "power1.out",

  scrollTrigger: {
    trigger: ".gallery",
    toggleActions: "restart none none none",
    start: "bottom 90%",
  },
  duration: 1.2,
});

function randomNumber(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

gsap.from(".studio > *", {
  y: `+=${randomNumber(-300, 300)}`,
  x: `+=${randomNumber(-300, 300)}`,

  autoAlpha: 0,
  ease: "power1.out",
  stagger: { each: 0.2 },
  scrollTrigger: {
    trigger: ".studio",
    toggleActions: "restart none none none",
    start: "top 97%",
  },
  duration: 1.2,
});

const footerLinks = gsap.utils.toArray(".footer-list > *");

footerLinks.forEach((link) => {
  gsap.from(link, {
    y: `+=${randomNumber(-400, 400)}`,
    x: `+=${randomNumber(-400, 400)}`,

    autoAlpha: 0,
    ease: "power1.out",
    stagger: { each: 0.02 },
    scrollTrigger: {
      trigger: ".studio",
      toggleActions: "restart none none none",
      start: "bottom 95%",
    },
    duration: 1,
  });
});

gsap.from(".footer-box-icons", {
  yPercent: 50,
  autoAlpha: 0,
  ease: "power1.out",
  clearProps: "all",

  scrollTrigger: {
    trigger: ".footer",
    toggleActions: "restart none none none",
    start: "60% 95%",
  },
  duration: 1,
});
