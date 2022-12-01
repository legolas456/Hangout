import React, { ReactNode, SVGAttributes } from 'react';

export interface IconBaseProps extends SVGAttributes<SVGElement> {
	children?: ReactNode;
	size?: string | number;
}

export const IconBase = ({ children, size, ...svgProps }: IconBaseProps) => (
	<svg
		stroke="currentColor"
		fill="currentColor"
		strokeWidth="0"
		{...svgProps}
		height={size || '1em'}
		width={size || '1em'}
		xmlns="http://www.w3.org/2000/svg"
	>
		{children}
	</svg>
);
