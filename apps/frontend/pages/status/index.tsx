import { GetServerSideProps } from 'next';
import axios from 'axios';
import urls from '../../utils/urls';

const Index = () => null;

export const getServerSideProps: GetServerSideProps = async ({
	req,
	res,
	query,
}) => {
	if (req.method == 'GET' && query.Shop_IDP && query.Order_IDP) {
		const getStatusData = {
			standalone_name: query.Shop_IDP,
			orderNumber: query.Order_IDP,
		};
		try {
			const response = await axios.post(urls.status, getStatusData);
			if (response.data.err === 0) {
				const status_json = {
					Order_IDP: query.Order_IDP,
					Status: response.data.data.status,
					Signature: response.data.data.signature,
				};
				res.end(status_json);
			} else {
				res.end('Error get status');
			}
		} catch (e) {
			console.log(e)
			res.end('Error');
		}
	} else {
		res.end('Wrong request');
	}
	return {
		props: {}
	}
};

export default Index;
