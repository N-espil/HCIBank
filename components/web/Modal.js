import React from 'react'
import { IonIcon } from '@ionic/react';
export default function Modal({ children, modalId, title, icon = null, footer = null }) {

    return (
        <>
            <input type="checkbox" id={modalId} className="modal-toggle " />
            <label htmlFor={modalId} className="bg-black cursor-pointer bg-opacity-40 modal ">
                <label className="relative z-50 w-auto p-0 bg-transparent border-4 modal-box border-accent rounded-2xl"  htmlFor="">
                    <div className='flex justify-between w-full p-1 border-4 bg-accent border-accent'>
                        <div className='flex items-center justify-center gap-2'>
                            {icon && <IonIcon icon={icon} className="text-4xl text-neutral" />}
                            <h3 className='m-0 font-bold text-neutral'>{title}</h3>
                        </div>
                        <label htmlFor={modalId} id="closeModal" onClick={()=> {document.getElementById('DoneBtn')?.click()}} className="text-xl font-extrabold bg-transparent border-none cursor-pointer select-none text-neutral hover:text-white ">✕</label>
                    </div>
                    <div className='px-6 pt-4 pb-4 backdrop-blur-3xl' >
                        {children}
                    </div>
                    {footer &&
                        <div className='box-border flex justify-center w-full p-1 border-4 border-accent bg-accent shadow-accent '>
                            <h3 className='m-0 font-bold text-center'>Due Until {new Date(footer).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h3>
                        </div>
                    }
                </label>
            </label >
        </>
    );
}
