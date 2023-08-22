import { GetServerSideProps } from 'next';
// @ts-ignore
import parseData from 'urlencoded-body-parser';
import axios from 'axios';
import urls from '../../utils/urls';

const Index = () => null;

const checkData = (data: any) => {
	return (
		data.Shop_IDP &&
		data.Order_IDP &&
		data.Status &&
		data.Receipt &&
		data.Signature
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	res,
	query,
}) => {
	if (req.method == 'POST') {
		const reqData = await parseData(req);
		if (checkData(reqData)) {
			const confirmData = {
				standalone_name: reqData.Shop_IDP,
				orderNumber: reqData.Order_IDP,
				status: reqData.Status,
				receipt: reqData.Receipt,
				signature: reqData.Signature,
			};
			try {
				const response = await axios.post(urls.confirm, confirmData);
				if (response.data.err === 0) {
					res.end({ result: "success", code: 200, msg: "success" });
				} else {
					res.end({
						result: "fail",
						code: response.data.err || 500,
						msg: response.data.msg || "server error",
					});
				}
			} catch (e) {
				res.end({ result: "failed", code: 500, msg: "server error" });
			}
		} else {
			res.end({ result: "fail", code: 500, msg: "wrong request" });
		}
	} else {
		res.end({ result: "fail", code: 500, msg: "wrong request" });
	}
	return {
		props: {}
	}
};

export default Index;
