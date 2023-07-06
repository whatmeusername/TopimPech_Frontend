import { MutableRefObject, forwardRef } from 'react';
import './StandardBreakLine.scss';

const StandardBreakLine = forwardRef((_, ref: any) => {
	return <hr className="break__line__standard" ref={ref} />;
});

StandardBreakLine.displayName = 'StandardBreakLine';

export { StandardBreakLine };
