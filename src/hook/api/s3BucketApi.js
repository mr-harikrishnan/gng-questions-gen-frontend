import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const uploadFileToS3 = async (file, fileUuid, questionsType) => {
    console.log("uploadFileToS3 :" + fileUuid)
    console.log(questionsType)
    console.log("File to upload:", file)
    var chunkSize = 1024 * 1024 * 5
    var fileSize = file.size;
    var count = Math.ceil(fileSize / chunkSize)


    const fileName = fileUuid


    const uploadId = await axios.post("http://localhost:3000/start-multi-part-upload", {
        fileKey: fileName,
        questionsType: questionsType
    })

    console.log(uploadId.data)

    let partNumber = 1
    const parts = []

    for (let start = 0; start < fileSize; start += chunkSize) {
        var chunk = file.slice(start, start + chunkSize)
        console.log(chunk)

        const signedUrl = await axios.post("http://localhost:3000/get-pre-signed-url", {
            fileId: uploadId.data.fileId,
            fileKey: fileName,
            partNumber,
            questionsType: questionsType
        })

        //uploadChunk
        const uploadData = await axios.put(signedUrl.data.signedUrl, chunk)
        parts.push({
            ETag: uploadData.headers.etag.replaceAll('"', ""),
            PartNumber: partNumber,
            questionsType: questionsType
        })
        partNumber++
    }

    const completeResponse = await axios.post("http://localhost:3000/complete-multi-part-upload", {
        parts,
        fileKey: fileName,
        fileId: uploadId.data.fileId,
        questionsType: questionsType
    })
    console.log(parts)

    // Construct and return S3 URL
    const s3Url = `https://d1rhvsdiboxrlj.cloudfront.net/Harikrishnan/questionsGen/${questionsType}/${fileName}`;

    console.log("S3 URL:", s3Url);
    return s3Url;
}