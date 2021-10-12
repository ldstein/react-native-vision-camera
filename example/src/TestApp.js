/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Button, StyleSheet, Linking  } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera, useFrameProcessor, useCameraDevices } from 'react-native-vision-camera';
import Reanimated from 'react-native-reanimated'

const commonPageStyles = StyleSheet.create 
({
    wrapper:
    {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    }
});

//..............................................................................
function Spacer()
{
    return <View style={spacerStyles.wrapper} />
}

const spacerStyles = StyleSheet.create
({
    wrapper:
    {
        width: 10,
        height: 10
    }
});
//..............................................................................

//..............................................................................
function OtherPage(props)
{
    const {navigation} = props;
    
    return (
        <View style={commonPageStyles.wrapper}>
            <Text>Other Page</Text>
            <Spacer />
            <Button title="Replace with Camera Page" onPress={() => navigation.replace('CameraPage')} />
            <Spacer />
            <Button title="Navigate to Camera Page" onPress={() => navigation.navigate('CameraPage')} />
        </View>
    )
}
//..............................................................................

//..............................................................................
function CameraPage(props)
{
    console.log('Render CameraPage');

    useCallback(() => 
    {
        return () => console.log("CameraPage Unmounted");
    }, []);
    
    const {navigation} = props;
    
    const [cameraPermissionStatus, setCameraPermissionStatus] = useState('not-determined');

    const [processFrame, setProcessFrame] = useState(true);
    const [renderCamera, setRenderCamera] = useState(true);
    const [cameraActive, setCameraActive] = useState(true);
  
    const requestCameraPermission = useCallback(async () => {
      console.log('Requesting camera permission...');
      const permission = await Camera.requestCameraPermission();
      console.log(`Camera permission status: ${permission}`);
  
      if (permission === 'denied') await Linking.openSettings();
      setCameraPermissionStatus(permission);
    }, []);

    useEffect(() => {
      Camera.getCameraPermissionStatus().then(setCameraPermissionStatus);
    }, []);

    const frameProcessor = useFrameProcessor(() => {
      'worklet'
      console.log('Process Frame', Date.now());
    });

    const devices = useCameraDevices();
    const cameraAuthorized = cameraPermissionStatus == 'authorized';

    let renderedCamera = null;
    let renderedAuthButton = null;
    let renderedNav = null;

    if (!cameraAuthorized)
        renderedAuthButton = <Button title="Request Camera Permission" onPress={requestCameraPermission} />;

    if (cameraAuthorized && devices.back && renderCamera)
        renderedCamera = <Camera style={cameraPageStyles.camera} device={devices.back} isActive={cameraActive} frameProcessor={processFrame ? frameProcessor : null} />

    if (cameraAuthorized && devices.back)
        renderedNav = 
            <View style={cameraPageStyles.footer}>
                <Button title={'Frame Processor:' + processFrame} onPress={() => setProcessFrame(!processFrame)} />
                <Spacer />
                <Button title={'Render Camera Component:' + renderCamera} onPress={() => setRenderCamera(!renderCamera)} />
                <Spacer />
                <Button title={'Camera isActive:' + cameraActive} onPress={() => setCameraActive(!cameraActive)} />
                <Spacer />
                <Button title={"Navigate to Other Page"} onPress={() => navigation.navigate('OtherPage')} />
                <Spacer />
                <Button title={"Replace with Other Page"} onPress={() => navigation.replace('OtherPage')} />
            </View>

    return (
        <View style={cameraPageStyles.wrapper}>
            {renderedAuthButton}
            {renderedCamera}
            {renderedNav}
        </View>
    )
}

const cameraPageStyles = StyleSheet.create
({
    wrapper:
    {
        flex           : 1,
        backgroundColor: '#666',
        justifyContent : 'center',
        alignItems     : 'center',
    },
    camera:
    {
        ...StyleSheet.absoluteFill
    },
    footer:
    {
        position:'absolute',
        bottom:10,
        left:10,
        right:10
    }
});
//..............................................................................

//..............................................................................
const Stack = createNativeStackNavigator();

function App()
{ 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'CameraPage'}>
        <Stack.Screen name="CameraPage" component={CameraPage} />
        <Stack.Screen name="OtherPage" component={OtherPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
//..............................................................................

export {App}
