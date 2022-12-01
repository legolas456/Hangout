import { BellOutlined, BellFilled } from '@ant-design/icons';
import { Badge } from 'antd';

interface NotificationBellProps {
	isClicked: boolean;
	onClick: () => void;
	count: number;
}

export const NotificationBell = ({
	isClicked,
	onClick,
	count,
}: NotificationBellProps) => {
	return (
		<button
			className={`flex flex-row justify-center items-center hover:text-emerald-400 ${
				isClicked ? 'text-emerald-400' : ''
			}`}
			style={{ fontSize: '120%' }}
			onClick={onClick}
		>
			<Badge count={count} size="small">
				{isClicked ? <BellFilled /> : <BellOutlined />}
			</Badge>
		</button>
	);
};
