import React, { ReactNode } from 'react';
import { Card } from '.';
import {
	CaretUpFilled,
	CaretDownFilled,
	DeleteOutlined,
} from '@ant-design/icons';

interface CollapseItemHeaderProps {
	icon?: ReactNode;
	title: string | number;
	isExpanded: boolean;
	onDelete?: (value?: any) => void;
}

export const CollapseItemHeader = ({
	icon,
	title,
	isExpanded,
	onDelete,
	...props
}: CollapseItemHeaderProps) => {
	const baseIconStyle = {
		fontSize: '1.25rem',
	};
	const className = isExpanded ? 'bg-cyan-100' : 'hover:bg-cyan-100';
	return (
		<Card
			className={`p-5 w-full ${className} flex flex-row justify-between items-center`}
		>
			<div className="w-5/6 flex flex-row items-center">
				{icon && <div className="flex flex-row items-center">{icon}</div>}
				{title}
			</div>
			<div className="flex flex-row space-x-2">
				{onDelete && (
					<DeleteOutlined
						style={baseIconStyle}
						onClick={(e) => {
							onDelete();
							e.stopPropagation();
						}}
						className="hover:text-red-500"
					/>
				)}
				{isExpanded ? (
					<CaretUpFilled style={baseIconStyle} />
				) : (
					<CaretDownFilled style={baseIconStyle} />
				)}
			</div>
		</Card>
	);
};
