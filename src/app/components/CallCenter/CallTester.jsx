'use client';

import React, { useEffect, useRef, useState } from 'react';
import JsSIP from 'jssip';

const CallTester = () => {
    const [session, setSession] = useState(null);
    const [registered, setRegistered] = useState(false);
    const phoneRef = useRef(null);
    const uaRef = useRef(null);
    const [callStatus, setCallStatus] = useState('');

    const SIP_URI = 'sip:101@cc2.nativetalk.com.ng';
    const SIP_PASSWORD = 'Test@123'; 
    const WSS_URL = 'wss://cc2.nativetalk.com.ng:7443';

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
            console.log('✅ Registered with SIP server');
            setRegistered(true);
            setCallStatus('Registered successfully');
            });

            ua.on('registrationFailed', (e) => {
            console.error('❌ Registration failed:', e.cause);
            setCallStatus(`Registration failed: ${e.cause}`);
            });

            ua.on('newRTCSession', (data) => {
                const rtcSession = data.session;
                setSession(rtcSession);
            
                if (data.originator === 'remote') {
                    console.log('📥 Incoming call from:', rtcSession.remote_identity.uri.toString());
                    setCallStatus('Incoming call...');

                    playIncomingRingtone();
                }

                rtcSession.on('confirmed', () => {
                console.log('✅ Call confirmed');
                setCallStatus('Call connected');
                stopIncomingRingtone()
            
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
            });          

            ua.start();
        }

        initializeSIP();
    }, []);

    let ringtoneInterval;
    let incomingRingtoneInterval;

    const playEndRingtone = () => {
        const endAudio = document.getElementById('end_ringtone');
        if (endAudio) {
            endAudio.currentTime = 0;
            endAudio.play().catch(console.warn);
        
            // Stop it after 2 seconds to avoid long playback
            setTimeout(() => {
                endAudio.pause();
                endAudio.currentTime = 0;
            }, 1300);
        }
    };

    const playIncomingRingtone = () => {
        const audio = document.getElementById('incoming_ringtone');
        if (!audio) return;

        audio.play().catch(console.warn);

        incomingRingtoneInterval = setInterval(() => {
            audio.currentTime = 0;
            audio.play().catch(console.warn);
        }, audio.duration * 1000 + 1500);
    };

    const playRingtoneWithDelay = () => {
        const audio = document.getElementById('ringtone');
        if (!audio) return;

        audio.play().catch(console.warn);

        ringtoneInterval = setInterval(() => {
            audio.currentTime = 0;
            audio.play().catch(console.warn);
        }, audio.duration * 1000 + 2000); // add 1.5s pause
    };

    const stopRingtone = () => {
        const audio = document.getElementById('ringtone');
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        if (ringtoneInterval) {
            clearInterval(ringtoneInterval);
            ringtoneInterval = null;
        }
    };

    const stopIncomingRingtone = () => {
        const audio = document.getElementById('incoming_ringtone');
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        if (incomingRingtoneInterval) {
            clearInterval(incomingRingtoneInterval);
            incomingRingtoneInterval = null;
        }
    };


    const makeCall = async () => {
        if (!registered || !uaRef.current) {
            setCallStatus('Not registered or UA not available');
            return;
        }

        try {
        setCallStatus('Requesting microphone access...');
        
        // Get user media first
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
            } 
        });

        const eventHandlers = {
            progress: () => {
            console.log('Call is in progress');
            setCallStatus('Call in progress...');

            playRingtoneWithDelay();
            },
            failed: (e) => {
                console.error('❌ Call failed:', e.cause, e.response?.status_code, e.response?.reason_phrase);
                console.log('Full error object:', e);
                setCallStatus(`Call failed: ${e.cause} ${e.response?.reason_phrase || ''}`);
                setSession(null);

                stopRingtone();
                stopIncomingRingtone();
                playEndRingtone();
            },
            ended: () => {
                console.log('Call ended');
                setCallStatus('Call ended');
                setSession(null);

                stopRingtone();
                stopIncomingRingtone();
                playEndRingtone();
            },
            confirmed: () => {
                console.log('Call confirmed');
                setCallStatus('Call connected');

                stopIncomingRingtone();
                stopRingtone();
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

        const dest = phoneRef.current?.value;
        if (!dest) {
            setCallStatus('Please enter a destination');
            return;
        }

        setCallStatus('Initiating call...');
            const call = uaRef.current.call(`sip:${dest}@cc2.nativetalk.com.ng`, options);
            setSession(call);

        } catch (error) {
            console.error('Error making call:', error);
            setCallStatus(`Error: ${error.message}`);
        }
    };

    const hangUp = () => {
        if (session) {
        session.terminate();
        setSession(null);
        setCallStatus('Call terminated');
        }

        stopRingtone();
        playEndRingtone();
    };

    return (
        <div className="p-4 border rounded bg-white shadow max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-2">📞 JsSIP Call Tester</h2>

            <input
                ref={phoneRef}
                type="text"
                placeholder="Enter SIP extension (e.g., agent103)"
                className="border px-2 py-1 w-full mb-2"
            />

            <button
                onClick={makeCall}
                className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                disabled={!registered}
            >
                Call
            </button>

            <button
                onClick={hangUp}
                className="bg-red-500 text-white px-4 py-1 rounded"
                disabled={!session}
            >
                Hang Up
            </button>

            {/* <audio id="ringtone" src="/assets/ringtone.mp3" preload="auto" />
            <audio id="end_ringtone" src="/assets/end-ringtone.mp3" preload="auto" />
            <audio id="incoming_ringtone" src="/assets/incoming-ringtone.mp3" preload="auto" />
            <audio id="audio_remote" autoPlay /> */}

            {callStatus === 'Incoming call...' && (
                <div className="mt-4">
                    <button
                        onClick={async () => {
                            try {
                            const stream = await navigator.mediaDevices.getUserMedia({ 
                                audio: {
                                echoCancellation: true,
                                noiseSuppression: true,
                                autoGainControl: true
                                }
                            });

                            session.answer({
                                mediaStream: stream,
                                mediaConstraints: { audio: true }
                            });

                            stopIncomingRingtone();
                            setCallStatus("Call connected");

                            } catch (err) {
                            console.error("🎙️ Microphone access error on answer:", err);
                            setCallStatus("Failed to access mic");
                            }
                        }}
                        className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                        >
                        Accept
                        </button>
                    <button onClick={() => session.terminate()} className="bg-red-500 text-white px-4 py-1 rounded">Reject</button>
                </div>
            )}


            {!registered && <p className="mt-2 text-sm text-gray-600">Registering...</p>}
        </div>
    );
};

export default CallTester;
