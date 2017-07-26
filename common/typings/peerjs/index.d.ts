// Type definitions for PeerJS
// Project: http://peerjs.com/
// Definitions by: Toshiya Nakakura <https://github.com/nakakura>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

type EventHandler = (event: Event) => void;

// https://www.w3.org/TR/webrtc/#idl-def-rtcofferansweroptions
interface RTCOfferAnswerOptions {
  voiceActivityDetection?: boolean; // default = true
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcofferoptions
interface RTCOfferOptions extends RTCOfferAnswerOptions {
  iceRestart?: boolean; // default = false
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcansweroptions
interface RTCAnswerOptions extends RTCOfferAnswerOptions {
}
// https://www.w3.org/TR/webrtc/#idl-def-rtcrtpparameters
interface RTCRtpParameters {
  transactionId: string;
  //encodings: RTCRtpEncodingParameters[];
  //headerExtensions: RTCRtpHeaderExtensionParameters[];
  //rtcp: RTCRtcpParameters;
  //codecs: RTCRtpCodecParameters[];
  degradationPreference?: RTCDegradationPreference; // default = 'balanced'
}

// https://www.w3.org/TR/webrtc/#dom-rtcrtpcontributingsource
interface RTCRtpContributingSource {
  //readonly timestamp: number;
  readonly source: number;
  //readonly audioLevel: number | null;
  readonly voiceActivityFlag: boolean | null;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcdtlstransport
interface RTCDtlsTransport {
  readonly transport: RTCIceTransport;
  //readonly state: RTCDtlsTransportState;
  getRemoteCertificates(): ArrayBuffer[];
  onstatechange: EventHandler;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcrtpcodeccapability
interface RTCRtpCodecCapability {
  mimeType: string;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcrtpheaderextensioncapability
interface RTCRtpHeaderExtensionCapability {
  uri: string;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcrtpcapabilities
interface RTCRtpCapabilities {
  //codecs: RTCRtpCodecCapability[];
  //headerExtensions: RTCRtpHeaderExtensionCapability[];
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcrtprtxparameters
interface RTCRtpRtxParameters {
  //ssrc: number;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcrtpfecparameters
interface RTCRtpFecParameters {
  //ssrc: number;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcdtxstatus
type RTCDtxStatus = 'disabled' | 'enabled';

// https://www.w3.org/TR/webrtc/#idl-def-rtcprioritytype
type RTCPriorityType = 'very-low' | 'low' | 'medium' | 'high';
// https://www.w3.org/TR/webrtc/#idl-def-rtcrtpcapabilities
interface RTCRtcCapabilities {
  codecs: RTCRtpCodecCapability[];
  headerExtensions: RTCRtpHeaderExtensionCapability[];
}

// https://www.w3.org/TR/webrtc/#dom-rtcrtpsender
interface RTCRtpSender {
  //readonly track?: MediaStreamTrack;
  //readonly transport?: RTCDtlsTransport;
  //readonly rtcpTransport?: RTCDtlsTransport;
  setParameters(parameters?: RTCRtpParameters): Promise<void>;
  getParameters(): RTCRtpParameters;
  replaceTrack(withTrack: MediaStreamTrack): Promise<void>;
}
interface RTCRtpSenderStatic {
  new(): RTCRtpSender;
  getCapabilities(kind: string): RTCRtpCapabilities;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcrtpreceiver
interface RTCRtpReceiver {
  //readonly track?: MediaStreamTrack;
  //readonly transport?: RTCDtlsTransport;
  //readonly rtcpTransport?: RTCDtlsTransport;
  getParameters(): RTCRtpParameters;
  getContributingSources(): RTCRtpContributingSource[];
}
interface RTCRtpReceiverStatic {
  new(): RTCRtpReceiver;
  getCapabilities(kind: string): RTCRtcCapabilities;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcrtptransceiverdirection
type RTCRtpTransceiverDirection = 'sendrecv' | 'sendonly' | 'recvonly' | 'inactive';

// https://www.w3.org/TR/webrtc/#idl-def-rtcrtptransceiver
interface RTCRtpTransceiver {
  readonly mid: string | null;
  readonly sender: RTCRtpSender;
  readonly receiver: RTCRtpReceiver;
  readonly stopped: boolean;
  readonly direction: RTCRtpTransceiverDirection;
  setDirection(direction: RTCRtpTransceiverDirection): void;
  stop(): void;
  setCodecPreferences(codecs: RTCRtpCodecCapability[]): void;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcrtptransceiverinit
interface RTCRtpTransceiverInit {
  direction?: RTCRtpTransceiverDirection; // default = 'sendrecv'
  streams: MediaStream[];
  sendEncodings: RTCRtpEncodingParameters[];
}

// https://www.w3.org/TR/webrtc/#dom-rtccertificate
interface RTCCertificate {
  readonly expires: number;
  getAlgorithm(): string;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcconfiguration
interface RTCConfiguration {
  iceServers?: RTCIceServer[];
  iceTransportPolicy?: RTCIceTransportPolicy; // default = 'all'
  bundlePolicy?: RTCBundlePolicy; // default = 'balanced'
  rtcpMuxPolicy?: RTCRtcpMuxPolicy; // default = 'require'
  peerIdentity?: string; // default = null
  certificates?: RTCCertificate[];
  iceCandidatePoolSize?: number; // default = 0
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcrtcpmuxpolicy
type RTCRtcpMuxPolicy = 'negotiate' | 'require';

// https://www.w3.org/TR/webrtc/#idl-def-rtcsctptransport
interface RTCSctpTransport {
  readonly transport: RTCDtlsTransport;
  readonly maxMessageSize: number;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcdatachannelinit
interface RTCDataChannelInit {
  ordered?: boolean; // default = true
  maxPacketLifeTime?: number;
  maxRetransmits?: number;
  protocol?: string; // default = ''
  negotiated?: boolean; // default = false
  id?: number;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcdatachannelstate
type RTCDataChannelState = 'connecting' | 'open' | 'closing' | 'closed';

// https://www.w3.org/TR/websockets/#dom-websocket-binarytype
type RTCBinaryType = 'blob' | 'arraybuffer';

// https://www.w3.org/TR/webrtc/#idl-def-rtcdatachannel
interface RTCDataChannel extends EventTarget {
  readonly label: string;
  readonly ordered: boolean;
  readonly maxPacketLifeTime: number | null;
  readonly maxRetransmits: number | null;
  readonly protocol: string;
  readonly negotiated: boolean;
  readonly id: number;
  readonly readyState: RTCDataChannelState;
  readonly bufferedAmount: number;
  bufferedAmountLowThreshold: number;
  binaryType: RTCBinaryType;

  close(): void;
  send(data: string | Blob | ArrayBuffer | ArrayBufferView): void;

  onopen: EventHandler;
  onmessage: (event: MessageEvent) => void;
  onbufferedamountlow: EventHandler;
  onerror: (event: ErrorEvent) => void;
  onclose: EventHandler;
}

// https://www.w3.org/TR/webrtc/#h-rtctrackevent
interface RTCTrackEvent extends Event {
  readonly receiver: RTCRtpReceiver;
  readonly track: MediaStreamTrack;
  readonly streams: MediaStream[];
  readonly transceiver: RTCRtpTransceiver;
}

// https://www.w3.org/TR/webrtc/#h-rtcpeerconnectioniceevent
interface RTCPeerConnectionIceEvent extends Event {
  readonly candidate: RTCIceCandidate | null;
  readonly url: string;
}

// https://www.w3.org/TR/webrtc/#h-rtcpeerconnectioniceerrorevent
interface RTCPeerConnectionIceErrorEvent extends Event {
  readonly hostCandidate: string;
  readonly url: string;
  readonly errorCode: number;
  readonly errorText: string;
}

// https://www.w3.org/TR/webrtc/#h-rtcdatachannelevent
interface RTCDataChannelEvent {
  readonly channel: RTCDataChannel;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcdatachannel
interface RTCDataChannel extends EventTarget {
  readonly label: string;
  readonly ordered: boolean;
  readonly maxPacketLifeTime: number | null;
  readonly maxRetransmits: number | null;
  readonly protocol: string;
  readonly negotiated: boolean;
  readonly id: number;
  readonly readyState: RTCDataChannelState;
  readonly bufferedAmount: number;
  bufferedAmountLowThreshold: number;
  binaryType: RTCBinaryType;

  close(): void;
  send(data: string | Blob | ArrayBuffer | ArrayBufferView): void;

  onopen: EventHandler;
  onmessage: (event: MessageEvent) => void;
  onbufferedamountlow: EventHandler;
  onerror: (event: ErrorEvent) => void;
  onclose: EventHandler;
}

// Compatibility for older definitions on DefinitelyTyped.
type RTCPeerConnectionConfig = RTCConfiguration;


declare namespace PeerJs{
    interface PeerJSOption{
        key?: string;
        host?: string;
        port?: number;
        path?: string;
        secure?: boolean;
        config?: RTCPeerConnectionConfig;
        debug?: number;
    }

    interface PeerConnectOption{
        label?: string;
        metadata?: any;
        serialization?: string;
        reliable?: boolean;

    }

    interface DataConnection{
        send(data: any): void;
        close(): void;
        on(event: string, cb: ()=>void): void;
        on(event: 'data', cb: (data: any)=>void): void;
        on(event: 'open', cb: ()=>void): void;
        on(event: 'close', cb: ()=>void): void;
        on(event: 'error', cb: (err: any)=>void): void;
        off(event: string, fn: Function, once?: boolean): void;
        dataChannel: RTCDataChannel;
        label: string;
        metadata: any;
        open: boolean;
        peerConnection: any;
        peer: string;
        reliable: boolean;
        serialization: string;
        type: string;
        buffSize: number;
    }

    interface MediaConnection{
        answer(stream?: any): void;
        close(): void;
        on(event: string, cb: ()=>void): void;
        on(event: 'stream', cb: (stream: any)=>void): void;
        on(event: 'close', cb: ()=>void): void;
        on(event: 'error', cb: (err: any)=>void): void;
        off(event: string, fn: Function, once?: boolean): void;
        open: boolean;
        metadata: any;
        peer: string;
        type: string;
    }

    interface utilSupportsObj {
        audioVideo: boolean;
        data: boolean;
        binary: boolean;
        reliable: boolean;
    }

    interface util{
        browser: string;
        supports: utilSupportsObj;
    }

    export interface Peer{
        /**
         *
         * @param id The brokering ID of the remote peer (their peer.id).
         * @param options for specifying details about Peer Connection
         */
        connect(id: string, options?: PeerJs.PeerConnectOption): PeerJs.DataConnection;
        /**
         * Connects to the remote peer specified by id and returns a data connection.
         * @param id The brokering ID of the remote peer (their peer.id).
         * @param stream The caller's media stream
         * @param options Metadata associated with the connection, passed in by whoever initiated the connection.
         */
        call(id: string, stream: any, options?: any): PeerJs.MediaConnection;
        /**
         * Calls the remote peer specified by id and returns a media connection.
         * @param event Event name
         * @param cb Callback Function
         */
        on(event: string, cb: ()=>void): void;
        /**
         * Emitted when a connection to the PeerServer is established.
         * @param event Event name
         * @param cb id is the brokering ID of the peer
         */
        on(event: 'open', cb: (id: string)=>void): void;
        /**
         * Emitted when a new data connection is established from a remote peer.
         * @param event Event name
         * @param cb Callback Function
         */
        on(event: 'connection', cb: (dataConnection: PeerJs.DataConnection)=>void): void;
        /**
         * Emitted when a remote peer attempts to call you.
         * @param event Event name
         * @param cb Callback Function
         */
        on(event: 'call', cb: (mediaConnection: PeerJs.MediaConnection)=>void): void;
        /**
         * Emitted when the peer is destroyed and can no longer accept or create any new connections.
         * @param event Event name
         * @param cb Callback Function
         */
        on(event: 'close', cb: ()=>void): void;
        /**
         * Emitted when the peer is disconnected from the signalling server
         * @param event Event name
         * @param cb Callback Function
         */
        on(event: 'disconnected', cb: ()=>void): void;
        /**
         * Errors on the peer are almost always fatal and will destroy the peer.
         * @param event Event name
         * @param cb Callback Function
         */
        on(event: 'error', cb: (err: any)=>void): void;
        /**
         * Remove event listeners.(EventEmitter3)
         * @param {String} event The event we want to remove.
         * @param {Function} fn The listener that we need to find.
         * @param {Boolean} once Only remove once listeners.
         */
        off(event: string, fn: Function, once?: boolean): void;
        /**
         * Close the connection to the server, leaving all existing data and media connections intact.
         */
        disconnect(): void;
        /**
         * Attempt to reconnect to the server with the peer's old ID
         */
        reconnect(): void;
        /**
         * Close the connection to the server and terminate all existing connections.
         */
        destroy(): void;

        /**
         * Retrieve a data/media connection for this peer.
         * @param peer
         * @param id
         */
        getConnection(peer: Peer, id: string): any;

        /**
         * Get a list of available peer IDs
         * @param callback
         */
        listAllPeers(callback: (peerIds: Array<string>)=>void): void;
        /**
         * The brokering ID of this peer
         */
        id: string;
        /**
         * A hash of all connections associated with this peer, keyed by the remote peer's ID.
         */
        connections: any;
        /**
         * false if there is an active connection to the PeerServer.
         */
        disconnected: boolean;
        /**
         * true if this peer and all of its connections can no longer be used.
         */
        destroyed: boolean;
    }
}

declare var Peer: {
    prototype: RTCIceServer;
    /**
     * A peer can connect to other peers and listen for connections.
     * @param id Other peers can connect to this peer using the provided ID.
     *     If no ID is given, one will be generated by the brokering server.
     * @param options for specifying details about PeerServer
     */
    new (id: string, options?: PeerJs.PeerJSOption): PeerJs.Peer;

    /**
     * A peer can connect to other peers and listen for connections.
     * @param options for specifying details about PeerServer
     */
    new (options: PeerJs.PeerJSOption): PeerJs.Peer;
};
