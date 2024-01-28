import { ReactElement } from 'react';
import { WhatsappColorIcon, WhatsappIcon } from '../../IconsElements';

import './WhatsappLink.scss';

function WhatsappLink({ phoneNumber, grayScale }: { phoneNumber: string; grayScale?: boolean }): ReactElement {
	return (
		<a
			href={`https://wa.me/${phoneNumber}`}
			className="whatsapp__link"
			target="_blank"
			rel="noopener noreferrer"
			title={`Перейти в чат ватцап с ${phoneNumber}`}
		>
			{grayScale ? <WhatsappIcon className="whatsapp__link__icon" /> : <WhatsappColorIcon className="whatsapp__link__icon" />}
		</a>
	);
}

export { WhatsappLink };
