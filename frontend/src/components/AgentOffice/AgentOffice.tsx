import walk from '@assets/sprites/walk.png';
import work from '@assets/sprites/work.png';
import sleep from '@assets/sprites/sleep.png';
import deleteAnim from '@assets/sprites/delete.png';
import defaultA from '@assets/sprites/default.png';
import office from '@assets/images/background.jpg';

import { Sprite } from './Sprite';
import style from './AgentOffice.module.css';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { useEffect, useRef, useState } from 'react';

const MIN_WORK_TIME = 2500;
const MIN_DEL_TIME = 2500;
const SPRITE_TRANSITION_MS = 300; // длительность кроссфейда

const AgentOffice: React.FC = () => {
	const { status } = useAppSelector(state => state.chat);

	const [currentSprite, setCurrentSprite] = useState(sleep);
	const [previousSprite, setPreviousSprite] = useState<string | null>(null);
	const [isFadingOut, setIsFadingOut] = useState(false);

	const currentSpriteRef = useRef(sleep);
	const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const workStartRef = useRef<number | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const changeSprite = (next: string) => {
		if (next === currentSpriteRef.current) return;

		if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

		setPreviousSprite(currentSpriteRef.current);
		setIsFadingOut(false);
		setCurrentSprite(next);
		currentSpriteRef.current = next;

		// триггерим переход на следующий кадр, чтобы CSS transition сработал
		requestAnimationFrame(() => setIsFadingOut(true));

		fadeTimeoutRef.current = setTimeout(() => {
			setPreviousSprite(null);
		}, SPRITE_TRANSITION_MS);
	};

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if (status === 'pending') {
			workStartRef.current = Date.now();
			changeSprite(work);
			return;
		}
		if (status === 'fulfilled') {
			const workElapsed = workStartRef.current
				? Date.now() - workStartRef.current
				: 0;
			const workRemaining = Math.max(MIN_WORK_TIME - workElapsed, 0);
			timeoutRef.current = setTimeout(() => {
				changeSprite(deleteAnim);
				timeoutRef.current = setTimeout(() => {
					changeSprite(defaultA);
				}, MIN_DEL_TIME);
			}, workRemaining);
			return;
		}
		if (status === 'rejected') {
			changeSprite(sleep);
		}
	}, [status]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
		};
	}, []);

	return (
		<div className={style.officeWrapper}>
			<img className={style.office} src={office} alt="office" />

			<div className={style.spriteContainer}>
				{previousSprite && (
					<div className={`${style.spriteLayer} ${isFadingOut ? style.fadeOut : ''}`}>
						<Sprite
							sprite={previousSprite}
							frameWidth={256}
							frameHeight={256}
							columns={5}
							totalFrames={25}
							fps={10}
						/>
					</div>
				)}
				<div className={style.spriteLayer}>
					<Sprite
						sprite={currentSprite}
						frameWidth={256}
						frameHeight={256}
						columns={5}
						totalFrames={25}
						fps={10}
					/>
				</div>
			</div>
		</div>
	);
};

export default AgentOffice;