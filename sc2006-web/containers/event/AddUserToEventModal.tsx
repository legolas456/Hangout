import { Modal, ModalProps, Form } from 'antd';
import { Me } from '../../contexts';
import { TextInput } from '../../components/common';
import { DbUserRes, Regex } from '../../types/constants';
import { userService } from '../../services';
import { useNotification } from '../../hooks';

type AddUserToEventModalProps = Omit<ModalProps, 'onOk'> & {
	onOk: (email: string, user: DbUserRes) => void;
	addedParticipants: Set<string>;
};

export const AddUserToEventModal = ({
	onOk,
	onCancel,
	addedParticipants,
	...modalProps
}: AddUserToEventModalProps) => {
	const notification = useNotification();
	const [form] = Form.useForm();
	const { getFieldValue, setFieldValue, validateFields } = form;

	const formInitialValues = {
		email: '',
	};
	return (
		<Modal
			title="Add A User By Email"
			onOk={async () => {
				try {
					await validateFields();
					const email = getFieldValue('email');
					if (addedParticipants.has(email)) {
						notification.warning(
							`User ${email} is already added to this Event`,
							'User already added',
						);
						return;
					}
					const { user } = await userService.getUser(email);
					onOk(email, user!);
					setFieldValue('email', '');
				} catch (e: any) {
					// If it is a PresentableError
					if (e.level) {
						notification.apiError(e);
					} else {
						notification.error(e.message, 'Invalid Email Input');
					}
				}
			}}
			onCancel={onCancel}
			destroyOnClose
			{...modalProps}
		>
			<Form form={form} initialValues={formInitialValues}>
				<Form.Item
					name="email"
					rules={[
						{
							required: true,
							message: 'Email cannot be empty',
						},
						{
							pattern: Regex.EMAIL,
							message: 'Invalid email entered',
						},
					]}
				>
					<TextInput
						value={getFieldValue('email')}
						onChange={(e: any) => setFieldValue('email', e.target.value)}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};
