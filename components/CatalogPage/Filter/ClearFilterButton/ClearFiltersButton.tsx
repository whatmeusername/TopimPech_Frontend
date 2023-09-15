import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const ClearFiltersButton = ({ onClick }: { onClick?: () => void }): JSX.Element => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = new URLSearchParams(useSearchParams() as any);

	return (
		<button
			className="filter__clear__button filter__modal__button"
			onClick={() => {
				window.scrollTo({ behavior: 'smooth', top: 0, left: 0 });
				searchParams.delete('filter');
				router.push(pathname + '?' + searchParams.toString());
				if (onClick) onClick();
			}}
		>
			Очистить фильтры
		</button>
	);
};

export { ClearFiltersButton };
