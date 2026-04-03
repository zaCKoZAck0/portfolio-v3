import {
  motion,
  useDragControls,
  useMotionValue,
  animate,
} from "framer-motion";
import { useWindowsStore } from "../store/windows";
import { useCallback, useEffect, useRef } from "react";
import { Minus, Square, X, Copy } from "lucide-react";

interface WindowProps {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMaximized?: boolean;
  onMinimize: () => void;
  onClose: () => void;
  onMaximize: () => void;
  children?: React.ReactNode;
}

export default function Window({
  id,
  title,
  x,
  y,
  width,
  height,
  zIndex,
  isMaximized,
  onMinimize,
  onClose,
  onMaximize,
  children,
}: WindowProps) {
  const { updatePosition, updateSize, focusWindow } = useWindowsStore();
  const dragControls = useDragControls();

  const isMobile = () => window.innerWidth < 1024;
  const maxW = () => (isMobile() ? window.innerWidth : window.innerWidth - 72);
  const maxH = () =>
    isMobile() ? window.innerHeight - 32 - 64 : window.innerHeight - 32;

  const motionX = useMotionValue(isMaximized ? 0 : x);
  const motionY = useMotionValue(isMaximized ? 0 : y);
  const motionWidth = useMotionValue<number | string>(
    isMaximized ? maxW() : width,
  );
  const motionHeight = useMotionValue<number | string>(
    isMaximized ? maxH() : height,
  );

  useEffect(() => {
    if (!isMaximized) motionX.set(x);
  }, [x, motionX, isMaximized]);
  useEffect(() => {
    if (!isMaximized) motionY.set(y);
  }, [y, motionY, isMaximized]);
  useEffect(() => {
    if (!isMaximized) motionWidth.set(width);
  }, [width, motionWidth, isMaximized]);
  useEffect(() => {
    if (!isMaximized) motionHeight.set(height);
  }, [height, motionHeight, isMaximized]);

  const prevIsMaximized = useRef(isMaximized);

  useEffect(() => {
    if (isMaximized !== prevIsMaximized.current) {
      if (isMaximized) {
        animate(motionX, 0, { duration: 0.3, ease: "easeInOut" });
        animate(motionY, 0, { duration: 0.3, ease: "easeInOut" });
        animate(motionWidth, maxW(), { duration: 0.3, ease: "easeInOut" });
        animate(motionHeight, maxH(), { duration: 0.3, ease: "easeInOut" });
      } else {
        animate(motionX, x, { duration: 0.5, ease: "easeInOut" });
        animate(motionY, y, { duration: 0.5, ease: "easeInOut" });
        animate(motionWidth, width, { duration: 0.5, ease: "easeInOut" });
        animate(motionHeight, height, { duration: 0.5, ease: "easeInOut" });
      }
      prevIsMaximized.current = isMaximized;
    }
  }, [
    isMaximized,
    x,
    y,
    width,
    height,
    motionX,
    motionY,
    motionWidth,
    motionHeight,
  ]);

  useEffect(() => {
    const handleResize = () => {
      if (isMaximized) {
        motionWidth.set(maxW());
        motionHeight.set(maxH());
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMaximized, motionWidth, motionHeight]);

  const handleDragEnd = useCallback(() => {
    if (isMaximized) return;
    updatePosition(id, {
      x: motionX.get() as number,
      y: motionY.get() as number,
    });
  }, [id, updatePosition, motionX, motionY, isMaximized]);

  const handlePointerDown = useCallback(() => {
    focusWindow(id);
  }, [id, focusWindow]);

  const handleResizeStart = (e: React.PointerEvent, direction: string) => {
    e.stopPropagation();
    focusWindow(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = motionWidth.get() as number;
    const startHeight = motionHeight.get() as number;
    const startPosX = motionX.get() as number;
    const startPosY = motionY.get() as number;

    const MIN_WIDTH = 300;
    const MIN_HEIGHT = 200;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      if (direction.includes("e")) {
        newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
      }
      if (direction.includes("s")) {
        newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY);
      }
      if (direction.includes("w")) {
        newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
        newX = startPosX + (startWidth - newWidth);
      }
      if (direction.includes("n")) {
        newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY);
        newY = startPosY + (startHeight - newHeight);
      }

      motionWidth.set(newWidth);
      motionHeight.set(newHeight);
      motionX.set(newX);
      motionY.set(newY);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      updateSize(id, {
        width: motionWidth.get() as number,
        height: motionHeight.get() as number,
      });
      updatePosition(id, {
        x: motionX.get() as number,
        y: motionY.get() as number,
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <motion.div
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        scale: 0.85,
        opacity: 0,
        transition: { type: "tween", duration: 0.2, ease: "easeOut" },
      }}
      transition={{ type: "tween", duration: 0.25, ease: [0.2, 0, 0, 1] }}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        x: motionX,
        y: motionY,
        width: motionWidth,
        height: motionHeight,
        zIndex,
      }}
      className="rounded-xl overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.5)] border border-white/10"
    >
      {/* Resize edges */}
      {!isMaximized && (
        <>
          <div
            className="absolute top-0 left-2 right-2 h-2 cursor-ns-resize z-50"
            onPointerDown={(e) => handleResizeStart(e, "n")}
          />
          <div
            className="absolute bottom-0 left-2 right-2 h-2 cursor-ns-resize z-50"
            onPointerDown={(e) => handleResizeStart(e, "s")}
          />
          <div
            className="absolute top-2 bottom-2 left-0 w-2 cursor-ew-resize z-50"
            onPointerDown={(e) => handleResizeStart(e, "w")}
          />
          <div
            className="absolute top-2 bottom-2 right-0 w-2 cursor-ew-resize z-50"
            onPointerDown={(e) => handleResizeStart(e, "e")}
          />
          {/* Resize corners */}
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-50"
            onPointerDown={(e) => handleResizeStart(e, "nw")}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-50"
            onPointerDown={(e) => handleResizeStart(e, "ne")}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-50"
            onPointerDown={(e) => handleResizeStart(e, "sw")}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-50"
            onPointerDown={(e) => handleResizeStart(e, "se")}
          />
        </>
      )}

      {/* GNOME Title Bar — dark, controls on right */}
      <div
        onDoubleClick={onMaximize}
        onPointerDown={(e) => {
          if (!isMaximized) dragControls.start(e);
        }}
        className="h-10 bg-[#2c2c2c] flex items-center px-2 relative cursor-grab active:cursor-grabbing select-none shrink-0"
      >
        {/* Title — centered */}
        <span className="absolute inset-0 flex items-center justify-center text-[13px] font-medium text-white/80 pointer-events-none">
          {title}
        </span>

        {/* Window controls — RIGHT side (Ubuntu/GNOME style) */}
        <div className="flex items-center gap-0.5 ml-auto relative z-10">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onMinimize}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Minus className="w-4 h-4 text-white/70" strokeWidth={2} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onMaximize}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            {isMaximized ? (
              <Copy className="w-3 h-3 text-white/70" strokeWidth={2} />
            ) : (
              <Square className="w-3 h-3 text-white/70" strokeWidth={2} />
            )}
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#e95420]/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4 text-white/70" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 bg-[#2c2c2c] text-white/90 overflow-auto">
        {children}
      </div>
    </motion.div>
  );
}
