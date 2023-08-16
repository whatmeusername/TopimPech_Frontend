'use client';

import { ReactElement } from 'react';
import { JsonDataMap } from '../../Shared/JsonDataMap/JsonDataMap';
import { PrimaryPageHeader } from '../../Shared/PrimaryPageHeader/PrimaryPageHeader';

import './PrivacyElements.scss';

function PrivacyPolicyElement({ privacyPolicyData }: { privacyPolicyData: any }): ReactElement {
	return (
		<div className="policy__page__wrapper">
			<PrimaryPageHeader header={'Политика конфиденциальности'} />
			<div className="policy__page__content__wrapper">
				<JsonDataMap data={privacyPolicyData} />
			</div>
		</div>
	);
}

export default PrivacyPolicyElement;
