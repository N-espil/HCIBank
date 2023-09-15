import { IonIcon } from '@ionic/react'
import { Dropdown, Loading, Text } from '@nextui-org/react'
import { chevronBackSharp, chevronForwardSharp, warning } from 'ionicons/icons'
import { useState } from 'react'
import Modal from '../Modal';
import EditUser from './EditUser';
import deleteUser from '../../../pipes/deleteUser';
import NotificationSmall from '../NotificationSmall';

export default function FamilyCarousel({ family, familyMutate, mainId }) {
    const [user, setUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState("")
    const [viewCount, setViewCount] = useState(1)

    const deleteModalId = "deleteModal";
    const editModalId = "editModal";
    const handleDelete = async () => {
        setSubmitting(true);
        const res = await deleteUser({ id: user.id, username: user.username });
        setSubmitting(false);
        if (res.success == true) {
            familyMutate()
            setSubmitStatus("success")
            // document.getElementById(deleteModalId).click();
        }
        else{
            setSubmitStatus("error")
        }
    }

    function Circles() {
        let circles = []
        for (let i = 0; i < Math.ceil(family.length / 3); i++) {
            circles.push(
                <div
                    key={i}
                    className={`w-3 h-3 rounded-full cursor-pointer ${i === viewCount - 1 ? 'bg-white' : 'bg-neutral'}`}
                    onClick={() => setViewCount(i + 1)}
                ></div>)
        }
        return circles
    }

    return (
        <>
            <Modal modalId={deleteModalId} title={"Warning!"} icon={warning}>
                {!submitStatus ?
                    <div className='flex flex-col items-center justify-center gap-10 '>
                        <p className="text-lg max-w-xs font-bold text-center text-[#FFFBF9]">
                            Are you sure you want to delete this user permanently?
                        </p>

                        <button
                            onClick={handleDelete}
                            disabled={submitting}
                            className='px-8 text-xl rounded-full hover:bg-accent hover:text-neutral bg-secondary text-neutral btn-outline-neutral btn '
                        >
                            {submitting ? <Loading color="currentColor" size="sm" /> : " Delete"}

                        </button>
                    </div>
                    :
                    <NotificationSmall message={"Delete"} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus}></NotificationSmall>
                }
            </Modal>
            <Modal modalId={editModalId} title={"Edit User"}>
                <div className='flex flex-col items-center justify-center gap-10'>
                    <EditUser user={user} mainId={mainId} familyMutate={familyMutate}></EditUser>
                </div>
            </Modal>
            <div className="flex items-center justify-center w-full gap-6 p-2 my-auto 2xl:gap-16">
                {family?.length === 0 &&
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className='text-3xl font-semibold text-neutral'>No members to display...</h1>
                    </div>
                }
                {family?.length != 0 &&
                    <>
                        <IonIcon className={`w-12 h-12 mr-auto cursor-pointer 5xl:w-20 5xl:h-20 text-neutral ${viewCount === 1 ? "invisible" : "inline-flex"}`} icon={chevronBackSharp} onClick={() => {
                            if (viewCount > 1)
                                setViewCount(prev => prev - 1)
                        }} />
                        {family?.map((member, index) => {
                             
                            if (index < viewCount * 3 && index >= (viewCount - 1) * 3) {

                                const firstname = member.name.split(" ")[0]
                                const lastname = member.name.split(" ")[1]
                                return (
                                    <div key={index} className='flex flex-col items-center justify-center group'>
                                        <Dropdown menuProps placement='bottom-left' >
                                            <Dropdown.Trigger>
                                                <div
                                                    className={` ${member.privilege == "MAIN" ? "pointer-events-none" : "group-hover:bg-base-100"} flex items-center justify-center w-24 h-24 4xl:w-28 4xl:h-28 5xl:w-32 5xl:h-32 rounded-full cursor-pointer  border-[4px] border-primary bg-primary text-neutral`}
                                                >

                                                    <h2 className={` ${member.privilege != "MAIN" ? "group-hover:text-primary" : ""} m-0 text-5xl 4xl:text-6xl `}>{firstname[0].toUpperCase() + lastname[0].toUpperCase()}</h2>
                                                </div>
                                            </Dropdown.Trigger>
                                            <Dropdown.Menu className='myDropdown'>
                                                <Dropdown.Item key="edit" textValue='Edit' css={{ minWidth: "100%", padding: 0, }} >
                                                    <label htmlFor={editModalId} className='flex w-full h-full pl-3 m-0 cursor-pointer' onClick={() => setUser(member)}>
                                                        <Text b>
                                                            Edit
                                                        </Text>
                                                    </label>
                                                </Dropdown.Item>
                                                <Dropdown.Item withDivider key="delete" textValue='Delete' css={{ minWidth: "100%", padding: 0, }}>
                                                    <label htmlFor={deleteModalId} className='flex w-full h-full pl-3 m-0 cursor-pointer' onClick={() => setUser(member)}>
                                                        <Text b color='error'>
                                                            Delete
                                                        </Text>
                                                    </label>
                                                </Dropdown.Item>
                                            </Dropdown.Menu>

                                        </Dropdown>
                                        <div className='flex justify-center 2xl:mt-4 '>
                                            <h1 className='m-0 text-2xl font-semibold 2xl:text-3xl text-neutral'>{firstname}</h1>
                                        </div>
                                    </div>
                                )
                            }
                        })
                        }
                        <IonIcon className={`w-12 h-12 ml-auto cursor-pointer 5xl:w-20 5xl:h-20 text-neutral ${viewCount === Math.ceil(family.length / 3) ? "invisible" : "inline-flex"}`} icon={chevronForwardSharp} onClick={() => {
                            if (viewCount < Math.ceil(family.length / 3))
                                setViewCount(prev => prev + 1)
                        }} />
                    </>
                }

            </div>
            <div className='flex gap-3 p-4'>
                <Circles></Circles>
            </div>
        </>
    )
}
