import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, ChartData, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './PriceHistoryChart.scss';
import { ReactElement, useEffect, useState } from 'react';
import { ProductData, ProductPriceHistory } from '../Cards/interface';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const ConvertDateToLocale = (date: string): string => {
	return new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' });
};

const getLabels = (priceHistory: ProductPriceHistory[]) => {
	const result = [];
	for (let i = 0; i < priceHistory.length; i++) {
		const current = priceHistory[i];
		if (i === 0) {
			result.push(ConvertDateToLocale(current.date));
		} else {
			const prev = priceHistory[i - 1];
			result.push(`${ConvertDateToLocale(prev.date)} - ${ConvertDateToLocale(current.date)}`);
		}
	}
	return result;
};

function PriceHistoryChart({ product }: { product: ProductData }): ReactElement | null {
	if (product.priceHistory?.length < 2) return null;

	const [isLoaded, setLoaded] = useState<boolean>(false);

	useEffect(() => {
		setLoaded(true);
	}, []);

	if (!isLoaded) {
		return <div className="product__page__product__price__history__chart__skeleton" />;
	}

	const ProductHistoryPrice = product.priceHistory.sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1));

	const firstPrice = ProductHistoryPrice[0].price.toLocaleString();
	const currentPrice = ProductHistoryPrice[ProductHistoryPrice.length - 1].price.toLocaleString();

	// GETTING CSS VARIABLES
	const computedStyle = getComputedStyle(document.body);
	const orangeColor = computedStyle.getPropertyValue('--orange-color');
	const standardColor = computedStyle.getPropertyValue('--standard-color');
	const primaryColor = computedStyle.getPropertyValue('--primary-color');

	// GETTING GRADIENT FOR CHART BG
	const gradient = (document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D).createLinearGradient(0, 0, 0, 400);
	gradient.addColorStop(0, 'rgba(238,115,14, 0.25)');
	gradient.addColorStop(0.4, 'rgba(255,255,255,0.1)');

	const data: ChartData<'line', number[], string> = {
		labels: getLabels(ProductHistoryPrice),
		datasets: [
			{
				data: ProductHistoryPrice.map((p) => p.price),
				borderColor: orangeColor,
				backgroundColor: gradient,
				fill: true,
				cubicInterpolationMode: 'monotone',
				tension: 0.4,
				pointBackgroundColor: orangeColor,
			},
		],
	};

	const options: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			intersect: false,
		},
		scales: {
			y: {
				beginAtZero: true,
				display: false,
			},
			x: {
				display: false,
			},
		},
		plugins: {
			tooltip: {
				displayColors: false,
				backgroundColor: 'rgb(250, 250, 250)',
				borderColor: primaryColor,
				borderWidth: 2,
				titleColor: primaryColor,
				titleFont: { family: 'MuseoCyrl' },
				titleMarginBottom: 0,
				bodyColor: standardColor,
				callbacks: {
					label: (tooltipItems: any) => {
						return `цена: ${tooltipItems.formattedValue} ₽`;
					},
				},
			},
		},
	};

	return (
		<div className="product__page__product__price__history__chart">
			<div className="product__page__product__price__history__chart__head">
				<h3 className="product__page__product__price__history__chart__history_header">История цен</h3>
				<p className="product__page__product__price__history__chart__history_price">
					от {firstPrice} ₽ до {currentPrice} ₽
				</p>
			</div>
			<div className="product__page__product__price__history__chart__wrapper" style={{ height: '150px' }}>
				<Line data={data} options={options} />
			</div>
			<div className="product__page__product__price__history__chart__dates">
				<p className="product__page__product__price__history__chart__date">{ConvertDateToLocale(ProductHistoryPrice[0].date)}</p>
				<p className="product__page__product__price__history__chart__date">
					{ConvertDateToLocale(ProductHistoryPrice[ProductHistoryPrice.length - 1].date)}
				</p>
			</div>
		</div>
	);
}

export { PriceHistoryChart };
