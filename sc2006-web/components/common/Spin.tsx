import AntdSpin, { SpinProps as AntdSpinProps } from 'antd/lib/spin'
import React, { ReactNode } from 'react'

export interface SpinProps extends AntdSpinProps {
	center?: boolean;
	children?: ReactNode;
}

export function Spin ({ center, className, style, ...props }: SpinProps) {
	if (center) {
		if (!className) {
			className = ''
		}
		className += ' absolute top-1/2 left-1/2'
		className += ' justify-self-center self-center'
		if (!style) {
			style = {}
		}
		style = {
			...style,
			msTransform: 'translate(-50%, -50%)',
			transform: 'translate(-50%, -50%)'
		}
	}

	return <AntdSpin {...props} className={className} style={style} />
}

Spin.defaultProps = {
	size: 'default',
	spinning: true
}
