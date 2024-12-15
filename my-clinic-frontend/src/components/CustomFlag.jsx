export const CustomFlag = ({ text, bgcolor, bordercolor }) => {
  return (
    <>
      <span
        className={`${bgcolor} border ${bordercolor} px-7 py-1 text-white rounded-sm text-[13px]`}
      >
        {text}
      </span>
    </>
  );
};
