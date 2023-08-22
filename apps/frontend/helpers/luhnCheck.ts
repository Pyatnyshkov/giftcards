export default function luhnCheck(num: string) {
	if (num.length < 12) {
		return false;
	}
	let sum = 0;
	for (let i = 0; i < num.length; i++) {
		let p = Number(num.charAt(num.length - i - 1));
		if (i % 2 !== 0) {
			p = 2 * p;
			if (p > 9) {
				p = p - 9;
			}
		}
		sum = sum + p;
	}
	return (sum % 10 === 0);
};