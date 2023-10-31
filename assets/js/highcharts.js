// Data retrieved from https://netmarketshare.com/
// Make monochrome colors
const colors = Highcharts.getOptions().colors.map((c, i) =>
	// Start out with a darkened base color (negative brighten), and end
	// up with a much brighter color
	Highcharts.color(Highcharts.getOptions().colors[0])
		.brighten((i - 3) / 7)
		.get()
);

// Build the chart
Highcharts.chart('highchart-revenue', {
	chart: {
		plotBackgroundColor: null,
		plotBorderWidth: null,
		plotShadow: false,
		type: 'pie'
	},
	title: {
		text: 'PRX Revenue',
		align: 'left'
	},
	tooltip: {
		pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	},
	accessibility: {
		point: {
			valueSuffix: '$'
		}
	},
	plotOptions: {
		pie: {
			allowPointSelect: true,
			cursor: 'pointer',
			colors,
			borderRadius: 5,
			dataLabels: {
				enabled: true,
				format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
				distance: -50,
				filter: {
					property: 'percentage',
					operator: '>',
					value: 4
				}
			}
		}
	},
	series: [{
		name: 'Revenue',
		data: [
			{ name: 'Underwriting', y: 12801442 },
			{ name: 'Operating Activities', y: 11567053 },
			{ name: 'Grants', y: 4729519 },
			{ name: 'Individual Grants', y: 1641345 },
			{ name: 'Other', y: 1325191 }
		]
	}]
});

Highcharts.chart('highchart-expense', {
	chart: {
		plotBackgroundColor: null,
		plotBorderWidth: null,
		plotShadow: false,
		type: 'pie'
	},
	title: {
		text: 'PRX Expenses',
		align: 'left'
	},
	tooltip: {
		pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	},
	accessibility: {
		point: {
			valueSuffix: '%'
		}
	},
	plotOptions: {
		pie: {
			allowPointSelect: true,
			cursor: 'pointer',
			colors,
			borderRadius: 5,
			dataLabels: {
				enabled: true,
				format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
				distance: -50,
				filter: {
					property: 'percentage',
					operator: '>',
					value: 4
				}
			}
		}
	},
	series: [{
		name: 'Expenses',
		data: [
			{ name: 'Support for Creators', y: 15061154 },
			{ name: 'Content Production and Distribution', y: 19388411 },
			{ name: 'Administrative', y: 2845813 },
			{ name: 'Fundraising', y: 1519341 }
		]
	}]
});