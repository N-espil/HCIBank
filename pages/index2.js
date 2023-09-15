import { IonNav } from '@ionic/react';
import { useSession } from 'next-auth/react';
import DashBoard from './dashboard';
import Signup from './auth/native/signup';
import Signin from './auth/native/signin';

export default function Home() {
	return <IonNav root={() => <DashBoard />}></IonNav>;

}
