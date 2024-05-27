

import  { useEffect, useRef, useState } from "react";
import "./dropdown.css"
const options = [
    { name: "0", friendlyName: "0%" },
    { name: "0.5", friendlyName: "0.5%" },
    { name: "1", friendlyName: "1%" }
];

const Dropdown = () => {
  const [selected, setSelected] = useState("0");
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const elRef = useRef(null);
  const itemListRef = useRef(null);
  const menuButtonRef = useRef(null);
  const [animations, setAnimations] = useState([]);

  const onAnimationFinish = open => {
    if (!elRef.current || !itemListRef.current) return;

    menuButtonRef.current?.setAttribute("aria-expanded", `${open}`);
    setAnimations([]);
    setIsCollapsing(false);
    setIsExpanding(false);
    itemListRef.current.style.height = "";
    elRef.current?.classList.remove("drop--collapsing", "drop--expanding");
  };

  const animActionsCollapse = {
    onfinish: onAnimationFinish.bind(this, false),
    oncancel: () => {
      setIsCollapsing(false);
    }
  };

  const animActionsExpand = {
    onfinish: onAnimationFinish.bind(this, true),
    oncancel: () => {
      setIsExpanding(false);
    }
  };

  useEffect(() => {
    const el = document.getElementById('dummy');
    elRef.current = el;
 
    menuButtonRef.current = el?.querySelector("button");
    itemListRef.current = el?.querySelector("[data-items]");
    defaultOption();

    document.addEventListener("click", outsideToClose);
    window.addEventListener("keydown", escToClose);
    el?.addEventListener("click", toggle);
    window.addEventListener("keydown", kbdAction);

    return () => {
      document.removeEventListener("click", outsideToClose);
      window.removeEventListener("keydown", escToClose);
      el?.removeEventListener("click", toggle);
      window.removeEventListener("keydown", kbdAction);
    };
  }, []);

  const transDuration = () => {
    if (elRef.current) {
      const style = getComputedStyle(elRef.current);
      const rawDur = style.getPropertyValue("--drop-trans-dur");
      let dur = rawDur.substring(0, rawDur.indexOf("s"));
      const mIndex = dur.indexOf("m");

      if (mIndex > -1) {
        dur = dur.substring(0, mIndex);
        return +dur;
      }
      return +dur * 1e3;
    }
    return 0;
  };

  const defaultOption = () => {
    const buttonEl = itemListRef.current?.querySelector(`[value="${selected}"]`);
    buttonEl?.classList.add("drop__btn--selected");

    if (menuButtonRef.current) {
      const optionFound = options.find(option => option.name === selected);
      menuButtonRef.current.textContent = optionFound?.friendlyName || "";
    }
  };

  const kbdAction = e => {
    const { key } = e;
    const tabOrArrow = key === "Tab" || key === "ArrowUp" || key === "ArrowDown";
    const notAnimating = !isExpanding && !isCollapsing;

    if (notAnimating && menuButtonRef.current?.ariaExpanded === "true" && tabOrArrow) {
      navigateOption(e);
    }
  };

  const escToClose = e => {
    if (e.key === "Escape" && !isCollapsing && menuButtonRef.current?.ariaExpanded === "true") {
      toggle(e);
    }
  };

  const outsideToClose = e => {
    let target = e.target;
    let elFound = false;

    if (!isCollapsing && menuButtonRef.current?.ariaExpanded === "true") {
      do {
        target = target.parentElement;

        if (target === elRef.current) {
          elFound = true;
        }
      } while (target);

      if (!elFound) {
        toggle(e);
      }
    }
  };

  const navigateOption = e => {
    const itemList = itemListRef.current;
    const buttonEls = itemList?.querySelectorAll("button");
    const buttons = Array.from(buttonEls || []);
    const buttonsTemp = [...buttons];
    const first = buttonsTemp.shift();
    const last = buttonsTemp.pop();
    const currentItem = document.activeElement;
    const { key, shiftKey } = e;
    const downKey = key === "ArrowDown";
    const upKey = key === "ArrowUp";
    const currentIndex = buttons.indexOf(currentItem);

    if (!buttons.length) {
      e.preventDefault();
    } else if (downKey) {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      if (nextIndex >= buttons.length) {
        first?.focus();
        return;
      }
      buttons[nextIndex].focus();
    } else if (upKey) {
      e.preventDefault();
      const prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        last?.focus();
        return;
      }
      buttons[prevIndex].focus();
    } else if (buttons.length === 1 || ((!itemList?.contains(currentItem) || currentItem === last) && !shiftKey)) {
      e.preventDefault();
      first?.focus();
    } else if ((!itemList?.contains(currentItem) || currentItem === first) && shiftKey) {
      e.preventDefault();
      last?.focus();
    }
  };

  const toggle = e => {
    e.preventDefault();
    elRef.current?.classList.remove("drop--collapsing", "drop--expanding");

    const shouldExpand = menuButtonRef.current?.ariaExpanded === "true";

    if (isCollapsing || !shouldExpand) {
      expand();
    } else if (isExpanding || shouldExpand) {
      collapse(e);
    }
  };

  const expand = () => {
    if (!elRef.current || !itemListRef.current) return;

    itemListRef.current.style.height = `${itemListRef.current.offsetHeight}px`;
    menuButtonRef.current?.setAttribute("aria-expanded", "true");
    elRef.current.classList.add("drop--expanding");
    setIsExpanding(true);
    animations.forEach(anim => anim.cancel());
    setAnimations([]);

    const buttonEls = itemListRef.current.querySelectorAll("button");
    const buttons = Array.from(buttonEls || []);
    const startHeight = itemListRef.current.offsetHeight || 0;
    const endHeight = itemListRef.current.firstElementChild?.offsetHeight || 0;
    const itemListAnim = itemListRef.current.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      {
        duration: transDuration(),
        easing: "cubic-bezier(0.33,1,0.68,1.33)"
      }
    );
    itemListAnim.onfinish = animActionsExpand.onfinish;
    itemListAnim.oncancel = animActionsExpand.oncancel;
    setAnimations(prev => [...prev, itemListAnim]);

    buttons.forEach((button, i) => {
      const buttomAnim = button.animate(
        { transform: ["translateY(100%)", "translateY(0)"] },
        {
          duration: transDuration(),
          delay: (transDuration() / 12) * i,
          easing: "cubic-bezier(0.33,1,0.68,1)"
        }
      );
      setAnimations(prev => [...prev, buttomAnim]);
    });

    elRef.current.style.setProperty("--drop-flare-dist", `${endHeight}px`);
  };

  const collapse = e => {
    if (!elRef.current || !itemListRef.current) return;

    elRef.current.classList.add("drop--collapsing");
    setIsCollapsing(true);
    animations.forEach(anim => anim.cancel());
    setAnimations([]);

    const clickedButton = e.target;
    const buttonEls = itemListRef.current?.querySelectorAll("button");
    const buttons = Array.from(buttonEls || []);
    const startHeight = itemListRef.current?.offsetHeight || 0;
    const endHeight = 0;
    const easing = "cubic-bezier(0.33,1,0.68,1)";
    const itemListAnim = itemListRef.current.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: transDuration(), easing }
    );
    itemListAnim.onfinish = animActionsCollapse.onfinish;
    itemListAnim.oncancel = animActionsCollapse.oncancel;
    setAnimations(prev => [...prev, itemListAnim]);

    buttons.forEach((button, i) => {
      if (clickedButton.value) {
        button.classList.remove("drop__btn--selected");
      }
      const delayInc = transDuration() / 12;
      const buttomAnim = button.animate(
        { transform: ["translateY(0)", "translateY(100%)"] },
        {
          duration: transDuration(),
          delay: delayInc * (buttons.length - 1) - delayInc * i,
          easing
        }
      );
      setAnimations(prev => [...prev, buttomAnim]);
    });
    if (clickedButton.value) {
      clickedButton.classList.add("drop__btn--selected");

      if (menuButtonRef.current) {
        const optionFound = options.find(option => option.name === clickedButton.value);
        menuButtonRef.current.textContent = optionFound?.friendlyName || "";
      }
    }
    menuButtonRef.current?.focus();
    elRef.current.style.setProperty("--drop-flare-dist", `${endHeight}px`);
  };

  

  return (
    <div className="drop" id="dummy">
        <span className="slippage">Slippage</span>
        <div className="dropdown-container">
        <button
        className="drop__btn"
        aria-expanded="false"
        aria-haspopup="true"
        type="button"
        ref={menuButtonRef}
      ></button>
      <div className="drop__items" data-items ref={itemListRef}>
        <div className="drop__items-inner">
          {options.map(option => (
            <button
              key={option.name}
              className={`drop__btn ${option.name === selected ? "drop__btn--selected" : ""}`}
              type="button"
              value={option.name}
              onClick={collapse}
            >
              {option.friendlyName}
            </button>
          ))}
        </div>
      </div>
        </div>
    </div>
  );
};


export default Dropdown;
