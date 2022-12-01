import React from 'react';
import { Form } from 'antd';
import { meService } from '../services';
import { useRouter } from 'next/router';
import { AuthForm, AuthFormType } from '../components/auth/';
import { useNotification } from '../hooks';

interface SignupForm {
	email: string;
	password: string;
}

const Login = () => {
	const [form] = Form.useForm<SignupForm>();
	const notification = useNotification();
	const router = useRouter();

	const onSubmit = async (form: SignupForm) => {
		const { email, password } = form;
		try {
			await meService.signup({ username: email, password });
			// toast notification you have signed up
			await router.push('/login');
			notification.success('You have successfully signed up!');
		} catch (e: any) {
			// toast notification
			notification.apiError(e);
		}
	};
	return (
		<AuthForm form={form} onSubmit={onSubmit} type={AuthFormType.SIGNUP} />
	);
};

export default Login;
