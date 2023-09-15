import { checkmark, close } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'
export default function Notification({ message, submitStatus, setSubmitStatus }) {
	return (
		<div className='flex flex-col items-center w-full gap-10 p-2 2xl:gap-10'>
			{submitStatus !== 'error' ?
				<IonIcon icon={checkmark} className='p-1 rounded-full text-8xl text-neutral bg-accent' />
				:
				<IonIcon icon={close} className='p-1 rounded-full text-8xl text-neutral bg-accent' />
			}
			{submitStatus !== 'error' ?
				<>
					<span className='text-2xl text-center text-accent'>{message} Successful!</span>
					<button
						onClick={() => setSubmitStatus("done")}
						style={{
							borderColor: "#242529",
							fontSize: "1.4rem",
							height: "3.8rem",
							margin: "auto",
							border: "3px solid",

						}}
						className='mx-4 bg-transparent rounded-full btn-wide hover:bg-accent text-accent hover:text-neutral btn-outline-neutral btn'
					>
						Done
					</button>
				</>
				:
				<>
					<span className='text-2xl text-center text-accent'>{message} Failed!</span>
					<button
						onClick={() => setSubmitStatus(null)}
						style={{
							borderColor: "#242529",
							fontSize: "1.4rem",
							height: "3.8rem",
							margin: "auto",
							border: "3px solid",

						}}
						className='mx-4 bg-transparent rounded-full btn-wide hover:bg-accent text-accent hover:text-neutral btn-outline-neutral btn'
					>
						Done
					</button>
				</>
			}


		</div>
	)
}
