import * as React from "react";
import { addPropertyControls, ControlType } from "framer";

export function HoverZoomImage({ imageUrl, zoom }) {
    const containerRef = React.useRef(null);
    const imageRef = React.useRef(null);
    const rectRef = React.useRef(null); // 🔁 stores the latest container rect

    // Update bounding rect on resize
    const updateRect = () => {
        if (containerRef.current) {
            rectRef.current = containerRef.current.getBoundingClientRect();
        }
    };

    React.useEffect(() => {
        updateRect(); // Initial rect
        window.addEventListener("resize", updateRect);
        return () => {
            window.removeEventListener("resize", updateRect);
        };
    }, []);

    React.useEffect(() => {
        const container = containerRef.current;
        const image = imageRef.current;
        if (!container || !image || !imageUrl) return;

        const handleMouseMove = (e) => {
            const rect = rectRef.current || container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const percX = x / rect.width;
            const percY = y / rect.height;

            const originX = (percX * 100).toFixed(2);
            const originY = (percY * 100).toFixed(2);

            image.style.transformOrigin = `${originX}% ${originY}%`;
        };

        const handleMouseEnter = () => {
            updateRect(); // Ensure fresh rect on hover
            image.style.transition = "transform 0.2s ease-out";
            image.style.transform = `scale(${zoom})`;
        };

        const handleMouseLeave = () => {
            image.style.transform = "scale(1)";
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseenter", handleMouseEnter);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseenter", handleMouseEnter);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [zoom, imageUrl]);

    const resolvedImage = imageUrl?.src || imageUrl;

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
                cursor: "zoom-in",
            }}
        >
            <img
                ref={imageRef}
                src={resolvedImage}
                alt="Zoomable"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.2s ease-out",
                    transform: "scale(1)",
                }}
            />
        </div>
    );
}

addPropertyControls(HoverZoomImage, {
    imageUrl: {
        type: ControlType.Image,
        title: "Image",
    },
    zoom: {
        type: ControlType.Number,
        title: "Zoom",
        defaultValue: 2,
        min: 1,
        max: 5,
        step: 0.1,
    },
});
