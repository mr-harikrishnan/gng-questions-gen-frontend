import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

function DragAndDrop({ 
    formik, 
    fieldName = "image", 
    index = null, 
    size = "large", // "small", "medium", "large"
    placeholder = "Drag & Drop or Click to Upload"
}) {
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Size configurations
    const sizeConfig = {
        small: {
            container: "h-12",
            preview: "w-16 h-16",
            text: "text-[0.6rem] md:text-sm",
            previewContainer: "w-70 sm:w-full"
        },
        medium: {
            container: "h-20 py-4",
            preview: "w-20 h-20",
            text: "text-xs md:text-sm",
            previewContainer: "w-80 sm:w-full"
        },
        large: {
            container: "py-6",
            preview: "w-24 h-24",
            text: "text-sm",
            previewContainer: "w-72"
        }
    };

    const config = sizeConfig[size] || sizeConfig.medium;

    // Get current field value from formik
    const getCurrentFieldValue = () => {
        if (index !== null) {
            return formik.values[fieldName]?.[index]?.option || '';
        }
        return formik.values[fieldName] || '';
    };

    // Set initial preview when component mounts or field value changes
    useEffect(() => {
        const currentValue = getCurrentFieldValue();
        if (currentValue && currentValue.startsWith('http')) {
            setPreview(currentValue);
        } else {
            setPreview(null);
        }
    }, [formik.values, fieldName, index]);

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'questionsImage');
        
        try {
            console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
            
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/dqrwx8lem/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();
            console.log('Cloudinary response:', data);
            
            if (!response.ok) {
                console.error('Cloudinary error details:', data);
                throw new Error(data.error?.message || `Upload failed: ${response.status} ${response.statusText}`);
            }

            console.log('Upload successful:', data.secure_url);
            return data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploading(true);
        
        try {
            // Show preview immediately with blob URL
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            
            // Upload to Cloudinary
            const cloudinaryUrl = await uploadToCloudinary(file);
            
            // Update formik with Cloudinary URL
            const field = index !== null ? `${fieldName}[${index}].option` : fieldName;
            formik.setFieldValue(field, cloudinaryUrl);
            
            // Update preview with Cloudinary URL
            setPreview(cloudinaryUrl);
            
            // Clean up blob URL
            URL.revokeObjectURL(previewUrl);
        } catch (error) {
            alert('Failed to upload image. Please try again.');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    }, [formik, fieldName, index]);

    const handleRemove = () => {
        const field = index !== null ? `${fieldName}[${index}].option` : fieldName;
        formik.setFieldValue(field, index !== null ? "" : null);
        
        if (preview && preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
        }
        setPreview(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    // Get field error for validation
    const fieldError = index !== null 
        ? formik.touched[fieldName]?.[index]?.option && formik.errors[fieldName]?.[index]?.option
        : formik.touched[fieldName] && formik.errors[fieldName];

    return (
        <div className="w-full">
            {/* Show drag-drop only when no image */}
            {!preview && (
                <div
                    {...getRootProps()}
                    className={`flex flex-col items-center justify-center w-full px-4 ${config.container} border-2 border-dashed rounded-lg cursor-pointer transition ${
                        isDragActive
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-400 bg-[#ebf8f8]'
                    } ${uploading ? 'opacity-50' : ''}`}
                >
                    <input {...getInputProps()} disabled={uploading} />
                    {uploading ? (
                        <p className={`${config.text} text-gray-500`}>Uploading...</p>
                    ) : (
                        <p className={`${config.text} text-gray-500`}>{placeholder}</p>
                    )}
                </div>
            )}

            {/* Show preview when image is uploaded */}
            {preview && (
                <div className={`flex items-center ${config.previewContainer} p-2 rounded-lg bg-white shadow-md border-gray-200 ${size === 'large' ? 'mt-2' : ''}`}>
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className={`${config.preview} object-cover rounded-md`} 
                    />

                    <div className="flex flex-col flex-1 overflow-hidden ml-2">
                        <p className="text-xs text-gray-600 max-w-[280px] truncate">
                            {preview.startsWith('https://res.cloudinary.com') ? 'Image uploaded successfully' : 'Loading...'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-1 rounded-full hover:bg-red-100 transition ml-2"
                        title="Remove"
                        disabled={uploading}
                    >
                        <svg
                            className="size-5 cursor-pointer hover:scale-110"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1"
                            stroke="red"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Error message */}
            {fieldError && (
                <span className="text-red-500 text-sm mt-1 block">{fieldError}</span>
            )}
        </div>
    );
}

export default DragAndDrop;