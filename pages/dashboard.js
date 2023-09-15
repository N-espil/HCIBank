import Head from 'next/head'
import useSWR from 'swr'
import { Capacitor } from '@capacitor/core'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"
import { IonNavLink, IonIcon } from '@ionic/react';
import { WEB_URL } from '../util/keys'

import TransactionsNative from '../components/native/Transactions'
import FamilyNative from '../components/native/Family'
import PaymentsNative from '../components/native/Payments'
import Wallet from '../components/native/Wallet'
import Chatbot from '../components/native/Chatbot'
import HomeNative from '../components/native/Home'

import HomeWeb from '../components/web/Home'
import FamilyWeb from '../components/web/Family'
import PaymentsWeb from '../components/web/Payments'
import TransactionsWeb from '../components/web/Transactions'

import { Text } from "@nextui-org/react";

import { homeSharp, wallet, reader, chatbubbleEllipses, card, logOut, logOutOutline } from 'ionicons/icons';
import { HiUserGroup } from 'react-icons/hi';
import Loader from '../components/Loader'

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter();
    if (status == "unauthenticated" || !session) {
        if (Capacitor.isNativePlatform())
            router.push("/")
        else
            router.push("/auth")
    }


    const fetcher = (url) => fetch(url).then(res => res.json())

    const { data, error, isLoading, mutate: balMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getBalance?id=${session?.user.id}`, fetcher)

    const { data: payments, error: error2, isLoading: isLoading2, mutate: paymentMutate } = useSWR(`${WEB_URL}/api/planetscale/user/getPayments?id=${session?.user.id}`, fetcher);

    if (isLoading || !data || isLoading2 || !payments)
        return <Loader></Loader>

    if (Capacitor.isNativePlatform())
        return <NativeView session={session} balance={data.balance} balMutate={balMutate} payments={payments} />

    return <WebView session={session} balance={data.balance} balMutate={balMutate} />

}


function NativeView({ session, balance, balMutate, payments }) {
    const cards = session?.user.privilege == "MAIN" || session?.user.privilege == "MAIN2" ? [
        { title: 'Home', icon: homeSharp, Link: HomeNative },
        { title: 'Payments', icon: card, Link: PaymentsNative },
        { title: 'Transactions', icon: reader, Link: TransactionsNative },
        { title: 'My Family', icon: HiUserGroup, Link: FamilyNative },
        { title: 'E-Wallet', icon: wallet, Link: Wallet },
        { title: 'Chatbot', icon: chatbubbleEllipses, Link: Chatbot },
    ]
        :
        [
            { title: 'Home', icon: homeSharp, Link: HomeNative },
            { title: 'E-Wallet', icon: wallet, Link: Wallet },
            { title: 'Transactions', icon: reader, Link: TransactionsNative },
        ]

    return (
        <div className='w-screen h-screen bg-neutral' >
            <div className="py-16 ion-text-center">
                <span className='m-0 font-medium text-7xl text-primary'>HCI</span>
                <span className='m-0 font-medium text-7xl text-accent'>Bank</span>
            </div>
            <div className="flex flex-col items-center w-full gap-3 bg-transparent ion-padding ">
                <div className="grid w-full grid-cols-2 gap-4 p-5">
                    {cards.map(({ title, icon, Link }, index) => {
                        return (
                            <IonNavLink key={index} routerDirection="forward" component={() => <Link session={session} bal={balance} balMutate={balMutate} payments={payments} />}>
                                <div className='flex flex-col items-center justify-center py-5 bg-info rounded-2xl '>
                                    {/*  style={{ backgroundImage: "url('/card.svg')" }} */}

                                    <div className="p-0 m-0">
                                        {index == 3 ? <HiUserGroup className='my-[3px] dash-board-icon text-neutral' /> : <IonIcon className='dash-board-icon text-neutral' icon={icon} />}
                                    </div>
                                    <Text b>{title}</Text>

                                </div>
                            </IonNavLink>

                        )
                    })}

                </div>
                <button className='fixed flex items-center justify-center gap-1 bg-transparent bottom-12 rounded-xl' onClick={() => signOut({ redirect: false })}>
                    <IonIcon className='text-[#D7D7D7]' size='large' icon={logOutOutline} />
                    <span className='text-[#D7D7D7] font-bold'>Sign Out</span>
                </button>
            </div>
        </div >
    )
}

function WebView({ session, balance, balMutate }) {

    function Sidebar({ currentTab, NAVBAR_LINKS }) {
        return (
            <div className="flex flex-col items-start h-full bg-neutral border-r border-base-100 lg:w-[200px] 3xl:w-[300px]">
                <Head>
                    <title>HCI Banking: Dashboard</title>
                    <meta name="description" content="HCI Banking Dashboard" />
                </Head>
                <div className="flex flex-col justify-start w-full gap-3 p-4">
                    <div className="">
                        <span className='text-4xl font-medium text-primary'>HCI</span>
                        <span className='text-4xl font-medium text-accent'>Bank</span>
                    </div>

                    <div>
                        <div className='flex flex-col gap-2'>
                            <h3 className="text-base text-secondary-focus">{session?.user?.name}</h3>
                            <h3 className="text-sm font-medium text-medium text-secondary-focus">Balance: {balance?.toFixed(2)} AED</h3>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full h-full">
                    {NAVBAR_LINKS.map((link, index) => {
                        return (
                            <Link href={link.href} key={index}>
                                <div
                                    className={`flex items-center justify-start gap-2 py-3 px-4 3xl:pl-16 w-full group  ${currentTab === link.text.toLowerCase()
                                        ? 'font-bold bg-gradient-to-r from-[#242529] to-[#ADC172]' // 
                                        : 'text-[#D7D7D7]'
                                        }`}
                                >
                                    <div className={`2xl:text-lg transition-transform ease-in-out duration-300 flex gap-3 items-center ${currentTab === link.text.toLowerCase() ? "text-white translate-x-5 scale-110" : "text-[#D7D7D7] group-hover:translate-x-5 group-hover:scale-110"} `}>
                                        {index == 2 ? <HiUserGroup className='' /> : <IonIcon icon={link.icon} />}
                                        <span
                                        >{link.text}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                    {/* <div
                        onClick={async () => {
                            let response = await fetch(`${WEB_URL}/api/cron/automaticSalary`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({}),
                            });
                            let data = await response.json();
                            console.log(data);
                        }}
                        className={`btn text-white flex items-center justify-start gap-2 py-3 px-4 pl-16 w-full group cursor-pointer bg-black`}
                    >TEST</div> */}
                    <div
                        className={`cursor-pointer flex items-center mt-auto justify-start gap-2 py-3 px-4 text-accent group hover:underline `}
                        onClick={() => {
                            signOut({
                                redirect: false,
                            })
                            router.push('/auth')
                        }
                        }>
                        <span>Sign Out</span>
                        <IonIcon icon={logOut} size="large" color="#92949c"></IonIcon>

                    </div>
                </div>
            </div>
        )
    }

    const NAVBAR_LINKS = session?.user.privilege == "MAIN" || session?.user.privilege == "MAIN2" ? [
        { href: '/dashboard?tab=home', icon: homeSharp, text: 'Home' },
        { href: '/dashboard?tab=transactions', icon: reader, text: 'Transactions' },
        { href: '/dashboard?tab=family', icon: HiUserGroup, text: 'Family' },
        { href: '/dashboard?tab=payments', icon: card, text: 'Payments' },
    ] :
        [
            { href: '/dashboard?tab=home', icon: homeSharp, text: 'Home' },
            { href: '/dashboard?tab=transactions', icon: reader, text: 'Transactions' },
        ]


    const lookup = {
        home: {
            component: HomeWeb,
        },
        transactions: {
            component: TransactionsWeb,
        },
        family: {
            component: FamilyWeb,
        },
        payments: {
            component: PaymentsWeb,
        }
    }


    const router = useRouter()
    const { tab } = router.query
    const currentTab = tab ? tab : 'home'
    const { component: View } = lookup[currentTab]
    //do this with a map instead

    return (
        <div className="flex h-screen bg-neutral">
            <Sidebar currentTab={currentTab} NAVBAR_LINKS={NAVBAR_LINKS} />

            <div className='w-full h-full '>
                <View session={session} bal={balance} balMutate={balMutate} />
            </div>

        </div>
    )
}