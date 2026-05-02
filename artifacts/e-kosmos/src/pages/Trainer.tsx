import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import { Camera, X, RefreshCw, Save, Trash2, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { saveClassifierDataset, loadClassifierDataset, clearClassifierDataset } from "@/lib/ai-store";
import { motion } from "framer-motion";
import { WasteCategory } from "@/lib/waste-mapping";

const CATEGORIES: { id: WasteCategory; label: string; color: string }[] = [
  { id: "Plastica", label: "Plastica", color: "bg-yellow-500 hover:bg-yellow-600" },
  { id: "Carta", label: "Carta", color: "bg-blue-500 hover:bg-blue-600" },
  { id: "Vetro", label: "Vetro", color: "bg-green-500 hover:bg-green-600" },
  { id: "Organico", label: "Organico", color: "bg-amber-700 hover:bg-amber-800" },
  { id: "Indifferenziato", label: "Indiff.", color: "bg-gray-500 hover:bg-gray-600" },
  { id: "RAEE", label: "RAEE", color: "bg-purple-500 hover:bg-purple-600" },
];

export default function Trainer() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // TF Models
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [classifier, setClassifier] = useState<knnClassifier.KNNClassifier | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  
  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // Training State
  const [examplesCount, setExamplesCount] = useState<Record<string, number>>({
    Plastica: 0, Carta: 0, Vetro: 0, Organico: 0, Indifferenziato: 0, RAEE: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load Models
  useEffect(() => {
    async function init() {
      try {
        await tf.ready();
        const baseModel = await mobilenet.load({ version: 2, alpha: 1.0 });
        const knn = knnClassifier.create();
        
        // Try to load existing dataset
        loadClassifierDataset(knn);
        updateExamplesCount(knn);

        setModel(baseModel);
        setClassifier(knn);
        setIsModelLoading(false);
      } catch (error) {
        console.error("Failed to load models:", error);
        toast({
          title: "Errore AI",
          description: "Non è stato possibile avviare il motore di addestramento.",
          variant: "destructive",
        });
      }
    }
    init();
  }, [toast]);

  const updateExamplesCount = (knn: knnClassifier.KNNClassifier) => {
    const classDataset = knn.getClassExampleCount();
    const newCounts: Record<string, number> = {
      Plastica: 0, Carta: 0, Vetro: 0, Organico: 0, Indifferenziato: 0, RAEE: 0
    };
    for (const [key, value] of Object.entries(classDataset)) {
      if (newCounts[key] !== undefined) {
        newCounts[key] = value;
      }
    }
    setExamplesCount(newCounts);
  };

  // Setup Camera
  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "Errore Fotocamera",
          description: "Il browser non supporta l'accesso alla fotocamera (richiesto HTTPS).",
          variant: "destructive",
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      toast({
        title: "Fotocamera non disponibile",
        description: "Assicurati di aver concesso i permessi.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const addExample = async (classId: string) => {
    if (!videoRef.current || !classifier || !model || !isCameraActive) return;

    try {
      // Get image features from mobilenet
      // mobilenet.infer gets the intermediate activation of the model
      const activation = model.infer(videoRef.current, true);
      
      // Add to KNN
      classifier.addExample(activation, classId);
      
      // Update count
      updateExamplesCount(classifier);
      
      // Cleanup tensor
      activation.dispose();
    } catch (err) {
      console.error("Error adding example:", err);
    }
  };

  const handleSave = async () => {
    if (!classifier) return;
    setIsSaving(true);
    const success = await saveClassifierDataset(classifier);
    setIsSaving(false);
    
    if (success) {
      toast({
        title: "Modello Salvato!",
        description: "L'AI ora ricorderà gli oggetti che le hai insegnato.",
      });
    } else {
      toast({
        title: "Errore di salvataggio",
        description: "Non è stato possibile salvare il modello.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    if (!classifier) return;
    if (confirm("Vuoi cancellare tutto l'addestramento? L'AI tornerà alle impostazioni di base.")) {
      clearClassifierDataset(classifier);
      updateExamplesCount(classifier);
      toast({
        title: "Modello Resettato",
        description: "L'addestramento personalizzato è stato cancellato."
      });
    }
  };

  const totalExamples = Object.values(examplesCount).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-8 pb-20 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        <div className="flex w-full justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-white/10 rounded-full bg-white/5 backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-black text-white tracking-tight">Trainer AI</h1>
          </div>
          <div className="w-10"></div>
        </div>

        <p className="text-white/70 text-sm text-center mb-4 px-2">
          Inquadra un oggetto e tieni premuto il pulsante del suo bidone per insegnare all'AI a riconoscerlo. (Es. inquadra una bottiglia da più angolazioni e tieni premuto Plastica).
        </p>

        <Card className="w-full relative overflow-hidden bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl aspect-square flex items-center justify-center mb-6">
          {isModelLoading ? (
            <div className="flex flex-col items-center space-y-4 text-white/70">
              <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
              <p className="font-medium animate-pulse">Caricamento Motore AI...</p>
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/80">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
              />
              
              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-black/80 backdrop-blur-sm">
                  <Camera className="w-16 h-16 text-white/50 mb-4" />
                  <Button onClick={startCamera} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-8 rounded-full shadow-lg text-lg">
                    Avvia Fotocamera
                  </Button>
                </div>
              )}
              {isCameraActive && (
                 <div className="absolute inset-0 pointer-events-none border-[2px] border-white/10 m-4 rounded-2xl z-10" />
              )}
            </div>
          )}
        </Card>

        {/* Training Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mb-8">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center">
              <Button
                disabled={!isCameraActive || isModelLoading}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  const interval = setInterval(() => addExample(cat.id), 100);
                  e.currentTarget.onpointerup = () => clearInterval(interval);
                  e.currentTarget.onpointerleave = () => clearInterval(interval);
                }}
                className={`w-full h-14 ${cat.color} text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 touch-none`}
              >
                {cat.label}
              </Button>
              <span className="text-xs font-mono text-white/50 mt-1">{examplesCount[cat.id]} foto</span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="w-full flex gap-3">
          <Button 
            variant="destructive" 
            onClick={handleReset}
            disabled={totalExamples === 0}
            className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/30"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Resetta
          </Button>
          <Button 
            onClick={handleSave}
            disabled={totalExamples === 0 || isSaving}
            className="flex-[2] bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-600/20"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salva Modello
          </Button>
        </div>

      </div>
    </div>
  );
}
