import React, { useState } from "react";
import { Link } from "react-router-dom";
import { deleteQuestionApi, updateQuestion } from "../../hook/api/questionsApi";

const QuestionCard = ({ q ,fetchData}) => {
    const [expanded, setExpanded] = useState(false);
    const [published, setPublished] = useState(q.published)

    function publish(id) {
        const userResponse = confirm("Do you want to publish?");
        if (userResponse) {
            const updateData = async () => {
                try {
                    const response = await updateQuestion(id, { published: true });
                    console.log("Question published successfully", response);
                    setPublished(true)
                    fetchData()
                } catch (error) {
                    console.log(error);
                }
            }
            updateData();
        }
    }

    async function deleteQuestion(id) {
        const userResponse = confirm("Confirm delete this question?");
        if (userResponse) {
            try {
                const response = await deleteQuestionApi(id);
                console.log("Question deleted successfully", response);
                setPublished(true); 
                fetchData()
            } catch (error) {
                console.log(error);
            }
        }
    }


    return (
        <div className="border rounded-md shadow-sm bg-white">
            {/* Header */}
            <div
                onClick={() => setExpanded(!expanded)}
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
            >
                <div>
                    <p className="text-[12px] text-gray-500">{q.subject}-{q.topic}</p>
                    <p className="font-semibold text-gray-600">{q.question}</p>
                </div>


                <div className="flex gap-2 items-center">
                    {/* Edit & Delete visible only if expanded */}
                    {expanded && (
                        <>
                            {/* Edit */}
                            <Link to={`/editform/${q._id}`}>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5 text-blue-600"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                        />
                                    </svg>
                                </button>
                            </Link>


                            {/* Delete */}
                            <button
                            onClick={()=>{
                                deleteQuestion(q._id)
                            }}
                            className="p-1 hover:bg-gray-100 rounded">
                                <svg
                                
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5 text-red-600"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Toggle Arrow */}
                    <button>
                        {expanded ? (
                            // Up Arrow
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                                />
                            </svg>
                        ) : (
                            // Down Arrow
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="p-4 border-t">
                    {/* Question Image */}
                    {q.image && (
                        <img
                            src={q.image}
                            alt="question"
                            className="w-32 mb-3 rounded-md border"
                        />
                    )}
                    <p className="font-semibold">Question Type : {q.questionsType.toUpperCase()}</p>


                    {/* Options */}
                    <div className="mt-3">
                        {q.questionsType !== "ntq" && q.options?.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {q.options.map((opt) => (
                                    <div
                                        key={opt._id}
                                        className={`border p-2 rounded-md flex justify-center items-center ${opt.isCorrect ? "border-[#71c9ce] bg-[#e3efef]" : "border-gray-300"}`}
                                    >
                                        {opt.option.startsWith("http") ? (
                                            <img src={opt.option} alt="option" className="w-16 h-16 object-contain" />
                                        ) : (
                                            <span>{opt.option}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : q.questionsType === "ntq" ? (
                            <div className="flex gap-4">
                                <span className="px-6 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Min: {q.min}</span>
                                <span className="px-6 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Max: {q.max}</span>
                            </div>
                        ) : null}
                    </div>
                    <div className="w-full flex justify-end gap-3 p-2">
                        {/* Publish Button */}
                        {published === false ? (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md shadow-sm">
                                <h1 className="text-sm font-medium text-gray-700">Publish?</h1>
                                <button
                                    onClick={() => publish(q._id)}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Yes
                                </button>
                            </div>
                        ) : (
                            // Published Status
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md shadow-sm">
                                <h1 className="text-sm font-medium text-gray-700">Status:</h1>
                                <span className="px-2 py-1 rounded-m bg-green-100 text-green-800 text-xs font-medium">
                                    Published
                                </span>
                            </div>
                        )}
                    </div>





                </div>




            )
            }



        </div >
    );
};

export default QuestionCard;
