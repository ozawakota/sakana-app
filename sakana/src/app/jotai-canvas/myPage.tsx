"use client";

import { atom, useAtom } from "jotai";

const dotsAtom = atom([]);

const drawingAtom = atom(false);

const handleMouseDownAtom = atom(
  null,
  (get, set) => {
    set(drawingAtom, true);
  }
);

const handleMouseUpAtom = atom(null, (get, set) => {
  set(drawingAtom, false);
});

const handleMouseMoveAtom = atom(
  null,
  (get, set, update: Point) => {
    if (get(drawingAtom)) {
      set(dotsAtom, (prev) => [...prev, update]);
    }
  }
);

const SvgDots = () => {
  const [dots] = useAtom(dotsAtom);
  return (
    <g>
      {dots.map(([x, y], index) => (
        <circle cx={x} cy={y} r="2" fill="#aaa" key={index} />
      ))}
    </g>
  );
};

const SvgRoot = () => {
  const [, handleMouseUp] = useAtom(
    handleMouseUpAtom
  );
  const [, handleMouseDown] = useAtom(
    handleMouseDownAtom
  );
  const [, handleMouseMove] = useAtom(
    handleMouseMoveAtom
  );
  return (
    <svg
      width="800px"
      height="400px"
      viewBox="0 0 800px 400px"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={(e) => {
        handleMouseMove([e.clientX, e.clientY]);
      }}
    >
      <rect width="800px" height="400px" fill="#eee" />
      <SvgDots />
    </svg>
  );
};


export default function JotaiCanvas() {

  return (
    <section className="p-4 text-white">
      <div className="max-w-4xl mx-auto">
      <SvgRoot />
      </div>
    </section>
  );
}
