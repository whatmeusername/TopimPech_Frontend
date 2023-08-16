'use client';

import { useState } from 'react';
import './OrderCancelElement.scss';
import axios from 'axios';
import Link from 'next/link';

interface OrderCancelData {
	OrderToken: string;
	name: string;
	totalSum: number;
	create: string;
}

function OrderCancelElement({ orderData }: { orderData: OrderCancelData }) {
	const [isCanceled, setCancled] = useState(false);

	const cancelOrder = () => {
		if (!isCanceled) {
			setCancled(true);
			axios({
				method: 'POST',
				url: '/api/order/cancel',
				data: { token: orderData.OrderToken },
			});
		}
	};

	if (!isCanceled) {
		return (
			<div className="order__cancel__page__wrapper">
				<h1 className="order__cancel__header">Отмена заказа</h1>
				<p className="order__cancel__info">
					<span className="order__cancel__info__bold">{orderData.name}</span>, вы собираетесь отменить ваш заказ от{' '}
					<span className="order__cancel__info__bold">{new Date(orderData.create).toLocaleDateString('ru')}</span> на сумму{' '}
					<span className="order__cancel__info__bold">{orderData.totalSum.toLocaleString()} руб.</span> Данное действие нельзя будет отменить.
				</p>
				<button className="order__cancel__button" onClick={cancelOrder}>
					Отменить заказ
				</button>
			</div>
		);
	} else {
		return (
			<div className="order__cancel__page__wrapper">
				<h1 className="order__cancel__header">Заказ отменен</h1>
				<p className="order__cancel__info">
					<span className="order__cancel__info__bold">{orderData.name}</span>, ваш заказ от{' '}
					<span className="order__cancel__info__bold">{new Date(orderData.create).toLocaleDateString('ru')}</span> на сумму{' '}
					<span className="order__cancel__info__bold">{orderData.totalSum.toLocaleString()} руб</span> был отменен.
				</p>
				<Link href={'/'} className="order__cancel__button" onClick={cancelOrder}>
					На главную страницу
				</Link>
			</div>
		);
	}
}

export { OrderCancelElement };
