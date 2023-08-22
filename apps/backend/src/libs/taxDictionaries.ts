interface ITaxDictionaries {
	[key: string]: {
		[key: number]: string
	}
}

const taxDictionaries: ITaxDictionaries = {}

taxDictionaries.taxmode = {
	0: 'general',
	1: 'simple_income',
	2: 'simple_profit',
	3: 'imputed_income',
	4: 'unified_agricultural',
	5: 'patent'
}

taxDictionaries.vat = {
	120: '20/120',
	110: '10/110'
}

taxDictionaries.payattr = {
	1: 'full_prepayment',
	2: 'partial_prepayment',
	3: 'advance',
	4: 'full_payment',
	5: 'partial_payment',
	6: 'credit',
	7: 'credit_payment'
}

taxDictionaries.lineattr = {
	1: 'commodity',
	2: 'excise',
	3: 'job',
	4: 'service',
	5: 'gambling_bet',
	6: 'gambling_win',
	7: 'lottery_bet',
	8: 'lottery_win',
	9: 'intellectual_activity',
	10: 'payment',
	11: 'agent_commission',
	12: 'composite',
	13: 'other',
}

export default taxDictionaries;
