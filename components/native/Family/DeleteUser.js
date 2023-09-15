import { Input, Loading } from '@nextui-org/react';
import { IonApp, IonBackButton, IonButtons, IonHeader, IonIcon, IonToolbar } from "@ionic/react";
import { caretBack, warning } from "ionicons/icons";
import Notification from "../Notification";
import deleteUser from '../../../pipes/deleteUser';
import { useEffect, useState } from 'react';

export default function DeleteUser({ user, mainId, familyMutate, setUser }) {
    const [submitting, setSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState("")

    useEffect(() => {
        if (submitStatus == "done") {
            document.getElementById("back").click()
        }
    }, [submitStatus])

    const handleDelete = async () => {
        setSubmitting(true);
        const res = await deleteUser({ id: user.id, username: user.username });
        setSubmitting(false);
        if (res.success == true) {
            familyMutate()
            setUser(null);
            setSubmitStatus("success")
            // document.getElementById(deleteModalId).click();
        }
        else {
            setSubmitStatus("error")
        }
    }
    return (
        <IonApp>
            <IonHeader >
                <IonToolbar color="medium" className='border-none' style={{ border: "none !important" }}>
                    <IonButtons slot="start" >
                        <IonBackButton id="back" defaultHref='/' icon={caretBack} text={"Back"} className="custom-back-button"></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <div className='flex flex-col w-full h-screen px-5 pt-5 gap-7 bg-neutral'>
                <div className='flex gap-3'>
                    <IonIcon icon={warning} className="text-4xl text-primary" />
                    <h1 className='self-start m-0 text-3xl font-bold text-primary'>Warning!</h1>
                </div>
                {!submitStatus ?
                    <div className='flex flex-col items-center justify-center gap-10 '>
                        <p className="text-2xl max-w-xs font-bold text-center text-[#FFFBF9]">
                            Are you sure you want to delete this user permanently?
                        </p>

                        <button
                            disabled={submitting}
                            onClick={handleDelete}
                            style={{
                                borderColor: "#242529",
                                fontSize: "1.4rem",
                                height: "3.8rem",
                                margin: "auto",
                                border: "3px solid",

                            }}
                            className='bg-transparent rounded-full btn-wide hover:bg-accent text-accent hover:text-neutral btn-outline-neutral btn'
                        >
                            {submitting ? <Loading color="currentColor" size="md" /> : " Delete"}

                        </button>
                    </div>
                    :
                    <Notification message={"Delete"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} ></Notification>

                }
            </div>
        </IonApp>
    )
}
