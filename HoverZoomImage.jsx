import * as React from "react";
import { addPropertyControls, ControlType } from "framer";

export function HoverZoomImage({ imageUrl, zoom, positionX, positionY }) {
    const containerRef = React.useRef(null);
    const imageRef = React.useRef(null);
    const [coverScale, setCoverScale] = React.useState(1);
    const [naturalSize, setNaturalSize] = React.useState({ width: 0, height: 0 });

    const resolvedImage = imageUrl?.src || imageUrl;

    // 🔧 Step 1: Calculate scale needed to fully cover container with image
    React.useEffect(() => {
        if (!resolvedImage) return;
        const container = containerRef.current;
        const img = new Image();
        img.src = resolvedImage;

        img.onload = () => {
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;

            const widthRatio = containerWidth / img.naturalWidth;
            const heightRatio = containerHeight / img.naturalHeight;

            const scaleToCover = Math.max(widthRatio, heightRatio);
            setCoverScale(scaleToCover);
            setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
        };
    }, [resolvedImage]);

    // 🎯 Calculate offset needed to position image as requested (left/top/center/etc.)
    const getOffset = () => {
        const container = containerRef.current;
        if (!container || !naturalSize.width || !coverScale) return { x: 0, y: 0 };

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const displayWidth = naturalSize.width * coverScale;
        const displayHeight = naturalSize.height * coverScale;

        let offsetX = 0;
        let offsetY = 0;

        if (positionX === "left") offsetX = 0;
        else if (positionX === "center") offsetX = (containerWidth - displayWidth) / 2;
        else if (positionX === "right") offsetX = containerWidth - displayWidth;

        if (positionY === "top") offsetY = 0;
        else if (positionY === "center") offsetY = (containerHeight - displayHeight) / 2;
        else if (positionY === "bottom") offsetY = containerHeight - displayHeight;

        return { x: offsetX, y: offsetY };
    };

    // ✅ Step 2: On mount, set initial un-zoomed position and transform
    React.useLayoutEffect(() => {
        const container = containerRef.current;
        const image = imageRef.current;
        if (!container || !image || !naturalSize.width || !coverScale) return;

        const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

        const { x, y } = getOffset();
        image.style.transform = `translate(${x}px, ${y}px) scale(${coverScale})`;
        image.style.transformOrigin = "top left";

        if (isTouch) {
            container.style.cursor = "pointer";
            container.onclick = () => {
                if (resolvedImage) window.open(resolvedImage, "_blank");
            };
        }
    }, [coverScale, naturalSize, positionX, positionY, resolvedImage]);

    // 🧠 Step 3: Handle desktop zoom interaction
    React.useEffect(() => {
        const container = containerRef.current;
        const image = imageRef.current;
        if (!container || !image || !naturalSize.width || !coverScale) return;

        const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        if (isTouch) return;

        const totalScale = coverScale * zoom;

        const moveImage = (e) => {
            const rect = container.getBoundingClientRect();
            const containerWidth = rect.width;
            const containerHeight = rect.height;

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const percX = x / containerWidth;
            const percY = y / containerHeight;

            const scaledWidth = naturalSize.width * totalScale;
            const scaledHeight = naturalSize.height * totalScale;

            const maxOffsetX = Math.max(0, scaledWidth - containerWidth);
            const maxOffsetY = Math.max(0, scaledHeight - containerHeight);

            const offsetX = maxOffsetX * percX;
            const offsetY = maxOffsetY * percY;

            image.style.transition = "transform 0.1s linear";
            image.style.transform = `translate(${-offsetX}px, ${-offsetY}px) scale(${totalScale})`;
            image.style.transformOrigin = "top left";
        };

        const resetImage = () => {
            const { x, y } = getOffset();
            image.style.transition = "transform 0.3s ease-out";
            image.style.transform = `translate(${x}px, ${y}px) scale(${coverScale})`;
            image.style.transformOrigin = "top left";
        };

        container.addEventListener("mousemove", moveImage);
        container.addEventListener("mouseleave", resetImage);
        container.addEventListener("mouseenter", () => {
            image.style.transition = "transform 0.2s ease-out";
        });

        return () => {
            container.removeEventListener("mousemove", moveImage);
            container.removeEventListener("mouseleave", resetImage);
            container.removeEventListener("mouseenter", () => {});
            container.onclick = null;
        };
    }, [zoom, coverScale, naturalSize, resolvedImage, positionX, positionY]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#000",
                cursor: "zoom-in",
            }}
        >
            <img
                ref={imageRef}
                src={resolvedImage}
                alt="Zoomable artwork"
                style={{
                    position: "absolute",
                    width: "auto",
                    height: "auto",
                    maxWidth: "none",
                    maxHeight: "none",
                    display: "block",
                    willChange: "transform",
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            />
        </div>
    );
}

// 🎛 Control panel options in Framer
addPropertyControls(HoverZoomImage, {
    imageUrl: {
        type: ControlType.Image,
        title: "Image",
    },
    zoom: {
        type: ControlType.Number,
        title: "Zoom (e.g. 2 = 200%)",
        defaultValue: 2,
        min: 1,
        max: 5,
        step: 0.1,
    },
    positionX: {
        type: ControlType.Enum,
        title: "Horizontal Position",
        options: ["left", "center", "right"],
        optionTitles: ["Left", "Center", "Right"],
        defaultValue: "center",
    },
    positionY: {
        type: ControlType.Enum,
        title: "Vertical Position",
        options: ["top", "center", "bottom"],
        optionTitles: ["Top", "Center", "Bottom"],
        defaultValue: "center",
    },
});
