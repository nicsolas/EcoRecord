import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import { Camera, X, RefreshCw, Zap, Trash2, ShieldAlert, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getWasteCategory, WasteCategory } from "@/lib/waste-mapping";
import { loadClassifierDataset, hasCustomDataset } from "@/lib/ai-store";
import { motion, AnimatePresence } from "framer-motion";

export default function Scan() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [classifier, setClassifier] = useState<knnClassifier.KNNClassifier | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCustomModelActive, setIsCustomModelActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ category: WasteCategory; match: string; confidence: number, note?: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load Model
  useEffect(() => {
    async function loadModel() {
      try {
        await tf.ready();
        const loadedModel = await mobilenet.load({ version: 2, alpha: 1.0 });
        setModel(loadedModel);

        if (hasCustomDataset()) {
          const knn = knnClassifier.create();
          const loaded = loadClassifierDataset(knn);
          if (loaded) {
            setClassifier(knn);
            setIsCustomModelActive(true);
          }
        }

        setIsModelLoading(false);
      } catch (error) {
        console.error("Failed to load model:", error);
        toast({
          title: "Errore AI",
          description: "Non è stato possibile caricare il modello di intelligenza artificiale.",
          variant: "destructive",
        });
      }
    }
    loadModel();
  }, [toast]);

  // Setup Camera
  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "Errore Fotocamera",
          description: "Il tuo browser non supporta l'accesso alla fotocamera. Assicurati di usare HTTPS o localhost.",
          variant: "destructive",
        });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
        toast({
          title: "Permesso negato",
          description: "Devi concedere il permesso per usare la fotocamera.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fotocamera non disponibile",
          description: "Impossibile avviare la fotocamera.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // Rimuoviamo l'avvio automatico per permettere all'utente di cliccare
  // useEffect(() => {
  //   if (!isModelLoading) {
  //     startCamera();
  //   }
  //   // cleanup stream omitted per l'avvio manuale
  // }, [isModelLoading, startCamera]);

  useEffect(() => {
    return () => {
      // Cleanup stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !model) return;
    
    setIsAnalyzing(true);
    
    try {
      // 1. Capture image to canvas
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");
      
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);
      
      // Stop camera temporarily
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setIsCameraActive(false);
      }

      // 2. Analyze
      const imgElement = document.createElement('img');
      imgElement.src = imageDataUrl;
      await new Promise(resolve => imgElement.onload = resolve);
      
      let finalResult = null;

      // Try custom model first if available
      if (classifier) {
        try {
          const activation = model.infer(imgElement, true);
          const result = await classifier.predictClass(activation);
          activation.dispose();

          // Check if custom prediction has high enough confidence
          if (result.label && result.confidences[result.label] >= 0.5) {
            finalResult = {
              category: result.label as WasteCategory,
              match: "Riconosciuto da AI Personalizzata",
              confidence: result.confidences[result.label],
              note: "Questa è una previsione del tuo modello addestrato personalizzato!"
            };
          }
        } catch (e) {
          console.error("Custom AI prediction error:", e);
        }
      }

      // Fallback to MobileNet if custom model fails or is not confident
      if (!finalResult) {
        const predictions = await model.classify(imgElement);
        console.log("MobileNet Predictions:", predictions);
        
        const categoryResult = getWasteCategory(predictions);
        if (categoryResult) {
          finalResult = categoryResult;
        } else {
          finalResult = {
            category: "Indifferenziato" as WasteCategory,
            match: predictions[0]?.className || "oggetto sconosciuto",
            confidence: predictions[0]?.probability || 0
          };
        }
      }

      setAnalysisResult(finalResult);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Errore di analisi",
        description: "Qualcosa è andato storto durante l'analisi dell'immagine.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    startCamera();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Plastica": return "from-yellow-400 to-yellow-600";
      case "Carta": return "from-blue-400 to-blue-600";
      case "Vetro": return "from-green-400 to-green-600";
      case "Organico": return "from-amber-700 to-amber-900";
      case "RAEE": return "from-purple-500 to-purple-700";
      default: return "from-gray-500 to-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-8 pb-20 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Floating decorative icons */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 left-8 text-primary/20 pointer-events-none"
      >
        <Zap className="w-12 h-12" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 right-8 text-blue-400/20 pointer-events-none"
      >
        <Camera className="w-16 h-16" />
      </motion.div>

      <div className="w-full max-w-md z-10 flex flex-col items-center h-full flex-1">
        <div className="flex w-full justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-white/10 rounded-full bg-white/5 backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-black text-white tracking-tight">Eco-Scanner</h1>
          <div className="flex items-center gap-2">
            {isCustomModelActive && (
              <div className="flex items-center text-xs font-bold px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                <BrainCircuit className="w-3 h-3 mr-1" />
                Custom AI
              </div>
            )}
          </div>
        </div>

        <Card className="w-full relative overflow-hidden bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl aspect-[3/4] flex items-center justify-center">
          
          {isModelLoading ? (
            <div className="flex flex-col items-center space-y-4 text-white/70">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              <p className="font-medium animate-pulse">Caricamento AI in corso...</p>
            </div>
          ) : (
            <>
              {/* Camera Feed or Captured Image */}
              <AnimatePresence mode="wait">
                {!capturedImage ? (
                  <motion.div 
                    key="camera"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/80"
                  >
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
                    />
                    {isCameraActive && (
                      <div className="absolute inset-0 pointer-events-none border-[2px] border-white/20 m-12 rounded-3xl z-10" />
                    )}

                    {!isCameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-black/80 backdrop-blur-sm">
                        <Camera className="w-16 h-16 text-white/50 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Fotocamera disattivata</h3>
                        <p className="text-white/60 mb-6 text-sm">Devi consentire l'accesso alla fotocamera per analizzare i rifiuti.</p>
                        <Button onClick={startCamera} className="bg-primary hover:bg-primary/80 text-white font-bold py-6 px-8 rounded-full shadow-lg shadow-primary/30 text-lg">
                          Consenti Accesso
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.img 
                    key="image"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={capturedImage} 
                    alt="Captured waste" 
                  />
                )}
              </AnimatePresence>

              {/* Scanning Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
                  <Zap className="w-12 h-12 text-yellow-400 animate-bounce mb-4" />
                  <p className="font-semibold text-lg tracking-wide">Analisi in corso...</p>
                  
                  {/* Scanning line animation */}
                  <motion.div 
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute left-0 w-full h-1 bg-primary shadow-[0_0_15px_rgba(34,197,94,0.8)]"
                  />
                </div>
              )}
            </>
          )}
        </Card>

          {/* Tips for better accuracy */}
          {!capturedImage && !isModelLoading && isCameraActive && (
            <div className="absolute top-24 left-4 right-4 z-20 text-center pointer-events-none">
              <div className="inline-block bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs text-white/90 shadow-lg">
                💡 <b>Consiglio:</b> Inquadra un solo oggetto alla volta in un ambiente ben illuminato.
              </div>
            </div>
          )}

        {/* Action Controls */}
        <div className="mt-8 w-full">
          {!capturedImage && !isModelLoading && (
            <div className="flex justify-center">
              <Button 
                onClick={captureAndAnalyze}
                disabled={isAnalyzing || !isCameraActive}
                className="w-20 h-20 rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-transform flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                <div className="w-16 h-16 rounded-full border-4 border-black/10 flex items-center justify-center">
                  <Camera className="w-8 h-8" />
                </div>
              </Button>
            </div>
          )}

          {/* Result Display */}
          <AnimatePresence>
            {analysisResult && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 w-full"
              >
                <div className={`p-[2px] rounded-2xl bg-gradient-to-r ${getCategoryColor(analysisResult.category)} shadow-xl`}>
                  <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 text-white text-center flex flex-col items-center">
                    <p className="text-sm text-white/60 mb-1 uppercase tracking-wider font-semibold">Risultato AI</p>
                    <h2 className="text-4xl font-black mb-2 tracking-tighter">{analysisResult.category}</h2>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-white/80 font-medium mb-4">
                      <Trash2 className="w-3 h-3" />
                      {analysisResult.match} • {Math.round(analysisResult.confidence * 100)}% confidenza
                    </div>

                    {analysisResult.note && (
                      <div className="bg-yellow-500/20 text-yellow-200 border border-yellow-500/30 px-4 py-3 rounded-xl text-sm mb-6 w-full text-left flex gap-3 items-start">
                        <ShieldAlert className="w-5 h-5 shrink-0 text-yellow-400" />
                        <span>{analysisResult.note}</span>
                      </div>
                    )}

                    <div className="flex gap-4 w-full mt-2">
                      <Button 
                        variant="outline" 
                        onClick={retake}
                        className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Riprova
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-6 flex items-center justify-center text-xs text-white/40 gap-2 px-4 text-center">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>L'AI potrebbe commettere errori. Controlla sempre le regole del tuo comune.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
