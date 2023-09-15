import { IonIcon, IonNavLink } from '@ionic/react'
import { chevronBackSharp, chevronForwardSharp } from 'ionicons/icons'
import { useState } from 'react'


export default function FamilyCarousel({ family, user, setUser }) {
    // const [user, setUser] = useState(null);
    const [viewCount, setViewCount] = useState(1)

    return (
        <>

            <div className="flex items-center justify-center w-full gap-5 p-2 px-0 my-auto">
                {family?.length === 0 &&
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className='text-2xl font-semibold text-base-100'>No members to display...</h1>
                    </div>
                }
                {family?.length != 0 &&
                    <>
                        <IonIcon className={`mr-auto w-8 h-8 cursor-pointer text-accent ${viewCount === 1 ? "inline-flex" : "inline-flex"}`} icon={chevronBackSharp} onClick={() => {
                            if (viewCount > 1)
                                setViewCount(prev => prev - 1)
                        }} />
                        {family?.map((member, index) => {
                            if (index < viewCount * 3 && index >= (viewCount - 1) * 3) {

                                const firstname = member.name.split(" ")[0]
                                const lastname = member.name.split(" ")[1]
                                return (
                                    <button
                                        onFocus={() => setUser(member)}
                                        key={index}
                                        className={`flex flex-col items-center justify-center ${member.privilege == "MAIN" ? "pointer-events-none" : ""}`}>
                                        <div
                                            className={`${user?.id === member.id ? "bg-accent border-accent" : "bg-info border-info"}  flex items-center justify-center w-16 h-16 rounded-full cursor-pointer border-[4px] text-neutral`}
                                        >

                                            <h2 className='m-0 text-3xl '>{firstname[0].toUpperCase() + lastname[0].toUpperCase()}</h2>
                                        </div>
                                        <div className='flex justify-center mt-4 '>
                                            <h1 className='text-base m-0 font-semibold text-[#D7D7D7]'>{firstname}</h1>
                                        </div>
                                    </button>
                                )
                            }
                        })
                        }
                        <IonIcon className={`ml-auto w-8 h-8 cursor-pointer text-accent ${viewCount === Math.ceil(family.length / 3) ? "inline-flex" : "inline-flex"}`} icon={chevronForwardSharp} onClick={() => {
                            if (viewCount < Math.ceil(family.length / 3))
                                setViewCount(prev => prev + 1)
                        }} />
                    </>
                }

            </div>
        </>
    )
}
