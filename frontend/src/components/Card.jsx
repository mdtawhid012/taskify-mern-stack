export default function Card({ title, description, onEdit, onDelete }) {
  return (
    <div className="flex flex-col border-black shadow-md rounded-md m-2 p-4 w-64 bg-gray-50">
      <h2 className="font-bold text-lg">{title}</h2>
      <p className="mt-2 mb-4 break-words line-clamp-2">{description}</p>
      <div className="flex justify-end mt-4">
        <button
          onClick={onEdit}
          className="bg-gray-400 text-white py-1 px-2 mx-2 border rounded-md hover:bg-gray-600"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 text-white py-1 px-2 mx-2 border rounded-md hover:bg-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
