import { InputProps } from 'antd/lib/input'
import { Input as AntdInput, InputRef } from 'antd'
import React, {
	ChangeEventHandler,
	RefObject,
	useState,
	ChangeEvent
} from 'react'
import { useUpdateEffect } from '../../hooks'

export type TextInputProps = Omit<InputProps, 'size'> & {
	inputRef?: RefObject<InputRef>;
	size?: 'large' | 'small';
	onChange: (event: ChangeEvent<Element | HTMLInputElement>) => void;
	value: string;
};

export const TextInput = ({
	value,
	onChange,
	inputRef,
	size,
	className,
	style,
	...restProps
}: TextInputProps) => {
	const [internalValue, setInternalValue] = useState(value || '')

	useUpdateEffect(() => {
		setInternalValue(value || '')
	}, [value])

	const internalOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setInternalValue(e.target.value)
		onChange?.(e)
	}

	return (
		<AntdInput
			{...restProps}
			ref={inputRef}
			className={`text-input h-12 rounded-lg ${size || ''} ${className || ''}`}
			style={style}
			value={internalValue}
			onChange={internalOnChange}
		/>
	)
}
