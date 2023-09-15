
import { IonBackButton, IonButtons, IonToolbar, IonHeader, IonNavLink, IonApp, IonIcon } from '@ionic/react';
import { caretBack, checkbox, checkboxOutline, checkmark, checkmarkDone } from 'ionicons/icons';
import Loader from '../../Loader';
import useSWR from 'swr'
import CreditCard from '../CreditCard';
import { WEB_URL } from '../../../util/keys';
import { useEffect, useState } from 'react';
import { NFC, Ndef, NFCOriginal } from '@awesome-cordova-plugins/nfc';
import addNFCTransaction from '../../../pipes/addNFCTransaction';

export default function Wallet({ session, bal, balMutate }) {
    const fetcher = (url) => fetch(url).then(res => res.json())
    const { data, error, isLoading, mutate } = useSWR(`${WEB_URL}/api/planetscale/user/getBalance?id=${session.user.id}`, fetcher)

    if (isLoading || !data)
        return <Loader />


    const [successStatus, setSuccessStatus] = useState(false)
    const [scanning, setScanning] = useState(false)
    const [timer, setTimer] = useState("30")



    useEffect(() => {
        if (scanning) {
            setTimeout(() => {
                setScanning(false)
                setTimer(30)
            }, 30000);
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [scanning])

    useEffect(() => {
        const plat = Capacitor.getPlatform()
        if (plat == 'web') {
            return
        }
        if (plat == 'android') {
            let readerMode;
            if (scanning) {
                // Enable NFC reader mode when scanning is true
                let flags = NFC.FLAG_READER_NFC_A | NFC.FLAG_READER_NFC_V;
                readerMode = NFC.readerMode(flags).subscribe(
                    async tag => {
                        setTimer(30)
                        setSuccessStatus(true)
                        setTimeout(() => {
                            setSuccessStatus(false)
                            setScanning(false)
                        }, 1000);
                        const res = await addNFCTransaction({ fromName: session.user.username, fromID: session.user.id, toUsername: "NFC Payment", amount: 20, comment: `NFC payment`, type: "Shopping" })
                        mutate()
                    },
                    err => console.log('Error reading tag', err)

                );
            }
            // Clean up the subscription when the component unmounts or scanning is turned off
            return () => {
                if (readerMode) {
                    readerMode.unsubscribe();
                }
            };
        }
        else {

            NFC.scanNdef().then(
                tag => setTagData(tag),
                err => console.log('Error reading tag', err));
        }

    }, [scanning]);


    const formattedBalance = data.balance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (
        <IonApp>
            <IonHeader >
                <IonToolbar color="medium" className='border-none' style={{ border: "none !important" }}>
                    <IonButtons slot="start" >
                        <IonBackButton defaultHref='/' icon={caretBack} text={"Back"} className="custom-back-button"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className='flex flex-col w-full h-screen px-5 py-5 bg-neutral'>
                <div className="py-3 mb-28">
                    <span className='text-5xl font-medium text-primary'>HCI</span>
                    <span className='text-5xl font-medium text-accent'>Bank</span>
                </div>
                <div className={`${scanning ? "rotate-90" : "rotate-0"} transition-all duration-1000 ease-in-out mb-20`}>
                    <CreditCard balance={formattedBalance} />
                </div>
                {!scanning ?
                    <button
                        onClick={() => setScanning(true)}
                        style={{
                            borderColor: "#242529",
                            fontSize: "1.4rem",
                            height: "3.8rem",
                            margin: "auto",
                            border: "3px solid",
                        }}
                        className='mx-4 bg-transparent rounded-full btn-wide hover:bg-accent text-accent hover:text-neutral btn-outline-neutral btn'
                    >
                        Pay
                    </button>

                    :
                    <div className='flex flex-col items-center justify-center w-full my-auto'>
                        <div class={`flex flex-col items-center justify-center my-auto duration-100 rounded-full w-44 h-44 bg-opacity-30 bg-accent ${successStatus ? "bg-transparent" : "custom-ping" }`}>
                            <div class={`flex flex-col items-center justify-center w-24 h-24 my-auto duration-200 bg-opacity-40 rounded-full bg-accent ${successStatus ? "bg-transparent" : "delayed-custom-ping" }`}>
                            </div>
                        </div>

                        <div className='fixed flex items-center justify-center w-16 h-16 p-1 border-2 rounded-full border-accent'>
                            {successStatus ?
                                <IonIcon icon={checkmark} className='text-3xl font-bold text-accent'></IonIcon>
                                :
                                // <span className="font-mono text-xl countdown text-accent">
                                //     <span style={{ "--value": timer }}></span>
                                // </span>
                                <h1 className="font-mono m-0 text-xl countdown text-accent">{timer}</h1>
                            }
                        </div>
                        <h3 className='absolute m-0 bottom-16 text-[#D7D7D7] text-center text-xl'>Place the back of your phone against the NFC reader</h3>
                    </div>
                }

            </div>
        </IonApp>
    )

}
