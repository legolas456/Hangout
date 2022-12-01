import Input, { PasswordProps } from 'antd/lib/input'
import React, { ChangeEventHandler, useState } from 'react'
import { useUpdateEffect } from '../../hooks'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

export type PasswordInputProps = Omit<PasswordProps, 'size'> & {
	value: string;
};

export const PasswordInput = ({
	value,
	onChange,
	className,
	iconRender,
	...restProps
}: PasswordInputProps) => {
	const [internalValue, setInternalValue] = useState(value || '')

	useUpdateEffect(() => {
		setInternalValue(value || '')
	}, [value])

	const internalOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setInternalValue(e.target.value)
		onChange?.(e)
	}

	return (
		<Input.Password
			{...restProps}
			className={`h-12 rounded-lg ${className || ''}`}
			iconRender={
				iconRender ||
				((visible: boolean) =>
					`${internalValue}`.length === 0
						? (
							<></>
						)
						: visible
							? (
								<EyeInvisibleOutlined size={16} />
							)
							: (
								<EyeOutlined size={16} />
							))
			}
			value={internalValue}
			onChange={internalOnChange}
		/>
	)
}

PasswordInput.defaultProps = {
	maxLength: 20
}
