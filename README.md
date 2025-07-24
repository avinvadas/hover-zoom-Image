# HoverZoomImage

A Framer code component for displaying high-resolution artwork with a smooth, cursor-driven zoom-on-hover effect. Designed for art galleries, portfolios, and image showcases.

## Features

- Fully covers container with smart scale-to-fit
- Zoom on hover (desktop only)
- Focal point follows mouse position
- No overflow — always visually contained
- Tap on mobile opens full-resolution image in new tab
- Configurable image positioning (top-left, center, bottom-right, etc.)

## Controls (in Framer panel)

| Property      | Type     | Description                                    |
|---------------|----------|------------------------------------------------|
| `imageUrl`    | Image    | Upload high-res image                         |
| `zoom`        | Number   | Zoom level (e.g. `2` for 200%)                |
| `positionX`   | Enum     | Horizontal alignment (`left`, `center`, `right`) |
| `positionY`   | Enum     | Vertical alignment (`top`, `center`, `bottom`) |

## Usage

1. Add the `HoverZoomImage` code component to your Framer project.
2. Drag it onto your canvas and set the image via the panel.
3. Optionally adjust zoom and alignment controls.

## Mobile Behavior

On touch devices, zoom is disabled and tapping the image will open it in full-resolution in a new browser tab.

## License

MIT — free to use, modify, and distribute.

---

> Made with ❤️, by [avinvadas.com]  
