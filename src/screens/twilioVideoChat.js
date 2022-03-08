import React, { Component, useState, useEffect, useRef } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  PermissionsAndroid,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {
  TwilioVideoLocalView, // to get local view
  TwilioVideoParticipantView, //to get participant view
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import { width, height } from 'react-native-dimension';
import Draggable from 'react-native-draggable';

import {
  COLOR_BLACK,
  COLOR_DARK_PINK,
  COLOR_LIGHT_PINK,
  COLOR_MAROON,
  COLOR_PRIMARY,
  COLOR_RED,
  COLOR_WHITE,
  COLOR_YELLOW_DARK,
} from '../ThemeConstants';
import { Icon } from 'native-base';
import { ceil } from 'lodash';

let roomName = 'time';
// let token =
//   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzJiZGY1YTNiNjlhY2RmNTllZWNiMDExZjAyMDY2NzgzLTE2Mzg0MjcwNTgiLCJpc3MiOiJTSzJiZGY1YTNiNjlhY2RmNTllZWNiMDExZjAyMDY2NzgzIiwic3ViIjoiQUNkZmFjZjIxNzgyNGZjMDYzN2U1Zjk5YmRiNTEyMWIzOCIsImV4cCI6MTYzODQzMDY1OCwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiaHVtIiwidmlkZW8iOnsicm9vbSI6Imh1bSJ9fX0.m7673gxFuXQU6h5rrZXI2s7hPKPnxvY3mECG5cIf5R8';
export async function GetAllPermissions() {
  // it will ask the permission for user
  try {
    // if (Platform.OS === "android") {
    const userResponse = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    return userResponse;
    // }
  } catch (err) {
    console.log(err);
  }
  return null;
}

let tokenDictionary = {
  jawad:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzJiZGY1YTNiNjlhY2RmNTllZWNiMDExZjAyMDY2NzgzLTE2Mzg3ODY3ODIiLCJpc3MiOiJTSzJiZGY1YTNiNjlhY2RmNTllZWNiMDExZjAyMDY2NzgzIiwic3ViIjoiQUNkZmFjZjIxNzgyNGZjMDYzN2U1Zjk5YmRiNTEyMWIzOCIsImV4cCI6MTYzODc5MDM4MiwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiamF3YWQiLCJ2aWRlbyI6eyJyb29tIjoidGltZSJ9fX0.CBrlGZOf64edmVV-PVtxn7rCTyunzEvOUsJC0CxaTNY',
  osama:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzJiZGY1YTNiNjlhY2RmNTllZWNiMDExZjAyMDY2NzgzLTE2Mzg3ODYyNjAiLCJpc3MiOiJTSzJiZGY1YTNiNjlhY2RmNTllZWNiMDExZjAyMDY2NzgzIiwic3ViIjoiQUNkZmFjZjIxNzgyNGZjMDYzN2U1Zjk5YmRiNTEyMWIzOCIsImV4cCI6MTYzODc4OTg2MCwiZ3JhbnRzIjp7ImlkZW50aXR5Ijoib3NhbWEiLCJ2aWRlbyI6eyJyb29tIjoidGltZSJ9fX0.3UdOGCPsqA2stMQg6ku98OKuhBSKOnedPYzRe3Sd0jQ',

  faisal:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzJiZGY1YTNiNjlhY2RmNTllZWNiMDExZjAyMDY2NzgzLTE2Mzg3ODkxNDEiLCJpc3MiOiJTSzJiZGY1YTNiNjlhY2RmNTllZWNiMDExZjAyMDY2NzgzIiwic3ViIjoiQUNkZmFjZjIxNzgyNGZjMDYzN2U1Zjk5YmRiNTEyMWIzOCIsImV4cCI6MTYzODc5Mjc0MSwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiZmFpc2FsIiwidmlkZW8iOnsicm9vbSI6InRpbWUifX19.T_L0oF8gP9vpv2UtKElC-8z4mipRiA-IbuGWI1QyDd4',
};

const TwilioVideoChat = () => {
  const videoRef = useRef(null);

  const [status, setStatus] = useState(false);
  /////////////////////////////////////
  const [mute, setMute] = useState(false);
  const [initailsDone, setInitailsDone] = useState(false);
  const [muteVideo, setMuteVideo] = useState(false); //means defult video is not mute
  const [speaker, setSpeaker] = useState(false);

  // const [token, setToken] = useState('');
  const [name, setName] = useState('');

  const [participants, setParticipants] = useState([]);

  const startCall = () => {
    console.log('in on connect button preess in ', roomName);
    videoRef.current.connect({
      roomName: roomName,
      accessToken: tokenDictionary[name],
      enableVideo: true,
    });

    setStatus('connecting');
    console.log(status);
  };

  useEffect(() => {
    GetAllPermissions();
    if (videoRef.current) {
      //   startCall();
    }
  }, []);
  /////////////////////////

  const _onMuteButtonPress = () => {
    // on cliking the mic button we are setting it to mute or viceversa
    videoRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  //you cnnected to room
  const _onRoomDidConnect = () => {
    console.log('room did connected');
    setStatus('connected');
  };

  //you disconnected to room
  //you should then go back to chat room
  const _onRoomDidDisconnect = ({ roomName, error }) => {
    console.log('ERROR: ', JSON.stringify(error), 'roomName', roomName);
    console.log('disconnected');
    setStatus('disconnected');
    // props.navigation.pop();
  };

  //you failed to connect
  //show a toast message
  const _onRoomDidFailToConnect = error => {
    console.log('ERROR: ', JSON.stringify(error));
    console.log('failed to connect');
    setStatus('disconnected');
    // props.navigation.pop();
  };

  //when a room participabnt  is disconnected
  //participant wll be deleted
  const _onRoomParticipantDidDisconnect = argument => {
    console.log('room participant disconnected', argument);
    setParticipants(previousState =>
      previousState.filter(item => item.id !== argument.participant.identity),
    );
  };

  //participant

  //we will call it when user is added  it is also called when user video is re enabled
  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log(
      'participant added \ntrack===>',
      track,
      'participant===>',
      participant,
    );

    if (
      participants.some(item => item['id'] === participant.identity) === false
    ) {
      //means not already present
      setParticipants(previousState => [
        ...previousState,
        {
          id: participant.identity,
          trackIdentifier: {
            participantSid: participant.sid,
            videoTrackSid: track.trackSid,
          },
          video: track.enabled,
          audio: true,
        },
      ]);
    }
  };

  // when user  video is disabled
  //here we will display image of user
  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log('participant ', participant.identity, ' stopped video');

    let roughArray = participants;
    roughArray[
      roughArray.findIndex(item => item.id == participant.identity)
    ].video = track.enabled;
    console.log('roughArray', roughArray);
    setParticipants(roughArray);
  };

  ///Test it
  const _onParticipantEnabledVideoTrack = argument => {
    console.log('Video Enabled', argument);
  };

  const _onParticipantAddedAudioTrack = argument => {
    console.log('_onParticipantAddedAudioTrack', argument);
  };

  const _onParticipantEnabledAudioTrack = argument => {
    console.log('  onParticipantEnabledAudioTrack', argument);
  };

  const _onParticipantDisabledAudioTrack = argument => {
    console.log('  onParticipant Disavbled AudioTrack', argument);
  };

  //***************************All Functons

  //camera Switched
  const SwitchCamera = () => {
    // switches between fronst camera and Rare camera
    console.log('camera Switched');
    videoRef.current.flipCamera();
  };

  //local video disabled will place image
  const onChangeVideo = choice => {
    // switches between fronst camera and Rare camera
    console.log('video is ', choice ? 'on' : 'off');
    videoRef.current.setLocalVideoEnabled(choice);
  };

  //switches the local Audio
  const onChangeMic = choice => {
    console.log('Audio is ', choice ? 'on' : 'off');
    videoRef.current.setLocalAudioEnabled(choice);
  };

  const onChangeSpeaker = choice => {
    console.log('speaker is ', choice ? 'on' : 'off');
    videoRef.current.toggleSoundSetup(choice);
  };

  // you are disconnected locally
  const EndCall = () => {
    videoRef.current.disconnect();
    setStatus('disconnected');
    console.log('disconnected');
    // props.navigation.pop();
  };

  //...............................

  ////////////////////////////

  //UI

  const BottomButtons = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          marginBottom: height(7),
          alignItems: 'center',
          alignSelf: 'center',
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setMuteVideo(!muteVideo);
            onChangeVideo(muteVideo);
          }}
          style={[styles.BottomButtonStyle, { backgroundColor: COLOR_WHITE }]}
        >
          <Icon
            type={'MaterialIcons'}
            name={muteVideo ? 'videocam-off' : 'videocam'}
            style={{ fontSize: width(10), color: COLOR_PRIMARY }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={SwitchCamera}
          style={[styles.BottomButtonStyle, { backgroundColor: COLOR_WHITE }]}
        >
          <Icon
            type={'Ionicons'}
            name={'camera-reverse-outline'}
            style={{ fontSize: width(10), color: COLOR_PRIMARY }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={EndCall}
          style={[styles.BottomButtonStyle, { height: 60, width: 60 }]}
        >
          <Icon
            type={'Entypo'}
            name={'phone'}
            style={{ fontSize: width(10), color: COLOR_WHITE }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setMute(!mute);
            onChangeMic(mute);
          }}
          style={[styles.BottomButtonStyle, { backgroundColor: COLOR_WHITE }]}
        >
          <Icon
            type={'FontAwesome5'}
            name={mute === true ? 'microphone-alt-slash' : 'microphone-alt'}
            style={{ fontSize: width(7), color: COLOR_PRIMARY }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setSpeaker(!speaker);
            onChangeSpeaker(!speaker);
          }}
          style={[styles.BottomButtonStyle, { backgroundColor: COLOR_WHITE }]}
        >
          <Icon
            type={'MaterialCommunityIcons'}
            name={speaker === true ? 'volume-high' : 'volume-off'}
            style={{ fontSize: width(7), color: COLOR_PRIMARY }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // const LocalView = () => {
  //   //we will make it draggalble
  //   // console.log('infor mation===', await _engine.getUserInfoByUid(participants[-1]));
  //   return (
  //     <View
  //       style={{
  //         height: height(20),
  //         width: width(30),
  //         backgroundColor: COLOR_DARK_PINK,
  //         position: 'absolute',
  //         top: 50,
  //         zIndex: 10,
  //       }}
  //     >
  //       <TwilioVideoLocalView
  //         enabled={true}
  //         // identity={'hum'}
  //         scaleType={'fill'}
  //         style={{
  //           flex: 1,
  //           //   isButtonDisplay: true,
  //         }}
  //       />
  //     </View>
  //   );
  // };

  const LocalView = () => {
    // console.log('infor mation===', await _engine.getUserInfoByUid(peerIds[-1]));
    return status === 'connected' ? (
      <View style={[styles.localView]}>
        <TwilioVideoLocalView
          enabled={true}
          // identity={'hum'}
          scaleType={'fill'}
          style={{
            flex: 1,
            //   isButtonDisplay: true,
          }}
        />
      </View>
    ) : null;
  };
  const RemoteView = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLOR_MAROON,
          // justifyContent: 'flex-end',
        }}
      >
        {participants.map((item, index) => {
          return item !== undefined ? (
            <TwilioVideoParticipantView
              style={{ flex: 1 }}
              key={index}
              trackIdentifier={item.trackIdentifier}
            />
          ) : null;
        })}
      </View>
    );
  };

  useEffect(() => {
    console.log('status', status);
  }, []);

  useEffect(() => {
    console.log('Participants ===>', participants);
  }, [participants]);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        value={name}
        onChangeText={value => {
          setName(value);
        }}
      />
      <TouchableOpacity
        onPress={startCall}
        style={{
          backgroundColor: COLOR_YELLOW_DARK,
          height: height(5),
          alignItems: 'center',
        }}
      >
        <Text style={{ color: COLOR_WHITE }}>connect</Text>
      </TouchableOpacity>
      {/* local video */}
      <Draggable
        x={width(1)}
        y={height(2)}
        maxX={width(100)}
        maxY={height(80)}
        minX={width(0)}
        minY={height(0)}
      >
        <LocalView />
      </Draggable>

      <RemoteView />
      <BottomButtons />
      <TwilioVideo
        ref={videoRef} //={'TwilioVideo'}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
        onParticipantEnabledVideoTrack={_onParticipantEnabledVideoTrack}
        onParticipantAddedAudioTrack={_onParticipantAddedAudioTrack}
        onParticipantEnabledAudioTrack={_onParticipantEnabledAudioTrack}
        onParticipantDisabledAudioTrack={_onParticipantDisabledAudioTrack}
        // onParticipantDisabledVideoTrack={_onParticipantDisabledVideoTrack}
        // onRoomParticipantDidConnect={_onRoomParticipantDidConnect}
        onRoomParticipantDidDisconnect={_onRoomParticipantDidDisconnect}
        // onCameraDidStopRunning={_onCameraDidStopRunning}
        // onParticipantAddedAudioTrack={_onParticipantAddedAudioTrack}
        // onParticipantRemovedAudioTrack={_onParticipantRemovedAudioTrack}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  BottomButtonStyle: {
    height: 50,
    width: 50,
    backgroundColor: COLOR_RED,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginHorizontal: 5,
    elevation: 3,
  },

  localView: {
    width: width(35),
    height: height(25),
    borderWidth: width(0.5),

    borderColor: COLOR_PRIMARY,
    // position: 'absolute',
    zIndex: 10,
    // top: 0,
    // left: 0,
  },
});
export default TwilioVideoChat;
