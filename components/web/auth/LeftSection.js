export default function LeftSection({toggleSignInUp}) {
    
    return (
      <div className="">
        <h2 className="mb-2 text-3xl font-bold text-neutral">Welcome</h2>
        <div className="border-2 w-[40px] border-neutral inline-block mb-2"></div>
        <p className="mb-3 text-neutral">
          If you already have an account, log in here.
        </p>
        <button
          onClick={toggleSignInUp}
          type="button"
          className="inline-block w-full px-12 py-2 mt-6 font-semibold rounded-full text-neutral ring-2 ring-neutral bg-accent btn btn-active hover:bg-neutral hover:text-primary"
        >
          Log in
        </button>
      </div>
    );
  };
  
