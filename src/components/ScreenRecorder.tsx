import React, { useState, useRef, useEffect } from 'react';
import { Video, Square, Download, AlertCircle } from 'lucide-react';

export const ScreenRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setError(null);
    setRecordedChunks([]);
    setVideoUrl(null);
    setRecordingTime(0);

    try {
      // Prompt user to select screen/tab to share (including system audio if checked)
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        } as any
      });

      streamRef.current = stream;

      // Handle stream stop by browser control bar
      stream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };

      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      let mediaRecorder: MediaRecorder;
      
      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e) {
        // Fallback for browsers that don't support VP9/Opus
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        // Stop all tracks to release camera/mic/screen share indicators
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start(1000); // Capture chunks in 1-second slices
      setIsRecording(true);

      // Start duration timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error('Error starting screen recording:', err);
      setError(err.message || 'Permission denied or browser not supported.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (recordedChunks.length > 0 && !isRecording) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    }
  }, [recordedChunks, isRecording]);

  const downloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `islo_ai_demo_walkthrough_${new Date().toISOString().slice(0,10)}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className={`h-2.5 w-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-600'}`} />
          <span className="text-xs font-bold font-sans uppercase tracking-wider">Demo Screen Recorder</span>
        </div>
        {isRecording && (
          <span className="text-xs font-mono font-bold text-red-400">
            {formatTime(recordingTime)}
          </span>
        )}
      </div>

      <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
        Record your browser window and voiceover directly inside this tab, then save the video file locally to upload for your submission.
      </p>

      {error && (
        <div className="flex items-center space-x-1.5 bg-red-950/40 border border-red-900/30 p-2 rounded text-[9px] text-red-400 mb-3">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center space-x-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
          >
            <Video className="h-3.5 w-3.5" />
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-700 transition-all animate-pulse"
          >
            <Square className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            <span>Stop Recording</span>
          </button>
        )}

        {videoUrl && !isRecording && (
          <button
            onClick={downloadVideo}
            className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Save Video Locally</span>
          </button>
        )}
      </div>
    </div>
  );
};
