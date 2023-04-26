import {Composition} from 'remotion';
import {MyComposition} from './Composition';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={50 * 30}
				fps={30}
				width={1280}
				height={720}
			/>
		</>
	);
};
