"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Mic, StopCircle, Play } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import ComprehensionList from "./comprehensionList";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface VoiceExercise {
  id: string;
  voice: string;
  voiceImage: string;
  grade: string;
  isCompleted: boolean;
}

interface ScoreResponse {
  accuracy_score: number;
  pronunciation_score: number;
  fluency_score: number;
  speed_score: number;
  final_score: number;
  grade: string;
  phonemes: string[];
  recognized_text: string;
  voiceRecord: string;
}

interface VoiceExercisesListProps {
  moduleTitle: string;
}

const VoiceExercisesList = ({ moduleTitle }: VoiceExercisesListProps) => {
  const [voiceExercises, setVoiceExercises] = useState<VoiceExercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<VoiceExercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<BlobPart[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scores, setScores] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const showSuccessToast = () => {
    toast.success(
      <div className="flex items-center space-x-2">
        <FaStar className="text-yellow-400 animate-bounce" />
        <span className="text-lg font-bold text-pink-600">Great Job!</span>
      </div>,
      {
        duration: 4000,
        icon: "🎉",
        style: {
          borderRadius: "10px",
          background: "#FFF4E5",
          color: "#444",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.4)",
        },
      }
    );
  };

  useEffect(() => {
    const fetchVoiceExercises = async () => {
      try {
        if (status === "loading" || !session?.user?.studentId) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/voice-exercises?moduleTitle=${encodeURIComponent(
            moduleTitle
          )}&studentId=${session.user.studentId}`
        );

        if (!response.ok) throw new Error("Failed to fetch voice exercises");

        const data = await response.json();
        const exercises = data.exercises || [];
        const incompleteExercises = exercises.filter(
          (exercise: VoiceExercise) => !exercise.isCompleted
        );

        setVoiceExercises(incompleteExercises);
        setCurrentExercise(incompleteExercises[0] || null);

      } catch (error) {
        console.error("Error fetching voice exercises:", error);
      }
    };

    if (status === "authenticated") fetchVoiceExercises();
  }, [moduleTitle, session, status]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.current.push(event.data);
    };

    mediaRecorder.onstop = handleStopRecording;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStopRecording = async () => {
    const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
    if (blob.size === 0) {
      setError("No audio recorded. Please try again.");
      return;
    }

    audioUrlRef.current = URL.createObjectURL(blob);
    recordedChunks.current = [];
    setIsRecording(false);

    const formData = new FormData();
    formData.append("audio_blob", blob, "recorded_audio.webm");
    formData.append("expected_text", currentExercise?.voice || "");
    formData.append("voice_exercises_id", currentExercise?.id || "");
    formData.append("student_id", session?.user?.studentId || "");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/voice-exercises-history`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Error processing audio.");
      const data = await response.json();
      setScores(data);
      setIsDialogOpen(true);

    } catch (error) {
      setError("Error processing audio. Please try again.");
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const handleRecordingToggle = () => {
    isRecording ? mediaRecorderRef.current?.stop() : startRecording();
  };

  const resetExercise = () => {
    setIsRecording(false);
    recordedChunks.current = [];
    audioUrlRef.current = null;
    setScores(null);
    setError(null);
    setCurrentExercise(voiceExercises[0] || null);
  };

  const handleSubmitExercise = async () => {
    setIsSubmitting(true);
    try {
      localStorage.removeItem(`${currentExercise?.id}_${session?.user?.studentId}`);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submit-exercise`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: session?.user?.studentId,
            voice_exercises_id: currentExercise?.id,
            expected_text: currentExercise?.voice,
            recognized_text: scores?.recognized_text,
            accuracy_score: scores?.accuracy_score,
            pronunciation_score: scores?.pronunciation_score,
            fluency_score: scores?.fluency_score,
            speed_score: scores?.speed_score,
            final_score: scores?.final_score,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit exercise.");
      setIsSubmitted(true);
      showSuccessToast();

      setIsDialogOpen(false);
      setCurrentExercise(null);
    } catch (error) {
      console.error("Error submitting exercise:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url("/images/voice_bg1.jpg")' }}>
      {/* Header and Go Back Button */}
      <Button className="absolute top-20 left-4 bg-blue-400 hover:bg-blue-600 text-white" onClick={() => router.back()}>
        <FaArrowLeft className="text-2xl" />
      </Button>
      <h1 className="text-4xl font-bold text-red-700 mt-10">Voice Exercises</h1>

      {currentExercise && (
        <div className="mt-8">
          <label htmlFor="expectedText" className="block text-lg font-semibold">Say This:</label>
          {currentExercise.voiceImage && (
            <Image src={currentExercise.voiceImage} alt="Voice Exercise" width={200} height={150} className="mt-4" />
          )}
          <div id="expectedText" className="p-4 bg-white text-xl font-bold">{currentExercise.voice}</div>

          {/* Record, Reset, and Play Buttons */}
          <div className="mt-4 flex flex-col items-center space-y-4">
            <button onClick={handleRecordingToggle} className={`flex items-center w-48 h-12 bg-blue-400 hover:bg-blue-600 ${isRecording ? 'bg-red-500' : ''}`}>
              {isRecording ? <StopCircle className="text-3xl text-white" /> : <Mic className="text-3xl text-white" />}
              <span className="ml-2 text-white">{isRecording ? "Stop" : "Start Recording"}</span>
            </button>
            {audioUrlRef.current && (
              <button onClick={handlePlay} className="flex items-center w-48 h-12 bg-green-400 hover:bg-green-600">
                <Play className="text-3xl text-white" />
                <span className="ml-2 text-white">Play Recording</span>
              </button>
            )}
            <button onClick={resetExercise} className="w-48 h-12 bg-yellow-400 hover:bg-yellow-600">Reset</button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Results</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="space-y-2">
              <p>Accuracy: {scores?.accuracy_score}</p>
              <p>Pronunciation: {scores?.pronunciation_score}</p>
              <p>Fluency: {scores?.fluency_score}</p>
              <p>Speed: {scores?.speed_score}</p>
              <p>Final Score: {scores?.final_score}</p>
              <p>Recognized Text: {scores?.recognized_text}</p>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button onClick={handleSubmitExercise} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoiceExercisesList;
