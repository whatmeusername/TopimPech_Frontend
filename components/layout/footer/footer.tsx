import React, { ReactElement } from 'react';
import './footer.scss';

const COPYRIGHTS_LABEL =
	'Представленная информация на сайте носит чисто информационный смысл, ни при каких условиях информационные материалы и цены, размещенные на сайте, не являются публичной офертой. Подробную информацию уточняйте у продавца.';

function Footer(): ReactElement {
	return (
		<footer className="footer__wrapper">
			<div className="footer__content__wrapper"></div>
			<div className="footer__copyrights__wrapper">
				<div className="footer__copyrights">
					<p>{COPYRIGHTS_LABEL}</p>
					<p>2019-{new Date().getFullYear()} ©</p>
				</div>
			</div>
		</footer>
	);
}

export { Footer };
