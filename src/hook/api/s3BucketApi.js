import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const uploadFileToS3 = async (file, fileUuid, questionId) => {
    console.log("uploadFileToS3 :" + fileUuid)
    console.log(questionId)
    console.log("File to upload:", file)
    var chunkSize = 1024 * 1024 * 5
    var fileSize = file.size;
    var count = Math.ceil(fileSize / chunkSize)


    const fileName = fileUuid


    const uploadId = await axios.post("https://gng-questions-gen-backend.onrender.com/start-multi-part-upload", {
        fileKey: fileName,
        questionId: questionId
    })

    console.log(uploadId.data)

    let partNumber = 1
    const parts = []

    for (let start = 0; start < fileSize; start += chunkSize) {
        var chunk = file.slice(start, start + chunkSize)
        console.log(chunk)

        const signedUrl = await axios.post("https://gng-questions-gen-backend.onrender.com/get-pre-signed-url", {
            fileId: uploadId.data.fileId,
            fileKey: fileName,
            partNumber,
            questionId: questionId
        })

        //uploadChunk
        const uploadData = await axios.put(signedUrl.data.signedUrl, chunk)
        parts.push({
            ETag: uploadData.headers.etag.replaceAll('"', ""),
            PartNumber: partNumber,
            questionId: questionId
        })
        partNumber++
    }

    const completeResponse = await axios.post("https://gng-questions-gen-backend.onrender.com/complete-multi-part-upload", {
        parts,
        fileKey: fileName,
        fileId: uploadId.data.fileId,
        questionId: questionId
    })
    console.log(parts)

    // Construct and return S3 URL
    const s3Url = `https://d1rhvsdiboxrlj.cloudfront.net/Harikrishnan/questionsGen/${questionId}/${fileName}`;

    console.log("S3 URL:", s3Url);
    return s3Url;
}