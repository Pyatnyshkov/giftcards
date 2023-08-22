import axios from 'axios';

export default function info(
	standalone_name: string,
	message: string,
	data: any,
) {
	axios.post('../api/v1/info', { standalone_name, message, data });
}
