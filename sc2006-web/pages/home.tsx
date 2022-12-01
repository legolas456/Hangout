import type { NextPage } from 'next';
import { useContext } from 'react';
import { Home } from '../containers/home/home';
import { Demo } from '../containers/home/demo';
import { GlobalContext } from '../contexts';

const HomePage: NextPage = () => {
	const { me } = useContext(GlobalContext);
	return me ? <Home me={me} /> : <Demo />;
};

export default HomePage;
