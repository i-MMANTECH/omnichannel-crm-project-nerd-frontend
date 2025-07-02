'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import JsSIP from 'jssip';
import { toast } from 'react-toastify';
import { useApi } from "@/services/axiosConfig";
import { useError } from "@/context/ErrorContext";
import { normalizePhoneNumber } from '@/utils/normalizePhone';
import { useAuth } from './AuthContext';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
    const { axiosInstance } = useApi();
    const [session, setSession] = useState(null);
    const [registered, setRegistered] = useState(false);
    const [callStatus, setCallStatus] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [callData, setCallData] = useState({ phone: '', name: '', id: null, uniqueId: null });
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [incoming, setIncoming] = useState(false);
    const [muted, setMuted] = useState(false);

    const { isAuthenticated } = useAuth();
    
    const currentSessionRef = useRef(null);


    const localStreamRef = useRef(null);


    const uaRef = useRef(null);
    const ringtoneInterval = useRef(null);
    const incomingRingtoneInterval = useRef(null);

    const SIP_URI = 'sip:101@cc2.nativetalk.com.ng';
    const SIP_PASSWORD = 'Test@123';
    const WSS_URL = 'wss://cc2.nativetalk.com.ng:7443';

    
    // ───── SIP INIT ─────
    useEffect(() => {
        const initializeSIP = () => {
            const socket = new JsSIP.WebSocketInterface(WSS_URL);
            const configuration = {
                sockets: [socket],
                uri: SIP_URI,
                password: SIP_PASSWORD,
                session_timers: true,
                session_timers_refresh_method: 'UPDATE',
                register: true,
            };

            const ua = new JsSIP.UA(configuration);
            uaRef.current = ua;

            ua.on('registered', () => {
                setRegistered(true);
                setCallStatus('REGISTERED');
            });

            ua.on('registrationFailed', (e) => {
                setCallStatus(`FAILED`);
            });

            ua.on('newRTCSession', (data) => {
              if (currentSessionRef.current) {
               data.session.terminate({
               status_code: 486,
               reason_phrase: 'Busy Here'
              });
              return;
          }
                const rtcSession = data.session;
                currentSessionRef.current = rtcSession;
                setSession(rtcSession);

                if (data.originator === 'remote') {
                    const rawPhone = rtcSession.remote_identity.uri.user;
                     (async () => {
            try {
              const { data: resp } = await axiosInstance.get('/customers/', {
                params: { search: rawPhone }
              });

              if (resp.count > 0) {
                const cust = resp.results[0];
                const fullName = `${cust.first_name} ${cust.last_name}`.trim();
                setCallData({ phone: rawPhone, name: fullName, id: cust.id });
              } else {
                  setCallData({
                        name: rtcSession.remote_identity.display_name || rtcSession.remote_identity.uri.user,
                        phone: rtcSession.remote_identity.uri.user,
                    });
              }
            } catch (err) {
              console.error('Incoming lookup failed', err);
               setCallData({
                        name: rtcSession.remote_identity.display_name || rtcSession.remote_identity.uri.user,
                        phone: rtcSession.remote_identity.uri.user,
                    });
            }
          })();

                    setIsVisible(false);
                    setIsVisible(true);
                    setIncoming(true);
                    setCallStatus('INCOMING');
                    playIncomingRingtone();
                }

                rtcSession.on('confirmed', () => {
                    setCallStatus('CONNECTED');
                    stopAllRingtones();
                    setIncoming(false);

                    const pc = rtcSession.connection;
                    if (pc) {
                        const remoteStream = new MediaStream();
                
                        pc.getReceivers().forEach(receiver => {
                            if (receiver.track && receiver.track.kind === 'audio') {
                                remoteStream.addTrack(receiver.track);
                            }
                        });
                
                        const audioElement = document.getElementById('audio_remote');

                        if (audioElement) {
                            audioElement.srcObject = remoteStream;
                            audioElement.play().catch(err => {
                                console.warn('🔇 Auto-play failed:', err);
                            });
                        }
                    }
                });

                rtcSession.on('ended', () => {
                    setCallStatus('ENDED');
                    stopAllRingtones();
                    playEndRingtone();
                    currentSessionRef.current = null;
                    setSession(null);
                    setIncoming(false);
                });

                rtcSession.on('failed', () => {
                    setCallStatus('FAILED');
                    stopAllRingtones();
                    playEndRingtone();
                    currentSessionRef.current = null;
                    setSession(null);
                    setIncoming(false);
                });
            });

            ua.start();
        }

        initializeSIP()
    }, []);

     useEffect(() => {
    if (!isAuthenticated && uaRef.current) {
      // stop listening / unregister
      uaRef.current.unregister({ all: true });
      uaRef.current.stop();
      // clear any remaining UI state
      currentSessionRef.current = null;
      setSession(null);
      setIsVisible(false);
      setIncoming(false);
      stopAllRingtones();
    }
  }, [isAuthenticated]);

    // ───── AUDIO ─────
    const toggleMute = () => {
        if (localStreamRef.current) {
          localStreamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
          });
          setMuted(prev => !prev);
        }
    };

    const stopAllRingtones = () => {
        ['ringtone', 'incoming_ringtone'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.pause();
            el.currentTime = 0;
        }
        });
        clearInterval(ringtoneInterval.current);
        clearInterval(incomingRingtoneInterval.current);
    };

    const playRingtoneWithDelay = () => {
        const audio = document.getElementById('ringtone');
        if (!audio) return;

        audio.play().catch(console.warn);
        ringtoneInterval.current = setInterval(() => {
            audio.currentTime = 0;
            audio.play().catch(console.warn);
        }, audio.duration * 1000 + 1500);
    };

    const playIncomingRingtone = () => {
        const audio = document.getElementById('incoming_ringtone');
        if (!audio) return;

        audio.play().catch(console.warn);
        incomingRingtoneInterval.current = setInterval(() => {
            audio.currentTime = 0;
            audio.play().catch(console.warn);
        }, audio.duration * 1000 + 1500);
    };

    const playEndRingtone = () => {
        const audio = document.getElementById('end_ringtone');
        if (!audio) return;

        audio.currentTime = 0;
        audio.play().catch(console.warn);
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, 1300);
    };


    // ───── ACTIONS ─────
    const makeCall = async ({ phone, name, id }) => {
        if (!registered || !uaRef.current) {
            setCallStatus('Not registered or UA not available');
            return;
        }

        try {
            const normalized = normalizePhoneNumber(phone);
            console.log("Making call to: ",normalized)
            setCallData({ phone: normalized, name, id });
            setIsVisible(true);

            setCallStatus('Requesting microphone access...');
            
            // Get user media first
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
                } 
            });
            localStreamRef.current = mediaStream;

            const eventHandlers = {
                progress: () => {
                    console.log('Call is in progress');
                    setCallStatus('RINGING');

                    playRingtoneWithDelay();
                },
                failed: (e) => {
                    console.error('❌ Call failed:', e.cause, e.response?.status_code, e.response?.reason_phrase);
                    console.log(e)
                    setCallStatus('FAILED');
                    stopAllRingtones();
                    playEndRingtone();
                    setSession(null);
                },
                ended: () => {
                    console.log('Call ended');

                    setCallStatus('ENDED');
                    stopAllRingtones();
                    playEndRingtone();
                    setSession(null);
                },
                confirmed: () => {
                    console.log('Call confirmed');

                    setCallStatus('CONNECTED');
                    stopAllRingtones();
                }
            };

            const options = {
                mediaStream: mediaStream,
                eventHandlers,
                mediaConstraints: { audio: true, video: false },
                sessionTimersExpires: 120,
                'pcConfig': {
                    'iceServers': [
                        {
                            'urls': ['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302']
                        }
                    ]
                }
            };

            const dest = normalized;
            if (!dest) {
                return;
            }

            setCallStatus('INITIATING');
                const call = uaRef.current.call(`sip:${dest}@cc2.nativetalk.com.ng`, options);
                setSession(call);
        } catch (error) {
            console.error('Error making call:', error);
            setCallStatus(`FAILED`);
        }
    };

    const acceptCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
                }
            });
            localStreamRef.current = stream;

            session.answer({
                mediaStream: stream,
                mediaConstraints: { audio: true },
                pcConfig: {
                    iceServers: [
                        { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }
                    ]
                }
            });

            stopAllRingtones();
            setCallStatus("CONNECTED");
            setIncoming(false);
        } catch (err) {
            console.error("🎙️ Microphone access error on answer:", err);
            setCallStatus("FAILED");
        }
    };

    const endCall = () => {
        if (session) session.terminate();
        setSession(null);
        setCallStatus('ENDED');

        stopAllRingtones()
    };

    const toggleMinimize = () => setIsCollapsed(p => !p);

    const closeCall = () => {
        setIsVisible(false);
        setCallData({ name: '', id: null });
    };

    return (
        <CallContext.Provider value={{
            registered,
            isVisible,
            callStatus,
            callData,
            isCollapsed,
            incoming,
            makeCall,
            acceptCall,
            endCall,
            closeCall,
            toggleMinimize,
            muted,
            toggleMute
        }}>
            {children}
            <audio id="ringtone" src="/assets/ringtone.mp3" preload="auto" />
            <audio id="end_ringtone" src="/assets/end-ringtone.mp3" preload="auto" />
            <audio id="incoming_ringtone" src="/assets/incoming-ringtone.mp3" preload="auto" />
            <audio id="audio_remote" autoPlay />
        </CallContext.Provider>
    );
};

export const useCall = () => useContext(CallContext);
