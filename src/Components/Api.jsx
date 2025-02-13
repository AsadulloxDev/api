import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

function Api() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [newName, setNewName] = useState("");
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Token

  const getPhotos = async () => {
    try {
      const response = await fetch("https://realauto.limsa.uz/api/brands");
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setPhotos(result.data);
      } else {
        setPhotos([]);
      }
    } catch (error) {
      console.error("Xatolik:", error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPhotos();
  }, []);

  // PUT: Yangilash
  const updatePhoto = async () => {
    if (!newName.trim()) return alert("Nom bo‘sh bo‘lishi mumkin emas!");

    try {
      const response = await fetch(`https://realauto.limsa.uz/api/brands/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      const result = await response.json();

      if (result.success) {
        setPhotos((prevPhotos) =>
          prevPhotos.map((photo) => (photo.id === editId ? { ...photo, name: newName } : photo))
        );
        setEditId(null);
        setNewName("");
      } else {
        console.error("Yangilashda xatolik:", result);
      }
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  // DELETE: O‘chirish
  const deletePhoto = async (id) => {
    try {
      const response = await fetch(`https://realauto.limsa.uz/api/brands/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== id));
      } else {
        console.error("O‘chirishda xatolik:", result);
      }
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  return (
    <div className="relative min-h-screen p-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <SyncLoader color="gray" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {photos.length === 0 ? (
            <h1 className="col-span-3 text-center text-xl text-red-500">
              Ma'lumot topilmadi!
            </h1>
          ) : (
            photos.map((card) => (
              <div
                key={card.id}
                className="w-[300px] h-auto rounded-3xl p-4 shadow-lg bg-white flex flex-col items-center"
              >
                <h1 className="text-lg font-bold">{card.title}</h1>
                <img
                  src={`https://realauto.limsa.uz/api/uploads/images/${card.image_src}`}
                  alt={`Image ${card.id}`}
                  className="w-[250px] h-[150px] object-contain"
                />

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(card.id);
                      setNewName(card.title);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                  >
                    Yangilash
                  </button>
                  <button
                    onClick={() => deletePhoto(card.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                  >
                    O‘chirish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Ma'lumotni yangilash</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border p-2 w-full rounded-md text-center"
              placeholder="Yangi nomni kiriting"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={updatePhoto}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Saqlash
              </button>
              <button
                onClick={() => setEditId(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Api;
