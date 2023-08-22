import axios from 'axios';
import urls from '../utils/urls';
import { ISettings } from '../models/settings';

const getSettings = async (standalone_name: string) => {
	// const response = await axios.post(urls.settings, {standalone_name});
	// if (response.data.err) {
	// 	throw new Error();
	// } else {
	// 	return response.data.data;
	// }
	return {
	    theme: {
	      "brand": "ucs",
	      "shop_name": "sephora",
	    },
	    "bin": "111888",
	    "denominals": [1000,12000,15000,20000,25000],
	    "bestseller_denominals": [2000,3000,5000,7000,10000]
	  };

};

export default getSettings;