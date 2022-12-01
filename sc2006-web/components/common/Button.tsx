import AntdButton, { ButtonProps as AntButtonProps } from 'antd/lib/button'
import { Spin } from '.'
import React from 'react'

// type ButtonType = 'primary' | 'secondary' | 'danger-outline' | 'text';

// export type ButtonProps = Omit<AntButtonProps, 'type'> & {
// 	type?: ButtonType;
// 	loading?: boolean;
// };

export type ButtonProps = AntButtonProps & {
	loading?: boolean;
};

export const Button = ({
	className,
	style,
	size,
	loading,
	children,
	type,
	icon,
	disabled,
	...props
}: ButtonProps) => {
	// const classNames = {
	// 	primary:
	// 		'button-solid bg-primary border-primary text-white hover:bg-sky-400 hover:border-sky-50 active:bg-primary active:border-primary active:shadow-inner-md',
	// 	secondary:
	// 		'button-outline bg-white border-primary text-primary hover:bg-purple-20 active:shadow-inner-md',
	// 	'danger-outline':
	// 		'button-outline text-red-40 bg-white border-red-40 hover:bg-red-40 hover:text-white active:shadow-inner-md',
	// 	text: 'button-text text-primary bg-transparent hover:text-purple-40 active:text-purple-50',
	// };

	if (!type) {
		type = 'primary'
	}

	// const typeToUse =
	// 	type === 'danger-outline' ? 'ghost' : type === 'text' ? 'text' : 'primary';

	if (!size) {
		size = 'middle'
	}

	// const sizeClassName = size === 'small' ? 'text-sm' : 'text-base'

	// let processedClassName = `box-border px-4 rounded-lg  font-semibold ${
	// 	classNames[type]
	// } ${sizeClassName} ${className || ''}`;

	if (loading) {
		// processedClassName = `${processedClassName} opacity-50`;
		icon = <Spin className={size === 'small' ? 'small' : ''} size="small" />
		disabled = true
	}

	let height = 48
	if (size === 'large') {
		height = 56
	} else if (size === 'small') {
		height = 36
	}

	return (
		<AntdButton
			{...props}
			className={className}
			style={{ height, ...style }}
			disabled={disabled}
			type={type}
			size={size}
			icon={undefined}
			loading={false}
		>
			<div className="flex justify-center items-center h-full">
				<div
					className={`flex justify-center ${
						size === 'small' ? 'text-xs' : 'text-sm'
					}`}
				>
					{icon}
				</div>
				<div className={icon ? 'ml-2' : ''}>{children}</div>
			</div>
		</AntdButton>
	)
}

Button.defaultProps = {
	type: 'primary',
	size: 'middle'
}
