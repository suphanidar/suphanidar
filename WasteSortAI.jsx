import React, { useState } from 'react';

function WasteSortAI() {
  const [result, setResult] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });

  const classifyImageWithGemini = async (base64Image) => {
    const apiKey = 'YOUR_API_KEY_HERE'; // 🔑 Replace with your Gemini API Key
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: 'รูปนี้เป็นขยะประเภทไหน: อินทรีย์, รีไซเคิล, อันตราย หรือทั่วไป?' },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        }),
      }
    );
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'ไม่พบผลลัพธ์';
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const base64 = await toBase64(file);
      const result = await classifyImageWithGemini(base64);
      setResult(result);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">♻️ WasteSort AI</h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4 border p-2 rounded w-full"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mx-auto mb-4 rounded shadow-md w-48 h-48 object-cover"
          />
        )}
        <p className="text-md text-gray-700">
          ผลลัพธ์:
          <span className="text-green-800 font-semibold block mt-1">{result}</span>
        </p>
      </div>
    </div>
  );
}

export default WasteSortAI;
