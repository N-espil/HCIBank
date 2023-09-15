import { IonNav } from '@ionic/react';
import { useSession } from 'next-auth/react';
import DashBoard from './dashboard';
import Signup from './auth/native/signup';
import Signin from './auth/native/signin';
import { Capacitor } from '@capacitor/core';
import { useRouter } from 'next/router';
export default function Home() {
	const router = useRouter()
	const { data: session } = useSession()
	if (Capacitor.isNativePlatform()) {
		if (session) {
			return <IonNav root={() => <DashBoard />}></IonNav>;
		}
		return <IonNav root={() => <Signin />}></IonNav>;
	}
	else{
		router.push('/dashboard')
	}

}
