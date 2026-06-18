import { useEffect, useState } from "react";

type Props = {
	sprite: string;
	frameWidth: number;
	frameHeight: number;
	columns: number;
	totalFrames: number;
	fps?: number;
};

export function Sprite({
	sprite,
	frameWidth,
	frameHeight,
	columns,
	totalFrames,
	fps = 8,
}: Props) {

	const [frame, setFrame] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setFrame((f) => (f + 1) % totalFrames);
		}, 1000 / fps);

		return () => clearInterval(id);
		
	}, [fps, totalFrames]);

	const x = -(frame % columns) * frameWidth;
	const y = -Math.floor(frame / columns) * frameHeight;

	return (
		<div style={{
				width: frameWidth,
				height: frameHeight,
				backgroundImage: `url(${sprite})`,
				backgroundPosition: `${x}px ${y}px`,
				imageRendering: "pixelated",
			}}>
		</div>
	);
}