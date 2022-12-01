import React, { useContext } from 'react';
import { Form } from 'antd';
import { meService } from '../services';
import { GlobalContext } from '../contexts/';
import { useRouter } from 'next/router';
import { AuthForm, AuthFormType } from '../components/auth';
import { useNotification } from '../hooks';

interface LoginForm {
	email: string;
	password: string;
}

const Login = () => {
	const [form] = Form.useForm<LoginForm>();
	const { setMe } = useContext(GlobalContext);
	const router = useRouter();
	const notification = useNotification();
	const { postLoginPath } = useContext(GlobalContext);
	const onSubmit = async (form: LoginForm) => {
		const { email, password } = form;
		try {
			const user = await meService.login({ username: email, password });
			await router.push(postLoginPath);
			setMe(user);
		} catch (e: any) {
			notification.apiError(e);
		}
	};

	return <AuthForm type={AuthFormType.LOGIN} onSubmit={onSubmit} form={form} />;
};

export default Login;
