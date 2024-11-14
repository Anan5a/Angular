import { Injectable, signal } from '@angular/core';
import { BaseNetworkService } from './base-network.service';
import { HttpClient } from '@angular/common/http';
import { ApiBaseUrl } from '../../constants';
import { RTCConnModel, RTCRequestResponseModel } from '../app.models';
import { MatDialog } from '@angular/material/dialog';
import { CallDialogComponent } from '../dashboard/chat/call-dialog/call-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class VoiceCallService extends BaseNetworkService {
  private localStream!: MediaStream;
  private peerConnection?: RTCPeerConnection | null;
  public callUserId = signal(0); //coming from signaling server
  public callUserName = signal(''); //coming from signaling server
  private currentDialog: any;
  private userSelection = signal<'accepted' | 'rejected' | null>(null);
  private callId = 'call:' + Math.random().toString().substring(0, 8);
  public callState = signal<'idle' | 'in-call' | 'calling' | 'disconnected'>(
    'idle'
  );
  private ringtoneAudio = new Audio('/call_ring_1.wav');
  private outRingtoneAudio = new Audio('/ring_tone.mp3');

  private rtcConfig: RTCConfiguration = {
    iceServers: [
      {
        urls: 'stun:stun.relay.metered.ca:80',
      },
      {
        urls: 'turn:global.relay.metered.ca:80',
        username: 'b38d4b896baa144a0d36b815',
        credential: 'nMFN+eR4YE5+SFvg',
      },
      {
        urls: 'turn:global.relay.metered.ca:80?transport=tcp',
        username: 'b38d4b896baa144a0d36b815',
        credential: 'nMFN+eR4YE5+SFvg',
      },
      {
        urls: 'turn:global.relay.metered.ca:443',
        username: 'b38d4b896baa144a0d36b815',
        credential: 'nMFN+eR4YE5+SFvg',
      },
      {
        urls: 'turns:global.relay.metered.ca:443?transport=tcp',
        username: 'b38d4b896baa144a0d36b815',
        credential: 'nMFN+eR4YE5+SFvg',
      },
    ],
  };

  constructor(httpClient: HttpClient, private callDialog: MatDialog) {
    super(httpClient);
  }
  get callStateLive() {
    return this.callState.asReadonly();
  }
  //handles the answer of the other party
  async handleCallAnswer(message: any) {
    //after we got answer start the rtc comm.
    //change the dialog

    //check call id
    const parts = (message.callData as string).split(':');
    if (parts.length < 3) {
      console.warn('Invalid Call ID, exiting...');
      this.endCall();
    }
    const id = parts[0] + ':' + parts[1];

    if (this.callId != id) {
      //id mismatch, cleanup
      console.warn('Call ID mismatch, exiting...');
      this.endCall();
    }
    this.stopOutgoingRingtone();
    this.stopRingtone();

    if (parts[2] == 'rejected' || parts[2] == 'end') {
      this.currentDialog?.close();
      console.warn('Call was rejected by remote, exiting...');
      this.showDialogAndGetAction(
        `Call ${parts[2]}`,
        'Call ended',
        this.callback,
        false,
        false,
        true,
        true
      );
      this.endCall(id);
      return;
    }

    this.showDialogAndGetAction(
      'Ongoing call',
      'In call with ' + this.callUserName() + '...',
      this.callback,
      false,
      false,
      true
    );
    await this.setupLocalStream();
    await this.createAndSendOffer(this.callUserId());
    this.userSelection?.set('accepted');
  }
  async handleUserAssignmentFromRTCSignal(message: any) {
    //after we got answer start the rtc comm.
    //change the dialog

    //check call id
    const parts = (message.callData as string).split(':');
    if (parts.length < 3) {
      console.warn('Invalid Call ID, exiting...');
      this.endCall();
    }
    const id = parts[0] + ':' + parts[1];

    if (this.callId != id) {
      //id mismatch, cleanup
      console.warn('Call ID mismatch, exiting...');
      this.endCall();
    }
  }

  //handles incoming request
  async handleCallRequest(message: any) {
    //after we got answer start the rtc comm.
    //change the dialog
    //start ringing
    this.playRingtone();
    this.callId = message.callData;
    this.currentDialog?.close();
    this.showDialogAndGetAction(
      'Incoming call',
      'Call from ' + this.callUserName() + '...',
      this.callback,
      true,
      true,
      false
    );
  }
  private callback = () => {
    this.stopRingtone();
    this.stopOutgoingRingtone();
    if (this.userSelection() == 'accepted') {
      this.sendCallOfferAnswer(
        this.callUserId(),
        this.userSelection()!
      ).subscribe();
      this.showDialogAndGetAction(
        'Ongoing call',
        'Call from ' + this.callUserName() + '...',
        this.callback,
        false,
        false,
        true,
        true
      );
    }
    if (this.userSelection() == 'rejected') {
      console.log('rejecting...');
      this.sendCallOfferAnswer(
        this.callUserId(),
        this.userSelection()!
      ).subscribe();

      this.endCall();
    }
  };
  private showDialogAndGetAction(
    title: string,
    message: string,
    callback: any = null,
    showAccept: boolean = false,
    showReject: boolean = false,
    showCancel: boolean = false,
    forceCloseDialog = false
  ) {
    if (this.currentDialog && !forceCloseDialog) {
      return;
    } else if (forceCloseDialog) {
      this.currentDialog?.close();
    }

    this.currentDialog = this.callDialog.open(CallDialogComponent, {
      data: {
        title,
        message,
        showAccept,
        showReject,
        showCancel,
      },
      disableClose: true,
    });

    this.currentDialog.componentInstance.actionEvent.subscribe(
      (result: string) => {
        if (result === 'accepted') {
          console.log('Call accepted');
          this.userSelection.set('accepted');
        } else if (result === 'rejected') {
          console.log('Call rejected');
          this.userSelection.set('rejected');
        }
        if (callback != null) {
          console.log('invoke callback');
          callback();
        }
      }
    );

    this.currentDialog.afterClosed().subscribe(() => {
      this.currentDialog = null;
    });
  }
  public async startCall(userId: number, userName: string) {
    if (this.callState() !== 'idle') {
      alert('Cannot call. Incosistent state.');
      console.warn('Cannot start call: already in a call.');
      return;
    }
    this.callUserId.set(userId);
    this.callUserName.set(userName);
    this.setupLocalStream();
    this.checkMicAccess().then((accessGranted) => {
      if (accessGranted) {
        this.callState.set('calling');
        //show a calling dialog and wait till we receive answer from other end
        this.playOutgoingRingtone();
        this.showDialogAndGetAction(
          'Outgoing call',
          `Calling ${this.callUserName()} ...`,
          this.callback,
          false,
          false,
          true
        );
        this.sendCallOffer('').subscribe();
      } else {
        alert('Microphone access is required.');
      }
    });
  }

  async checkMicAccess() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone access denied:', error);
      return false;
    }
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
  public sendCallOffer(offer: string) {
    return this.post<RTCConnModel, RTCRequestResponseModel>(
      `${ApiBaseUrl}/Calling/offerCallRequest`,
      { targetUserId: this.callUserId(), data: this.callId },
      'Failed to call user!'
    );
  }
  public sendCallOfferAnswer(userId: number, offer: string, callId?: string) {
    return this.post<RTCConnModel, RTCRequestResponseModel>(
      `${ApiBaseUrl}/Calling/offerCallRequestAnswer`,
      { targetUserId: userId, data: (callId ?? this.callId) + ':' + offer },
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
    if (this.callUserId() === 0) {
      console.log('Set incoming caller id...');
      //@ts-ignore
      this.callUserId.set(remoteData.metadata.targetUserId);
      //@ts-ignore
      this.callUserName.set(remoteData.metadata.targetUserName);
    }
    //check if we got a call request answer
    if (((remoteData as any).callData as string).split(':').length > 2) {
      //we got answer
      console.log('Outgoing call answer...');
      this.handleCallAnswer(remoteData);
      return;
    }

    //check if we got a call request
    if (((remoteData as any).callData as string).substring(0, 4) === 'call') {
      //yes, show notification and send answer
      console.log('Incoming call request...');
      //first check if we are in call already
      if (
        this.callState() != 'idle' &&
        ((remoteData as any).callData as string).split(':').length > 1
      ) {
        //already in-call, reject by default
        console.log('In-call, rejecting...');

        this.sendCallOfferAnswer(
          //@ts-ignore
          remoteData.metadata.targetUserId,
          'rejected',
          ((remoteData as any).callData as string).split(':')[1]
        ).subscribe();
        return;
      }

      this.handleCallRequest(remoteData);
      return;
    }

    const parsedSignal = JSON.parse(atob((remoteData as any).callData));
    try {
      if (parsedSignal.candidate) {
        if (this.peerConnection) {
          console.log('Remote ICE candidate...');
          await this.handleIceCandidate(parsedSignal);
        }
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
    } else {
      console.warn('PeerConnection not open...');
    }
  }

  private isPeerConnectionOpen(): boolean {
    return (
      this.peerConnection !== null &&
      this.peerConnection?.iceConnectionState !== 'closed'
    );
  }

  private handleConnectionStateChange() {
    const state = this.peerConnection?.iceConnectionState;
    console.log('Connection State:', state);
    switch (state) {
      case 'connected':
        console.log('Peers connected!');
        this.callState.set('in-call');
        break;
      case 'disconnected':
      case 'failed':
        console.error('Connection ' + state + '...');
        this.endCall();
        break;
    }
  }

  playRingtone(): void {
    this.ringtoneAudio.loop = true; // Loop the audio if needed
    this.ringtoneAudio
      .play()
      .catch((error) => console.error('Error playing audio:', error));
  }

  stopRingtone(): void {
    this.ringtoneAudio.pause();
    this.ringtoneAudio.currentTime = 0; // Reset to the beginning
  }

  playOutgoingRingtone(): void {
    this.outRingtoneAudio.loop = true; // Loop the audio if needed
    this.outRingtoneAudio
      .play()
      .catch((error) => console.error('Error playing audio:', error));
  }

  stopOutgoingRingtone(): void {
    this.outRingtoneAudio.pause();
    this.outRingtoneAudio.currentTime = 0; // Reset to the beginning
  }

  endCall(incomingCallId: string = '') {
    //only end valid call id
    if (
      incomingCallId.length > 1 &&
      incomingCallId.substring(0, 13) == this.callId
    ) {
      this.sendCallOfferAnswer(this.callUserId(), 'end').subscribe();
    }

    this.localStream?.getTracks().forEach((track) => track.stop());
    this.peerConnection?.close();
    this.peerConnection = null;
    this.callState.set('idle');
    this.userSelection?.set(null);
    this.callUserId.set(0);
    this.callUserName.set('');
    this.callId = 'call:' + Math.random().toString().substring(0, 8);
    console.info('Call ended.');
  }
}
