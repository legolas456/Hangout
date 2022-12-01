import React, { CSSProperties, ReactNode } from 'react'

export interface InputLabelProps {
	className?: string;
	style?: CSSProperties;
	required?: boolean;
	optional?: boolean;
	assistiveText?: string;
	nextLineAssistiveText?: ReactNode;
	children: ReactNode;
}

export const InputLabel = ({
	className,
	style,
	required,
	optional,
	assistiveText,
	nextLineAssistiveText,
	children
}: InputLabelProps) => (
	<div className={`mb-2 font-semibold ${className || ''}`} style={style}>
		{children}
		{assistiveText
			? (
				<>
				&nbsp;
					<small className="font-normal italic leading-none">
					({assistiveText})
					</small>
				</>
			)
			: (
				<>
					{optional && (
						<>
						&nbsp;
							<small className="font-normal italic leading-none">
							(optional)
							</small>
						</>
					)}
					{required && (
						<>
						&nbsp;
							<small className="font-normal italic leading-none">
							(required)
							</small>
						</>
					)}
				</>
			)}
		{nextLineAssistiveText && (
			<div>
				<small className="font-normal italic">{nextLineAssistiveText}</small>
			</div>
		)}
	</div>
)
