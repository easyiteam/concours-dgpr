type Props = {
  value: string;
  updateView: (value: number) => void;
};

export default function DisplayValue({ value, updateView }: Props) {
  const submit = () => {
    updateView(1);
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div>
        <div className="text-4xl">Note: {value}</div>
        <button
          onClick={submit}
          className="border border-[#183661] bg-[#007000] text-white font-bold w-full py-3 my-10 rounded">
          Retour
        </button>
      </div>
    </div>
  );
}
