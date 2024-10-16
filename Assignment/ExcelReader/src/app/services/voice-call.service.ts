import { Injectable, signal } from '@angular/core';
import { BaseNetworkService } from './base-network.service';
import { HttpClient } from '@angular/common/http';
import { ApiBaseUrl } from '../../constants';
import { RTCConnModel, RTCRequestResponseModel } from '../app.models';

@Injectable({
  providedIn: 'root',
})
export class VoiceCallService extends BaseNetworkService {
  private localStream!: MediaStream;
  private peerConnection?: RTCPeerConnection | null;
  public callUserId = signal(0);
  public callState = signal<'idle' | 'in-call' | 'calling' | 'disconnected'>(
    'idle'
  );

  private rtcConfig: RTCConfiguration = {
    iceServers: [
      // {
      //   urls: 'stun:stun.relay.metered.ca:80',
      // },
      // {
      //   urls: 'turn:global.relay.metered.ca:80',
      //   username: 'b38d4b896baa144a0d36b815',
      //   credential: 'nMFN+eR4YE5+SFvg',
      // },
      // {
      //   urls: 'turn:global.relay.metered.ca:80?transport=tcp',
      //   username: 'b38d4b896baa144a0d36b815',
      //   credential: 'nMFN+eR4YE5+SFvg',
      // },
      // {
      //   urls: 'turn:global.relay.metered.ca:443',
      //   username: 'b38d4b896baa144a0d36b815',
      //   credential: 'nMFN+eR4YE5+SFvg',
      // },
      // {
      //   urls: 'turns:global.relay.metered.ca:443?transport=tcp',
      //   username: 'b38d4b896baa144a0d36b815',
      //   credential: 'nMFN+eR4YE5+SFvg',
      // },
    ],
  };

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public async startCall(userId: number) {
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
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.peerConnection = new RTCPeerConnection(this.rtcConfig);

    this.localStream.getTracks().forEach((track) => {
      console.log('Audio track added:', track);
      this.peerConnection?.addTrack(track, this.localStream);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendIceCandidate(
          this.callUserId(),
          JSON.stringify(event.candidate)
        ).subscribe();
      } else {
        console.log('All ICE candidates have been sent.');
      }
    };

    this.peerConnection.ontrack = (event) => {
      const audio = new Audio();
      audio.srcObject = event.streams[0];
      audio.play();
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      this.handleConnectionStateChange();
    };
  }

  private async createAndSendOffer(userId: number) {
    const offer = await this.peerConnection?.createOffer();
    await this.peerConnection?.setLocalDescription(offer);
    await this.sendOffer(userId, JSON.stringify(offer)).subscribe();
  }

  public sendOffer(userId: number, offer: string) {
    return this.post<RTCConnModel, RTCRequestResponseModel>(
      `${ApiBaseUrl}/Calling/offerCall`,
      { targetUserId: userId, data: this.encodeB64(offer) },
      'Failed to call user!'
    );
  }

  public sendAnswer(userId: number, answer: string) {
    return this.post<RTCConnModel, RTCRequestResponseModel>(
      `${ApiBaseUrl}/Calling/answerCall`,
      { targetUserId: userId, data: this.encodeB64(answer) },
      'Failed to answer call!'
    );
  }

  public sendIceCandidate(userId: number, candidate: string) {
    return this.post<RTCConnModel, RTCRequestResponseModel>(
      `${ApiBaseUrl}/Calling/sendICECandidate`,
      { targetUserId: userId, data: this.encodeB64(candidate) },
      'Failed to send ICE data!'
    );
  }

  private encodeB64(data: string) {
    return btoa(data);
  }

  async handleRTCSignal(remoteData: {}) {
    const parsedSignal = JSON.parse(atob((remoteData as any).callData));

    //this was the bug :'( How were I going to answer without knowing who's calling...
    if (this.callUserId() == 0) {
      console.log('Set incoming caller id...');
      //@ts-ignore
      this.callUserId.set(remoteData.metadata.targetUserId as number);
    }
    try {
      if (parsedSignal.candidate) {
        console.log('Remote ICE candidate...');
        await this.handleIceCandidate(parsedSignal);
      } else if (parsedSignal.type) {
        switch (parsedSignal.type) {
          case 'answer':
            await this.handleAnswer(parsedSignal);
            break;
          case 'offer':
            await this.handleOffer(parsedSignal, remoteData);
            break;
        }
      }
    } catch (error) {
      console.error('Error handling signal:', error);
    }
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (this.isPeerConnectionOpen()) {
      console.log('Handling answer');
      await this.peerConnection?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  }

  private async handleOffer(offer: RTCSessionDescriptionInit, remoteData: any) {
    if (!this.peerConnection) {
      await this.setupLocalStream();
    }
    console.log('Handling offer');
    await this.peerConnection?.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await this.peerConnection?.createAnswer();
    await this.peerConnection?.setLocalDescription(answer);
    this.sendAnswer(
      remoteData.metadata.targetUserId,
      JSON.stringify(answer)
    ).subscribe();
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (this.isPeerConnectionOpen()) {
      console.log('Handling ICE candidate');
      await this.peerConnection?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    }
  }

  private isPeerConnectionOpen(): boolean {
    return (
      this.peerConnection !== null &&
      this.peerConnection?.iceConnectionState !== 'closed'
    );
  }

  private handleConnectionStateChange() {
    console.log('Connection State:', this.peerConnection?.iceConnectionState);
    switch (this.peerConnection?.iceConnectionState) {
      case 'connected':
        console.log('Peers connected!');
        this.callState.set('in-call');
        break;
      case 'disconnected':
      case 'failed':
        console.error(
          'Connection ' + this.peerConnection?.iceConnectionState + '...'
        );
        this.endCall();

        break;
    }
  }

  endCall() {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.peerConnection?.close();
    this.peerConnection = null;
    this.callState.set('idle');
    console.info('Call ended.');
  }
}
