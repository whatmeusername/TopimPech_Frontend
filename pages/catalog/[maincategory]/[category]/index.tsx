import { createContext, useContext } from 'react';

import Catalog, { initData as initDataInterface } from '../../../../components/CatalogPage/catalog/catalog';
import { GetServerSidePropsContext } from 'next';

import { catalogGetServerSideProps } from '../index';
import { PagePropsContext } from '../../../_app';

function CatalogPage({ initData }: { initData: initDataInterface }) {
	return (
		<PagePropsContext.Provider value={initData}>
			<Catalog initData={initData} />
		</PagePropsContext.Provider>
	);
}

export default CatalogPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	return catalogGetServerSideProps(context);
};
