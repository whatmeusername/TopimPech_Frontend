import { GetServerSidePropsContext } from 'next';

import { catalogGetServerSideProps } from '../index';
import { PagePropsContext } from '../../../_app';
import Catalog from '../../../../components/CatalogPage/catalog';
import { initData } from '../../../../components/CatalogPage/catalog/interface';

function CatalogPage({ initData }: { initData: initData }) {
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
