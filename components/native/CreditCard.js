export default function CreditCard({ name, balance }) {

    return (
        <div className='relative flex flex-col justify-between w-full h-48 bg-center bg-cover text-neutral rounded-xl ' style={{ backgroundImage: "url('/card.svg')" }}>
            <h2 className="absolute text-2xl font-bold top-4 right-4 text-neutral">HCIB</h2>
            <div className='flex flex-col gap-10 p-5 '>
                <div>
                    <h2 className='m-0 text-2xl font-normal text-neutral'>Current Balance</h2>
                    <h2 className='m-0 font-semibold text-[#FFFBF9] lg:text-2xl 2xl:text-3xl 5xl:text-5xl'>AED {balance}</h2>
                </div>
                <h3 className='m-0 text-3xl font-semibold text-neutral'>**** **** **** 3812 </h3>
            </div>
            <h2 className="absolute text-xl font-bold bottom-2 right-4 text-neutral">
                12/25
            </h2>


        </div>
    )
}
