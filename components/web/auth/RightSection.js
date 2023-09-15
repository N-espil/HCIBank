
export default function RightSection({toggleSignInUp}){
    return (
        <div className="">
            <h2 className="mb-2 text-3xl font-bold text-neutral">Welcome</h2>
            <div className="inline-block w-[40px] mb-2 border-2 border-neutral"></div>
            <p className="mb-3 text-neutral">
                If you don't have an account, create one here.
            </p>
            <button
                onClick={toggleSignInUp}
                type="button"
                className="inline-block w-full px-12 py-2 mt-6 font-semibold rounded-full text-neutral ring-2 ring-neutral bg-accent btn btn-active hover:bg-neutral hover:text-primary"
            >
                Create
            </button>
        </div>
    );
}

