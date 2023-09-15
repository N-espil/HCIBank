import { useState } from 'react';
import SignIn from '../../components/web/auth/Signin';
import SignUp from '../../components/web/auth/Signup';
import Head from 'next/head';

export default function Auth() {
    const [showSignIn, setShowSignIn] = useState(true);

    function toggleSignInUp() {
        setShowSignIn((prev) => !prev);
    }
    

    return (

        <div className="flex items-center w-screen h-screen bg-neutral">
            <Head>
                <title>Login</title>
            </Head>
            <div
                className={`absolute w-full h-full transition-all ${showSignIn ? 'translate-x-full' : 'translate-x-0'}`}>
                <SignUp toggleSignInUp={toggleSignInUp} />
            </div>
            <div
                className={`absolute w-full h-full transition-all ${showSignIn ? 'translate-x-0' : '-translate-x-full'}`}>
                <SignIn toggleSignInUp={toggleSignInUp} />
            </div>

        </div>


    );
}
