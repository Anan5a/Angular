import { Injectable, signal } from '@angular/core';
import { BaseNetworkService } from './base-network.service';
import { HttpClient } from '@angular/common/http';
import { ApiBaseUrl } from '../../constants';
import { RTCConnModel, RTCRequestResponseModel } from '../app.models';

@Injectable({
  providedIn: 'root'
})
export class VoiceCallService extends BaseNetworkService {

  private localStream!: MediaStream;
  private rtcConfig: RTCConfiguration = {};
  private peerConnection?: RTCPeerConnection | null;
  public callUserId = signal(0);
  public callState = signal('idle'); // Added call state tracking

  constructor(httpClient: HttpClient) {
    super(httpClient);
    this.setupLocalStream();
  }

  public sendOffer(userId: number, offer: string) {
    const url = `${ApiBaseUrl}/Calling/offerCall`;
    const errorMessage = 'Failed to call user!';
    return this.post<RTCConnModel, RTCRequestResponseModel>(url, { targetUserId: userId, data: this.encodeB64(offer) }, errorMessage);
  }

  public sendAnswer(userId: number, answer: string) {
    const url = `${ApiBaseUrl}/Calling/answerCall`;
    const errorMessage = 'Failed to answer call!';
    return this.post<RTCConnModel, RTCRequestResponseModel>(url, { targetUserId: userId, data: this.encodeB64(answer) }, errorMessage);
  }

  public sendIceCandidate(userId: number, candidate: string) {
    const url = `${ApiBaseUrl}/Calling/sendICECandidate`;
    const errorMessage = 'Failed to send ICE data!';
    return this.post<RTCConnModel, RTCRequestResponseModel>(url, { targetUserId: userId, data: this.encodeB64(candidate) }, errorMessage);
  }

  private encodeB64(data: string) {
    return btoa(data);
  }

  async checkMicrophoneAccess() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone access denied: ', error);
      return false;
    }
  }

  async startCall(userId: number) {
    if (this.callState() !== 'idle') {
      console.warn('Cannot start call: already in a call.');
      return;
    }
    this.callUserId.set(userId);
    this.callState.set('calling');
    await this.setupLocalStream();
    await this.createAndSendOffer(userId);
  }

  private async setupLocalStream() {
    this.peerConnection = new RTCPeerConnection(this.rtcConfig);

    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
      }
    });

    this.localStream.getTracks().forEach(track => {
      this.peerConnection?.addTrack(track, this.localStream);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendIceCandidate(this.callUserId(), JSON.stringify(event.candidate)).subscribe();
      }
    };

    this.peerConnection.ontrack = (event) => {
      const audio = new Audio();
      audio.srcObject = event.streams[0];
      audio.play();
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log(this.peerConnection?.iceConnectionState);
      if (this.peerConnection?.iceConnectionState === 'connected') {
        console.log('Peers connected!');
        this.callState.set('in-call');
      } else if (this.peerConnection?.iceConnectionState === 'disconnected') {
        console.log('Peers disconnected.');
        this.callState.set('disconnected');
      } else if (this.peerConnection?.iceConnectionState === 'failed') {
        console.error('Connection failed.');
        // Handle reconnection or notify the user
      }
    };
  }

  private async createAndSendOffer(userId: number) {
    const offer = await this.peerConnection?.createOffer();
    await this.peerConnection?.setLocalDescription(offer);
    this.sendOffer(userId, JSON.stringify(offer)).subscribe();
  }

  async handleRTCSignal(remoteData: {}) {
    //@ts-ignore
    const parsedSignal = JSON.parse(atob(remoteData.callData));
    try {
      if (parsedSignal.sdp) {
        // if (this.callState() !== 'idle') {
        //   console.warn('Invalid state for handling SDP: ', this.callState());
        //   return;
        // }

        await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(parsedSignal));
        if (this.peerConnection?.remoteDescription?.type === 'offer') {
          console.log("offer; send answer");
          const answer = await this.peerConnection?.createAnswer();
          await this.peerConnection?.setLocalDescription(answer);
          //@ts-ignore
          this.sendAnswer(remoteData.metadata.targetUserId, JSON.stringify(answer)).subscribe();
        }
      } else if (parsedSignal.candidate) {
        // if (this.callState() !== 'in-call') {
        //   console.warn('Invalid state for handling ICE candidate: ', this.callState());
        //   return;
        // }
        console.log("set IceCandidate");
        await this.peerConnection?.addIceCandidate(new RTCIceCandidate(parsedSignal));
      }
    } catch (error) {
      console.error('Error handling signal: ', error);
      alert('An error occurred while processing the call signal.');
    }
  }

  endCall() {
    // Stop local media tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    // Close the peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Update state
    this.callState.set('idle');
    alert('Call ended.');
  }
}
