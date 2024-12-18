package com.example.hotel_web.recommendationAI;

import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instances;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class DataPreparation {

    public static Instances loadDataFromJSON(String jsonData) {
        // Kiểm tra nếu jsonData rỗng
        if (jsonData == null || jsonData.isEmpty()) {
            throw new IllegalArgumentException("Dữ liệu JSON không hợp lệ hoặc rỗng.");
        }

        // Khai báo các thuộc tính (Attributes)
        ArrayList<Attribute> attributes = new ArrayList<>();
        attributes.add(new Attribute("id"));
        attributes.add(new Attribute("max_guests"));
        attributes.add(new Attribute("room_price"));

        // Room types
        ArrayList<String> roomTypes = new ArrayList<>();
        roomTypes.add("Phòng đơn");
        roomTypes.add("Phòng đôi");
        roomTypes.add("Phòng Suite");
        attributes.add(new Attribute("room_type", roomTypes));

        // Bed types
        ArrayList<String> bedTypes = new ArrayList<>();
        bedTypes.add("Giường đơn");
        bedTypes.add("Giường đôi");
        bedTypes.add("Giường King");
        attributes.add(new Attribute("bed_type", bedTypes));

        // Amenities (mảng boolean cho các tiện ích)
        attributes.add(new Attribute("wifi"));
        attributes.add(new Attribute("tv"));
        attributes.add(new Attribute("ac"));
        attributes.add(new Attribute("minibar"));
        attributes.add(new Attribute("pool"));

        // Tạo Instances
        Instances dataset = new Instances("RoomBooking", attributes, 0);

        // Đọc dữ liệu JSON và thêm vào Instances
        JSONArray jsonArray = new JSONArray(jsonData);

        // Kiểm tra nếu jsonArray rỗng
        if (jsonArray.length() == 0) {
            throw new IllegalArgumentException("Dữ liệu JSON không có phần tử.");
        }

        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject obj = jsonArray.getJSONObject(i);
            double[] values = new double[attributes.size()]; // Đảm bảo mảng đủ kích thước

            // Chuyển id, max_guests, room_price
            values[0] = obj.getInt("id");
            values[1] = obj.getInt("max_guests");
            values[2] = obj.getDouble("room_price");

            // Chuyển room_type thành chỉ số
            String roomType = obj.getString("room_type");
            values[3] = roomTypes.indexOf(roomType);
            System.out.println(values[3]);

            // Chuyển bed_type thành chỉ số
            String bedType = obj.getString("bed_type");
            values[4] = bedTypes.indexOf(bedType);
            System.out.println(values[4]);

            // Chuyển amenities thành mảng boolean (1 hoặc 0)
            JSONObject amenities = obj.getJSONObject("amenities");
            values[5] = amenities.getBoolean("wifi") ? 1 : 0;    // Wifi
            values[6] = amenities.getBoolean("tv") ? 1 : 0;      // TV
            values[7] = amenities.getBoolean("ac") ? 1 : 0;      // AC
            values[8] = amenities.getBoolean("minibar") ? 1 : 0; // Minibar
            values[9] = amenities.getBoolean("pool") ? 1 : 0;    // Pool

            // Thêm dữ liệu vào dataset
            dataset.add(new DenseInstance(1.0, values));
        }

        // Kiểm tra và log dataset
        System.out.println(dataset.toString()); // Log toàn bộ dataset
        return dataset;
    }
}


