import Catalog from '../../../../components/CatalogPage/catalog';
import { ServerSideURLProps } from '../../../layout';
import { catalogGetServerSideProps } from '../page';

async function CatalogPage(context: ServerSideURLProps) {
	const { initData } = await catalogGetServerSideProps(context);
	return <Catalog initData={initData} />;
}

export default CatalogPage;
