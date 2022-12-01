import React from 'react';
import { Timeline } from 'antd';
import { DemoApp } from './DemoApp';
import Image from 'next/image';

export const Demo = () => {
	return (
		<div className="h-full w-full space-y-2">
			<div className="h-screen w-full">
				<section className="flex flex-col items-center h-2/6 justify-center">
					<h1 className="text-7xl text-gray-700 left-1/2 font-mono animate-bounce">
						Hangout!
					</h1>
					<span className="w-full p-0.5 bg-blue-400 lg:w-1/3"></span>
				</section>
				<section className="flex flex-row items-center space-y-8 w-11/12 mx-auto h-1/2">
					<div className="w-7/12 h-full flex flex-row items-center justify-center relative">
						<Image src="/hangout.png" layout="fill" />
					</div>
					<div className="w-5/12 flex flex-col justify-center">
						<h1 className="text-5xl text-pink-400">
							Planning outings made simple.
						</h1>
						<p className="text-2xl">
							Find the place that best suits everyone&#39;s schedule,
							preferences, and is equidistant from everyone!{' '}
						</p>
					</div>
				</section>
			</div>

			<section className="flex flex-col space-y-8 items-center bg-gray-50">
				<h1 className="text-4xl text-sky-400 left-1/2 mt-8">
					Here&#39;s how it works
				</h1>
				<div className="w-full flex flex-row">
					<div className="w-1/2 flex flex-row items-center justify-center relative">
						<Image src="/outing.png" layout="fill" />
					</div>
					<Timeline
						className="w-1/2"
						style={{ padding: '4rem', paddingLeft: 0 }}
					>
						<Timeline.Item color="green" style={{ paddingBottom: '3rem' }}>
							<p className="text-xl">Tell us your preferences</p>
							<p>
								We will suggest 5 places for each of your common preference.
								Note that the app will complain if there are no common
								preferences among the participants!
							</p>
						</Timeline.Item>
						<Timeline.Item color="green" style={{ paddingBottom: '3rem' }}>
							<p className="text-xl">Tell us what your schedule looks like</p>
							<p>
								Let us know when you are busy, and our app will show the time
								ranges that everyone is free.
							</p>
						</Timeline.Item>
						<Timeline.Item color="green" style={{ paddingBottom: '3rem' }}>
							<p className="text-xl">Tell us your address</p>
							<p>
								We will calculate the central point from all participants&#39;
								addresses, then suggest places closest to that point.
							</p>
						</Timeline.Item>
						<Timeline.Item color="green" style={{ paddingBottom: '3rem' }}>
							<p className="text-xl text-green-700 italic">
								Get your ultimate hangout plan!
							</p>
						</Timeline.Item>
					</Timeline>
				</div>
			</section>
			<section className="flex flex-col space-y-8 items-center min-h-screen">
				<h1 className="text-4xl text-cyan-300 left-1/2 mt-8">Try it out!</h1>
				<DemoApp />
			</section>
		</div>
	);
};
