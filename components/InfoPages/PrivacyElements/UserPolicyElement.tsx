'use client';

import { ReactElement } from 'react';
import { JsonDataMap } from '../../Shared/JsonDataMap/JsonDataMap';
import { PrimaryPageHeader } from '../../Shared/PrimaryPageHeader/PrimaryPageHeader';

import './PrivacyElements.scss';

function UserPolicyElement({ userPolicyData }: { userPolicyData: any }): ReactElement {
	return (
		<div className="policy__page__wrapper">
			<PrimaryPageHeader header={'Пользовательское соглашение'} />
			<div className="policy__page__content__wrapper">
				<JsonDataMap data={userPolicyData} />
			</div>
		</div>
	);
}

export default UserPolicyElement;
