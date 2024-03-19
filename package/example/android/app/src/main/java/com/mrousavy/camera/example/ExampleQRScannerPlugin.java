package com.mrousavy.camera.example;

import android.media.Image;
import android.util.Log;
import com.google.android.gms.tasks.Tasks;

import com.mrousavy.camera.frameprocessor.Frame;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;
import com.mrousavy.camera.frameprocessor.VisionCameraProxy;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.common.InputImage;
import com.mrousavy.camera.types.Orientation;
import com.mrousavy.camera.core.FrameInvalidError;
import java.util.concurrent.ExecutionException;

public class ExampleQRScannerPlugin extends FrameProcessorPlugin {
    BarcodeScanner barcodeScanner;
    private static final String TAG = "ExampleQrScannerPlugin";

    @Override
    public Object callback(@NotNull Frame frame, @Nullable Map<String, Object> params) {

        Image mediaImage = frame.getImage();
        InputImage inputImage;

        try {
            Orientation orientation = frame.getOrientation();
            int rotation =Orientation.Companion.fromUnionValue(orientation.getUnionValue()).toDegrees();
            inputImage = InputImage.fromMediaImage(mediaImage, rotation);
        } catch (FrameInvalidError e) {
            Log.e(TAG, "Received an invalid frame.");
            return null;
        }

        List<Object> barcodes = new ArrayList<>();

        try {
            List<Barcode> barcodeList = Tasks.await(barcodeScanner.process(inputImage));
            barcodeList.forEach(
                    barcode -> barcodes.add(barcode.getRawValue()));
        } catch (ExecutionException | InterruptedException e) {
            Log.e(TAG, "Error processing image for barcodes: " + e.getMessage());
            return null;
        }

        return barcodes;

    }

    ExampleQRScannerPlugin(VisionCameraProxy proxy, @Nullable Map<String, Object> options) {
        super();

        barcodeScanner =
        BarcodeScanning.getClient(
            new BarcodeScannerOptions.Builder()
                .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
                .build());
    }
}
