import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import Modal from './Modal';
import Button from './Button';
import { ZoomIn, ZoomOut, RotateCw, Square, RectangleHorizontal, RectangleVertical, Maximize } from 'lucide-react';

interface AspectPreset {
    label: string;
    value: number | null; // null = custom/free
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const aspectPresets: AspectPreset[] = [
    { label: 'Bebas', value: null, icon: Maximize },
    { label: '1:1', value: 1, icon: Square },
    { label: '4:3', value: 4 / 3, icon: RectangleHorizontal },
    { label: '16:9', value: 16 / 9, icon: RectangleHorizontal },
    { label: '3:4', value: 3 / 4, icon: RectangleVertical },
    { label: '9:16', value: 9 / 16, icon: RectangleVertical },
];

interface ImageCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    onCropComplete: (croppedImageBlob: Blob) => void;
    aspectRatio?: number;
    cropShape?: 'rect' | 'round';
    title?: string;
    showAspectPresets?: boolean;
}

export default function ImageCropModal({
    isOpen,
    onClose,
    imageSrc,
    onCropComplete,
    aspectRatio,
    cropShape = 'rect',
    title = 'Crop Gambar',
    showAspectPresets = false,
}: ImageCropModalProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Aspect ratio state
    const [selectedPreset, setSelectedPreset] = useState<number | null>(aspectRatio ?? null);
    const [customWidth, setCustomWidth] = useState(16);
    const [customHeight, setCustomHeight] = useState(9);

    // Calculate effective aspect ratio
    const effectiveAspect = selectedPreset === null
        ? customWidth / customHeight
        : selectedPreset;

    // Reset custom values when opening
    useEffect(() => {
        if (isOpen) {
            setSelectedPreset(aspectRatio ?? null);
            setCustomWidth(16);
            setCustomHeight(9);
        }
    }, [isOpen, aspectRatio]);

    const onCropChange = useCallback((newCrop: Point) => {
        setCrop(newCrop);
    }, []);

    const onZoomChange = useCallback((newZoom: number) => {
        setZoom(newZoom);
    }, []);

    const onRotationChange = useCallback((newRotation: number) => {
        setRotation(newRotation);
    }, []);

    const onCropCompleteHandler = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;

        setIsProcessing(true);
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
            onCropComplete(croppedBlob);
            handleClose();
        } catch (error) {
            console.error('Error cropping image:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        // Reset state
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
        setSelectedPreset(aspectRatio ?? null);
        onClose();
    };

    const handlePresetChange = (preset: number | null) => {
        setSelectedPreset(preset);
        // Reset crop position when changing aspect
        setCrop({ x: 0, y: 0 });
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={title} size="lg">
            <div className="space-y-4">
                {/* Aspect Ratio Presets */}
                {showAspectPresets && (
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {aspectPresets.map((preset) => {
                                const Icon = preset.icon;
                                const isActive = selectedPreset === preset.value;
                                return (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => handlePresetChange(preset.value)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive
                                            ? 'bg-cms-accent text-black'
                                            : 'bg-cms-bg-secondary text-cms-text-secondary hover:text-cms-text-primary hover:bg-cms-bg-tertiary'
                                            }`}
                                    >
                                        <Icon size={14} />
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Custom Aspect Ratio Inputs - Show when Free/Bebas is selected */}
                        {selectedPreset === null && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-cms-bg-secondary border border-cms-border rounded-lg">
                                <span className="text-sm font-medium text-cms-text-secondary">Rasio Kustom</span>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={customWidth}
                                            onChange={(e) => {
                                                const val = Math.max(1, Math.min(100, Number(e.target.value)));
                                                setCustomWidth(val);
                                                setCrop({ x: 0, y: 0 });
                                            }}
                                            style={{ backgroundColor: '#1a1a1a' }}
                                            className="w-14 h-9 px-2 border border-cms-border rounded-md text-center text-sm font-medium text-cms-text-primary focus:outline-none focus:ring-2 focus:ring-cms-accent focus:border-transparent"
                                        />
                                        <span className="absolute -bottom-4 left-0 right-0 text-[10px] text-cms-text-muted text-center">lebar</span>
                                    </div>
                                    <span className="text-lg font-bold text-cms-accent">:</span>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={customHeight}
                                            onChange={(e) => {
                                                const val = Math.max(1, Math.min(100, Number(e.target.value)));
                                                setCustomHeight(val);
                                                setCrop({ x: 0, y: 0 });
                                            }}
                                            style={{ backgroundColor: '#1a1a1a' }}
                                            className="w-14 h-9 px-2 border border-cms-border rounded-md text-center text-sm font-medium text-cms-text-primary focus:outline-none focus:ring-2 focus:ring-cms-accent focus:border-transparent"
                                        />
                                        <span className="absolute -bottom-4 left-0 right-0 text-[10px] text-cms-text-muted text-center">tinggi</span>
                                    </div>
                                </div>
                                <div className="ml-2 px-2 py-1 bg-cms-accent/20 rounded text-xs font-medium text-cms-accent">
                                    = {(customWidth / customHeight).toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Cropper Container */}
                <div className="relative h-80 bg-cms-bg-secondary rounded-lg overflow-hidden">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={effectiveAspect}
                        cropShape={cropShape}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onRotationChange={onRotationChange}
                        onCropComplete={onCropCompleteHandler}
                        classes={{
                            containerClassName: 'rounded-lg',
                        }}
                    />
                </div>

                {/* Controls */}
                <div className="space-y-4">
                    {/* Zoom Control */}
                    <div className="flex items-center gap-3">
                        <ZoomOut size={18} className="text-cms-text-muted" />
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 h-2 bg-cms-bg-secondary rounded-lg appearance-none cursor-pointer accent-cms-accent"
                        />
                        <ZoomIn size={18} className="text-cms-text-muted" />
                    </div>

                    {/* Rotation Control */}
                    <div className="flex items-center gap-3">
                        <RotateCw size={18} className="text-cms-text-muted" />
                        <input
                            type="range"
                            min={0}
                            max={360}
                            step={1}
                            value={rotation}
                            onChange={(e) => setRotation(Number(e.target.value))}
                            className="flex-1 h-2 bg-cms-bg-secondary rounded-lg appearance-none cursor-pointer accent-cms-accent"
                        />
                        <span className="text-sm text-cms-text-muted w-12">{rotation}°</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="secondary" onClick={handleClose}>
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        isLoading={isProcessing}
                    >
                        Crop & Upload
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

/**
 * Utility function to create cropped image from the crop area
 * Uses PNG format to preserve transparency
 */
async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    // Set canvas size to safe area
    canvas.width = safeArea;
    canvas.height = safeArea;

    // Translate canvas center to origin
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // Draw the rotated image
    ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    // Set canvas size to the cropped size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Paste the rotated image with the correct offset
    ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    // Return as PNG blob to preserve transparency
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Canvas is empty'));
            }
        }, 'image/png'); // Use PNG to preserve transparency
    });
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.crossOrigin = 'anonymous';
        image.src = url;
    });
}

function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
}
