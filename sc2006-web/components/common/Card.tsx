/* eslint-disable react/display-name */
import React, { CSSProperties, forwardRef, ReactNode } from 'react'
import { Spin } from '.'

export interface CardProps {
	id?: string;
	className?: string;
	style?: CSSProperties;
	children: ReactNode;
	loading?: boolean;
	onClick?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	highlightOnHover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
	const {
		children,
		id,
		className,
		style,
		loading,
		onClick,
		onMouseEnter,
		onMouseLeave,
		highlightOnHover
	} = props

	const hoverClassName =
		'border border-solid border-white transition hover:bg-sky-50 hover:border-sky-200'

	return (
		<div
			id={id}
			ref={ref}
			className={`relative bg-white rounded-lg ${
				onClick ? 'cursor-pointer' : ''
			} ${highlightOnHover ? hoverClassName : ''} ${className || ''}`}
			style={{
				boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.2)',
				...style
			}}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{loading && (
				<div className="absolute top-0 left-0 w-full h-full bg-white rounded-lg opacity-50 z-40">
					<Spin center />
				</div>
			)}
			{children}
		</div>
	)
})
