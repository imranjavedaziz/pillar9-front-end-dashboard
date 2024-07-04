const CustomDetailBtn = ({ text, mt, onClick }) => {
    if (!mt) mt = "";
    return (
      <button
        onClick={onClick}
        className={`py-[5px] px-[17px] text-[12px] bg-primary text-black rounded-lg border-none cursor-pointer  hover:bg-[#e8db96] font-semibold ${mt}`}
        style={{
          transition:
            "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        }}
      >
        {text}
      </button>
    );
  };
  
  export default CustomDetailBtn;