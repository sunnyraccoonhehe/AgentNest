import office from '@assets/images/office.png'
import walk from '@assets/sprites/walk.png'
import work from '@assets/sprites/work.png'
import sleep from '@assets/sprites/sleep.png'
import deleteAnim from '@assets/sprites/delete.png'

import style from './AgentOffice.module.css'
import { Sprite } from './Sprite';
import { useEffect, useState } from 'react'



const AgentOffice: React.FC = () => {

	const [randomAnim, setRandom] = useState<number>(0);

	useEffect(() => {
		const interval = setInterval(() => {
			const n = Math.floor(Math.random() * 4);
			setRandom(n);
		}, 10000)
		return () => clearInterval(interval);
	}, []);

	const sprites = [walk, work, sleep, deleteAnim];
	const currentSprite = sprites[randomAnim];

	console.log(randomAnim);

	return (
		<>
		<Sprite
		sprite={currentSprite}
		frameWidth={256}
		frameHeight={256}
		columns={5}
		totalFrames={25}
		fps={10}
		/>
			{/* <img className={style['office']} src={office} alt='office' /> */}
		</>
	)
}

export default AgentOffice;