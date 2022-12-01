import React, { CSSProperties } from 'react';
import { IconBase } from '.';

export interface GreetingHeaderProps {
	now: Date;
	name: string;
	className?: string;
	style?: CSSProperties;
	nameClassName?: string;
}

export const GreetingHeader = ({
	now,
	name,
	className,
	style,
	nameClassName,
}: GreetingHeaderProps) => {
	const timePeriod = getTimePeriod(now);

	return (
		<h1 className={className} style={style}>
			{timePeriod === 'evening' ? (
				<div className="bg-black">
					<EveningSvg size={48} />
				</div>
			) : (
				<MorningAfternoonSvg size={48} />
			)}{' '}
			<div className="pl-4 flex flex-row">
				Good {timePeriod}, <div className={nameClassName}>{name}</div>!
			</div>
		</h1>
	);
};

export const MorningAfternoonSvg = ({ size }: { size: number }) => (
	<IconBase size={size} className="align-text-bottom">
		<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
			<g fill="none" fillRule="evenodd">
				<g>
					<g transform="translate(-130 -123) translate(130 123)">
						<circle cx="19.5" cy="19.5" r="15.5" fill="#FFC405" />
						<path
							fill="#FFF"
							stroke="#FFF4D1"
							d="M35 19.5c2.623 0 4.998 1.063 6.718 2.782C43.437 24.002 44.5 26.377 44.5 29c0 1.705-.45 3.305-1.236 4.689.789 1.6 1.236 2.904 1.236 4.311h0v3c0 .966-.392 1.841-1.025 2.475-.634.633-1.509 1.025-2.475 1.025h0-29c-1.795 0-3.42-.728-4.596-1.904C6.228 41.42 5.5 39.795 5.5 38s.728-3.42 1.904-4.596C8.58 32.228 10.205 31.5 12 31.5h5.788c1.502-2.402 4.17-4 7.212-4 1.03-2.585 2.285-4.514 3.993-5.88 1.656-1.325 3.739-2.12 6.007-2.12z"
						/>
					</g>
				</g>
			</g>
		</svg>
	</IconBase>
);

export const EveningSvg = ({ size }: { size: number }) => (
	<IconBase size={size} className="align-text-bottom">
		<svg viewBox="0 0 48 49" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<filter
					id="j7mcjzvpja"
					width="162.1%"
					height="161.8%"
					x="-34.3%"
					y="-34%"
					filterUnits="objectBoundingBox"
				>
					<feMorphology
						in="SourceAlpha"
						operator="dilate"
						radius="1"
						result="shadowSpreadOuter1"
					/>
					<feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
					<feGaussianBlur
						in="shadowOffsetOuter1"
						result="shadowBlurOuter1"
						stdDeviation="3"
					/>
					<feComposite
						in="shadowBlurOuter1"
						in2="SourceAlpha"
						operator="out"
						result="shadowBlurOuter1"
					/>
					<feColorMatrix
						in="shadowBlurOuter1"
						values="0 0 0 0 1 0 0 0 0 0.768627451 0 0 0 0 0.0196078431 0 0 0 0.4 0"
					/>
				</filter>
				<path
					id="qzz1k9yafb"
					d="M33.442 6.001C38.612 9.56 42 15.518 42 22.267 42 33.165 33.165 42 22.267 42c-6.75 0-12.707-3.389-16.266-8.558 3.178 2.186 7.026 3.466 11.174 3.466 10.898 0 19.733-8.835 19.733-19.733 0-4.13-1.269-7.964-3.438-11.132z"
				/>
			</defs>
			<g fill="none" fillRule="evenodd">
				<g>
					<g transform="translate(-130 -121) translate(130 122)">
						<use
							fill="#000"
							filter="url(#j7mcjzvpja)"
							xlinkHref="#qzz1k9yafb"
						/>
						<path
							fill="#FFF"
							stroke="#FFF4D1"
							d="M31.427 4.26c.805.404 1.582.861 2.325 1.37 5.272 3.606 8.748 9.716 8.748 16.637 0 5.587-2.265 10.645-5.926 14.307-3.662 3.661-8.72 5.926-14.307 5.926-6.92 0-13.03-3.474-16.677-8.774-.521-.756-.989-1.546-1.4-2.363.66.606 1.361 1.163 2.095 1.668 3.097 2.13 6.848 3.377 10.89 3.377 5.31 0 10.119-2.153 13.6-5.634 3.48-3.48 5.633-8.288 5.633-13.6 0-4.024-1.237-7.76-3.35-10.849-.495-.722-1.04-1.412-1.63-2.064z"
						/>
					</g>
				</g>
			</g>
		</svg>
	</IconBase>
);

const getTimePeriod = (date: Date) => {
	const hours = date.getHours();
	if (hours > 17) return 'evening';
	if (hours > 12) return 'afternoon';
	return 'morning';
};
