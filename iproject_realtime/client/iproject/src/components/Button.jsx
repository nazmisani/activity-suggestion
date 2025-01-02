export default function Button({ nameProp }) {
  return (
    <button type="submit" className="w-full px-4 py-2 bg-black text-white font-bold border-2 border-black rounded-md shadow-brutal hover:bg-white hover:text-black hover:border-yellow-500">
      {nameProp}
    </button>
  );
}
