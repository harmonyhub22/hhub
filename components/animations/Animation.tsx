export const titleAnim = {
  hidden: { y: 200 },
  show: {
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const photoAnim = {
  hidden: { scale: 1.5, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      ease: "easeOut",
      duration: 0.5,
    },
  },
};

export const slider = {
  hidden: { x: "-130%" },
  show: {
    x: "0%",
    transition: { ease: "easeOut", duration: 1 },
  },
};

export const imgVariant = {
  initial: {
    opacity: 0,
    y: -100,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 20,
    },
  },
};

export const homeSlider = {
  hidden: { x: "130%" },
  show: {
    x: "0%",
    transition: { ease: "easeOut", duration: 1 },
  },
};

export const titleSlider = {
  hidden: { x: "-130%", skew: "45deg" },
  show: {
    x: "0%",
    skew: "-5deg",
    transition: { ease: "easeOut", duration: 1 },
  },
};
