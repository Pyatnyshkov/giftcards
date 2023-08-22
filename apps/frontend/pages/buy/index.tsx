// @ts-ignore
import parseData from 'urlencoded-body-parser';
import { GetServerSideProps } from 'next';

import Buy from '../../components/Buy/';

import getSettings 		from '../../helpers/getSettings';
import getConfig 		from '../../helpers/getConfig';
import getLocalization 	from '../../helpers/getLocalization';

export interface IndexProps {
	error?: string;
}

const Index = (props: IndexProps) => {
	if (props.error) return <div>Error</div>;
	return <Buy />;
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	res,
	query,
}) => {
	let reqData;
	if (req.method === 'POST') {
		reqData = await parseData(req);
	} else if (req.method === 'GET') {
		reqData = query;
	} else {
		res.writeHead(500).end();
	}
	const standaloneName = reqData.Shop_IDP;
	let language = reqData.language;
	const allowLanguages = ['ru', 'en'];
	if (!language || !allowLanguages.includes(language)) {
		language = 'ru';
	}
	try {
		const settings = await getSettings(standaloneName);
		const config = getConfig(settings.theme, 'config');
		const dictionary = getConfig(settings.theme, 'l10n');
		const localization = getLocalization(dictionary, language);

		return {
			props: {
				initialState: {
					reqData,
					settings,
					config,
					localization,
				},
			},
		};
	} catch (e) {
		console.log(e);
		return {
			props: { error: 'error' },
		};
	}
};

export default Index;
