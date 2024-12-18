import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

const RoomPredictionForm = () => {
  const [result, setResult] = useState(""); // State để lưu kết quả trả về từ API
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Thu thập dữ liệu từ form
    const formData = new FormData(event.target);
    const data = {
      maxGuests: formData.get("maxGuests") ? parseInt(formData.get("maxGuests")) : null,
      roomPrice: formData.get("roomPrice") ? parseInt(formData.get("roomPrice")) : null,
      roomType: formData.get("roomType") ? parseInt(formData.get("roomType")) : null,
      bedType: formData.get("bedType") ? parseInt(formData.get("bedType")) : null,
      wifi: formData.get("wifi") ? true : null,
      tv: formData.get("tv") ? true : null,
      ac: formData.get("ac") ? true : null,
      minibar: formData.get("minibar") ? true : null,
      pool: formData.get("pool") ? true : null,
    };

    try {
      // Gửi yêu cầu tới API
      const response = await fetch("http://localhost:8081/hotel/api/ai/predict-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const resultData = await response.json();
        const roundedResult = Math.round(resultData); // Làm tròn kết quả

        setResult(`Prediction Result: ${roundedResult}`); // Cập nhật kết quả hiển thị
        navigate(`/book-room/${roundedResult}`); // Điều hướng đến trang mới

        setResult(`Prediction Result: ${resultData}`); // Cập nhật kết quả
      } else {
        const errorText = await response.text();
        setResult(`Error: ${errorText}`); // Hiển thị lỗi nếu API trả về lỗi
      }
    } catch (error) {
      setResult(`Error: ${error.message}`); // Xử lý lỗi khác
    }
  };

  return (
    <div className="form-container">
      <h2>Room Prediction</h2>
      <form id="predictionForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="maxGuests">Maximum Guests</label>
          <input type="number" id="maxGuests" name="maxGuests"/>
        </div>

        <div className="form-group">
          <label htmlFor="roomType">Room Type</label>
          <select id="roomType" name="roomType">
            <option value="">-- Select Room Type --</option>
            <option value="0">Phòng đơn</option>
            <option value="1">Phòng đôi</option>
            <option value="2">Phòng Suite</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="bedType">Bed Type</label>
          <select id="bedType" name="bedType">
            <option value="">-- Select Bed Type --</option>
            <option value="0">Giường đơn</option>
            <option value="1">Giường đôi</option>
            <option value="2">Giường King</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="roomPrice">Room Price</label>
          <input type="number" id="roomPrice" name="roomPrice" />
        </div>

        <div className="form-group">
          <label>Amenities</label>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" id="wifi" name="wifi" /> WiFi
            </label>
            <label>
              <input type="checkbox" id="tv" name="tv" /> TV
            </label>
            <label>
              <input type="checkbox" id="ac" name="ac" /> Air Conditioning
            </label>
            <label>
              <input type="checkbox" id="minibar" name="minibar" /> Minibar
            </label>
            <label>
              <input type="checkbox" id="pool" name="pool" /> Pool
            </label>
          </div>
        </div>

        <button className= "btn-submit" type="submit">Predict</button>
      </form>

      <div className="result" id="result">
        {result}
      </div>
    </div>
  );
};

export default RoomPredictionForm;
