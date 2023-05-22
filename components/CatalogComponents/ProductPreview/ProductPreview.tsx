import useToggle from '../../../hooks/useToggle';
import useWindowSize from '../../../hooks/useWindowSize';
import './ProductPreview.scss';

function ProductPreviewModal() {}

function ProductPreview() {
	const { width } = useWindowSize();
	const [toggle, setToggle] = useToggle();

	if (width && width <= 768) return null;

	return (
		<>
			<button
				className="product__preview"
				onClick={(e: React.MouseEvent) => {
					e.preventDefault();
					e.stopPropagation();
					setToggle(true);
				}}
			>
				Предпросмотр
			</button>
		</>
	);
}

export { ProductPreview };
