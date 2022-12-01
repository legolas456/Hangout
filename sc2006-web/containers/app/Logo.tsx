import React from 'react';
import { ShareAltOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

export function Logo() {
	const router = useRouter();
	return (
		<div className="flex justify-start w-1/2 items-center px-10 text-black font-mono">
			<ShareAltOutlined className="pr-1" />
			<a className="text-black hover:text-black" onClick={() => router.push('/home')}>
				Hangout!
			</a>
		</div>
	);
}
