import PlanneryDesktop from './PlanneryDesktop';
import PlanneryMobile from './PlanneryMobile';

type PlanneryProps = {
	isMobile?: boolean;
};

function Plannery({ isMobile }: PlanneryProps) {
	return isMobile 
	? (<PlanneryMobile/>)
	: (<PlanneryDesktop/>)
}

export default Plannery;