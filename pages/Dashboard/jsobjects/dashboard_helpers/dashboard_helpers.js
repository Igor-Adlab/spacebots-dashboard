export default {
	getTotalIncomes(result) {
		return _.first(result)?.total || 0;
	},
	refreshDrilldown() {
		return Promise.all([
			get_selected_user_usage.run(),
			get_selected_user_invoices.run(),
		]);
	},
	getServiceStats(data) {
		return data.map(record => ({ y: record.sum, x: record.service }))
	},
	getWeeklyUsage() {
		const list = get_weekly_usage.data;
		function transformToChartData(record) {
			return { x: record.day, y: record.usage }
		}

		const result = {};
		const usageMap = _.chain(list)
			.map(record => ({ ...record, day: dayjs(record.day).format("DD-MM-YYYY") }))
			.keyBy('day').value();
		
		for(let i = 0; i < 7; i++) {
			const day = dayjs().subtract(i, 'days').format("DD-MM-YYYY");
			if(!!usageMap[day]) {
				result[day] = usageMap[day]
			} else {
				result[day] = { day, usage: 0 }
			}
		}

		return _.values(result).map(transformToChartData).reverse();
	},
}