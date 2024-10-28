import {useState} from "react"

export default function Recording(){
   const [isRecording, setIsRecording] = useState<boolean>(false);
   const [recordingComplete, setRecordingComplete] = useState<boolean>(false);
   const [transcript, setTranscript] = useState<string>("");


   const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
   };

   const stopRecording = () => {
    setIsRecording(!isRecording);
   };

   return (
    <div className="flex">
        <div className="w-full">
            {(isRecording || transcript)&&(
            <div className="">
                <div>
                    <div>
                        <p> {recordingComplete ? "Recorded" : "Recording"}</p>
                        <p>
                        {recordingComplete ? "Thanks for talking" : "Start Speaking"}
                        </p>
                    </div>
                </div>
            </div>
            )}
            {transcript && (
                <div className=""></div>
            )}
            
        </div>
    </div>

   );
}