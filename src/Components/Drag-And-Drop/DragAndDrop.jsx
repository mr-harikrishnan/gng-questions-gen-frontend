import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFileToS3 } from "../../hook/api/s3BucketApi";
import { v4 as uuidv4 } from "uuid";


function DragAndDrop({
    formik,
    fieldName = "image",
    index = null,
    size = "large",
    placeholder = "Drag & Drop or Click to Upload",
    questionId
}) {

    
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [currentUuid, setCurrentUuid] = useState(null)


    const sizeConfig = {
        small: { container: "h-12", preview: "w-16 h-16", text: "text-[0.6rem] md:text-sm", previewContainer: "w-70 sm:w-full" },
        medium: { container: "h-20 py-4", preview: "w-20 h-20", text: "text-xs md:text-sm", previewContainer: "w-80 sm:w-full" },
        large: { container: "py-6", preview: "w-24 h-24", text: "text-sm", previewContainer: "w-72" },
    };

    const config = sizeConfig[size] || sizeConfig.medium;




    const getCurrentFieldValue = () => {
        return index !== null
            ? formik.values[fieldName]?.[index]?.option
            : formik.values[fieldName];
    };



    useEffect(() => {
        const currentValue = getCurrentFieldValue();

        if (currentValue && typeof currentValue === 'string' && currentValue.startsWith('http')) {
            setPreview(currentValue);
        }

    }, [formik.values, fieldName, index]);






    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setUploading(true);

        try {
            var fileName = null
            if (currentUuid) {
                fileName = currentUuid + ".jpg"
            }
            else {
                fileName = uuidv4() + ".jpg"
            }
            console.log(fileName)

            const s3Url = await uploadFileToS3(file, fileName,questionId);
            console.log("New URL:", s3Url);

            console.log("Uploaded to S3:", s3Url);

            const field = index !== null ? `${fieldName}[${index}].option` : fieldName;
            formik.setFieldValue(field, s3Url);

            if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
            setPreview(s3Url);
        } catch (err) {
            console.error("Upload failed:", err);
            setPreview(previewUrl);
        } finally {
            setUploading(false);
        }
    }, [formik, fieldName, index]);

    const handleRemove = () => {
        if (preview && preview.startsWith("http")) {

            const currentFileName = preview.split("/").pop();
            const splitedUuid = currentFileName?.split(".").shift();
            if (splitedUuid) {
                console.log("old uuid :", splitedUuid);
                setCurrentUuid(splitedUuid);
            }
        }

        const field = index !== null ? `${fieldName}[${index}].option` : fieldName;
        formik.setFieldValue(field, "");

        if (preview?.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }

        setPreview(null);
    };


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

    const fieldError =
        index !== null
            ? formik.touched[fieldName]?.[index]?.option &&
            formik.errors[fieldName]?.[index]?.option
            : formik.touched[fieldName] && formik.errors[fieldName];

    return (
        <div className="w-full">
            {!preview && (
                <div
                    {...getRootProps()}
                    className={`flex flex-col items-center justify-center w-full px-4 ${config.container} border-2 border-dashed rounded-lg cursor-pointer transition ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-400 bg-[#ebf8f8]"
                        }`}
                >
                    <input {...getInputProps()} />
                    <p className={`${config.text} text-gray-500`}>
                        {uploading ? "Uploading..." : placeholder}
                    </p>
                </div>
            )}

            {preview && (
                <div
                    className={`flex items-center ${config.previewContainer} p-2 rounded-lg bg-white shadow-md border-gray-200 ${size === "large" ? "mt-2" : ""
                        }`}
                >
                    <img src={preview} alt="Preview" className={`${config.preview} object-cover rounded-md`} />
                    <div className="flex flex-col flex-1 overflow-hidden ml-2">
                        <p className="text-xs text-gray-600 max-w-[280px] truncate">
                            {uploading ? "uploading.." : `Image Uploaded`}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-1 rounded-full hover:bg-red-100 transition ml-2"
                        title="Remove"
                    >
                        <svg className="size-5 cursor-pointer hover:scale-110" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="red" > <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> </svg>
                    </button>
                </div>
            )}

            {fieldError && <span className="text-red-500 text-sm mt-1 block">{fieldError}</span>}
        </div>
    );
}

export default DragAndDrop;