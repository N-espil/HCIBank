import { checkmark, close } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'
export default function NotificationSmall({ message, submitStatus, setSubmitStatus, deleteModalId }) {
    return (
        <div className='flex flex-col items-center w-full gap-6 p-5 my-auto'>
            {submitStatus !== 'error' ?
                <IonIcon icon={checkmark} className='p-1 text-5xl rounded-full text-neutral bg-accent' />
                :
                <IonIcon icon={close} className='p-1 text-5xl rounded-full text-neutral bg-accent' />
            }
            {submitStatus !== 'error' ?
                <span className='text-2xl text-center text-[#FFFBF9]'>{message} Successful!</span>
                :
                <span className='text-2xl text-center text-[#FFFBF9]'>{message} Failed!</span>
            }
            <button
                onClick={() => {
                    setSubmitStatus(null)
                }}
                type="button"
                className='px-10 text-2xl rounded-full hover:bg-accent hover:text-neutral bg-secondary text-neutral btn-outline-neutral btn '
            >
                Done
            </button>

        </div>
    )
}
