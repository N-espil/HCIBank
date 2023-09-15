import { IonApp, IonBackButton, IonButtons, IonHeader, IonToolbar } from "@ionic/react";
import { caretBack } from "ionicons/icons";

export default function ViewDebit({ debit }) {
    if (!debit)
        return
    const { monthlyAmount, totalAmount, installmentsLeft } = debit
    return (

        <IonApp>
            <IonHeader >
                <IonToolbar color="medium" className='border-none' style={{ border: "none !important" }}>
                    <IonButtons slot="start" >
                        <IonBackButton id="back" defaultHref='/' icon={caretBack} text={"Back"} className="custom-back-button"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className='flex flex-col w-full h-screen gap-5 px-5 pt-5 bg-neutral'>
                <h1 className='self-start m-0 text-3xl font-bold text-primary'>{debit?.title}</h1>
                <div className="flex items-center justify-between gap-16">
                    <p className="text-xl font-medium text-[#FFFBF9]">Monthly Amount:</p>
                    <p className="text-xl font-medium text-[#FFFBF9]"><span className="amount">{monthlyAmount.toFixed(2)}</span></p>
                </div>
                <div className="flex items-center justify-between gap-16">
                    <p className="text-xl font-medium text-[#FFFBF9]">Total Amount:</p>
                    <p className="text-xl font-medium text-[#FFFBF9]">{totalAmount.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between gap-16">
                    <p className="text-xl font-medium text-[#FFFBF9]">Remaining Installments:</p>
                    <p className="text-xl font-medium text-[#FFFBF9]">{installmentsLeft}</p>
                </div>
                <div className='box-border flex justify-center w-full p-1 border-4 border-accent bg-accent shadow-accent '>
                    <h3 className='m-0 font-bold text-center'>Due Until {new Date(debit.dateDue).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h3>
                </div>
            </div>
        </IonApp>

    )
}
