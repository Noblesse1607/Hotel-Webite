package com.example.hotel_web.recommendationAI;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import weka.classifiers.Classifier;
import weka.classifiers.lazy.IBk;
import weka.core.DenseInstance;
import weka.core.Instances;

import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/ai")
public class RoomRecommendationAI {

    private Classifier knn;
    private Instances trainingData;



    // Constructor để load dữ liệu và huấn luyện mô hình
    public RoomRecommendationAI() throws Exception {
        String filePath = "C:\\Users\\PC\\Downloads\\Hotel-website\\Hotel-Webite\\hotel_web\\src\\main\\java\\com\\example\\hotel_web\\recommendationAI\\rooms.json";
        String jsonData = new String(Files.readAllBytes(Paths.get(filePath)));

        // Load dữ liệu và huấn luyện mô hình
        trainingData = new DataPreparation().loadDataFromJSON(jsonData);
        trainingData.setClassIndex(0);
        knn = new IBk(7); // KNN với k=6
        knn.buildClassifier(trainingData);
    }

    @PostMapping("/predict-room")
    public ResponseEntity<?> predictRoom(@RequestBody RoomPredictionRequest request) {
        try {
            // Tạo dữ liệu không gán nhãn để dự đoán
            Instances unlabeled = trainingData.stringFreeStructure();
            double[] values = new double[trainingData.numAttributes()];

            // Gán các giá trị từ request
            values[1] = request.getMaxGuests();
            values[2] = request.getRoomPrice();
            values[3] = request.getRoomType();
            values[4] = request.getBedType();
            values[5] = request.isWifi() ? 1 : 0;
            values[6] = request.isTv() ? 1 : 0;
            values[7] = request.isAc() ? 1 : 0;
            values[8] = request.isMinibar() ? 1 : 0;
            values[9] = request.isPool() ? 1 : 0;

            unlabeled.add(new DenseInstance(1.0, values));

            // Dự đoán kết quả
            double result = knn.classifyInstance(unlabeled.instance(0));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
