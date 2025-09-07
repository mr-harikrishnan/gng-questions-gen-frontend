import React, { Suspense, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Link, useParams } from 'react-router-dom';
import CodeEditor from '../../Components/Code-Editor/CodeEditor';
import DragAndDrop from '../../Components/Drag-And-Drop/DragAndDrop';

import MCQ from '../../assets/MCQ.png';
import MSQ from '../../assets/MSQ.png';
import MCQI from '../../assets/MCQI.png';
import MSQI from '../../assets/MSQI.png';
import NTQ from '../../assets/NTQ.png';

import { getAllSubjectsAndTopics } from '../../hook/api/subjectAndTopic';
import { getQuestionById, updateQuestion } from '../../hook/api/questionsApi';
import Header from '../../Components/Header/Header';

const Mcq = React.lazy(() => import('../../Components/MCQ/Mcq'));
const Msq = React.lazy(() => import('../../Components/MSQ/Msq'));
const McqImage = React.lazy(() => import('../../Components/MCQI/McqImage'));
const MsqImage = React.lazy(() => import('../../Components/MSQI/MsqImage'));
const Ntq = React.lazy(() => import('../../Components/NTQ/Ntq'));

function EditForm() {
    const { id } = useParams();
    const [subjectsArray, setSubjectsArray] = useState([]);
    const [topics, setTopics] = useState([]);
    const [showEditor, setShowEditor] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const formik = useFormik({
        initialValues: {
            question: "",
            image: null,
            code: "Write your Code...",
            subject: "",
            topic: "",
            options: [],
            questionsType: "mcq",
            explanation: "",
            tags: [],
            min: "",
            max: ""
        },
        enableReinitialize: true,
        validate: (values) => {
            const errors = {};
            if (!values.question || values.question.trim().length < 5) errors.question = "Please enter minimum 5 letters";
            if (!values.explanation || values.explanation.trim().length < 5) errors.explanation = "Please enter minimum 5 letters";
            if (values.tags.length < 2) errors.tags = "Please enter minimum 2 tags";

            if (values.questionsType === 'ntq') {
                if (!values.min) errors.min = "Please enter minimum value";
                if (!values.max) errors.max = "Please enter maximum value";
            }

            if (values.questionsType !== 'ntq') {
                const optionErrors = [];
                values.options.forEach((opt, index) => {
                    const err = {};
                    if (!opt.option || opt.option.toString().trim() === "") {
                        if (["mcq", "msq"].includes(values.questionsType)) err.option = "Please enter option";
                        else if (["mcqImage", "msqImage"].includes(values.questionsType)) err.option = "Please add image in your option";
                    }
                    if (Object.keys(err).length > 0) optionErrors[index] = err;
                });
                if (optionErrors.some(err => err !== undefined)) errors.options = optionErrors;
            }

            return errors;
        },
        onSubmit: async (values) => {
            const submitData = { ...values };
            if (submitData.questionsType !== 'ntq') {
                delete submitData.min;
                delete submitData.max;
            }
            try {
                const response = await updateQuestion(id, submitData);
                console.log("Updated successfully:", response);
            } catch (err) {
                console.error("Update error:", err);
            }
        }
    });

    useEffect(() => {
        const fetchSubjectsAndQuestion = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const [subjectsData, questionData] = await Promise.all([
                    getAllSubjectsAndTopics(),
                    getQuestionById(id)
                ]);

                setSubjectsArray(subjectsData);

                // Set topics based on the question's subject
                if (subjectsData.length > 0) {
                    const selectedSub = subjectsData.find(s => s.subject === questionData.subject);
                    if (selectedSub) {
                        setTopics(selectedSub.topics);
                    }
                }

                // Show code editor if code exists and is not default
                if (questionData.code && questionData.code !== "Write your Code...") {
                    setShowEditor(true);
                }
                console.log(questionData)

                // Set formik values - using setValues for bulk update
                formik.setValues({
                    question: questionData.question || "",
                    image: questionData.image || null,
                    code: questionData.code || "Write your Code...",
                    subject: questionData.subject || subjectsData[0]?.subject || "",
                    topic: questionData.topic || subjectsData[0]?.topics[0] || "",
                    options: Array.isArray(questionData.options) ? questionData.options : [],
                    questionsType: questionData.questionsType || "mcq",
                    explanation: questionData.explanation || "",
                    tags: Array.isArray(questionData.tags) ? questionData.tags : [],
                    min: questionData.min || "",
                    max: questionData.max || ""
                });

            } catch (err) {
                console.error("Error fetching question or subjects:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubjectsAndQuestion();
    }, [id]);

    const setTopicSelectedSubject = (value) => {
        const selectedSubject = subjectsArray.find(sub => sub.subject === value);
        if (selectedSubject) {
            setTopics([...selectedSubject.topics]);
            formik.setFieldValue('topic', selectedSubject.topics[0]);
        }
    };

    const addNewTag = (e) => {
        const inputValue = e.target.value;
        if (inputValue.endsWith(',')) {
            const newTags = inputValue.slice(0, -1).split(',').map(tag => tag.trim()).filter(tag => tag !== "");
            if (newTags.length > 0) {
                formik.setFieldValue("tags", [...new Set([...formik.values.tags, ...newTags])]);
                e.target.value = "";
            }
        }
    };

    const removeTag = (tagToRemove) => {
        formik.setFieldValue("tags", formik.values.tags.filter(tag => tag !== tagToRemove));
    };

    if (isLoading) {
        return (
            <div className="min-h-full w-full flex items-center justify-center">
                <div className="text-lg">Loading question data...</div>
            </div>
        );
    }

    return (
        <div className='min-h-full w-full flex flex-col items-center'>
            <Header title='Edit Form'></Header>

            <form className='w-full max-w-4xl p-4 md:p-8 mr-12' onSubmit={formik.handleSubmit}>
                <div className='p-4'>
                    <div className='flex flex-col my-2'>
                        <label className='text-sm text-gray-500 my-2'>Question</label>
                        <input
                            type="text"
                            name='question'
                            value={formik.values.question}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder='Write Your Question'
                            className='border-1 h-20 rounded-lg pl-2 placeholder-gray-400 border-gray-400 bg-[#ebf8f8] hover:bg-[#d3f0f3]'
                        />
                        {formik.touched.question && formik.errors.question && (
                            <span className="text-red-500 text-sm">{formik.errors.question}</span>
                        )}
                    </div>

                    <DragAndDrop formik={formik} questionsType={formik.values.questionsType} />

                    <button
                        type="button"
                        onClick={() => setShowEditor(!showEditor)}
                        className="flex text-sm text-gray-500 items-center justify-center w-full px-4 my-2 py-3 bg-[#ebf8f8] border border-gray-400 rounded-lg cursor-pointer hover:bg-[#d3f0f3] transition">
                        {showEditor ? 'Hide Code Editor' : 'Add Code'}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="size-5 mx-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                        </svg>
                    </button>

                    {showEditor && (
                        <CodeEditor
                            code={formik.values.code}
                            setCode={(val) => formik.setFieldValue('code', val)}
                        />
                    )}

                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='w-full'>
                            <label className='text-sm text-gray-500 my-2'>Subject</label>
                            <select
                                name="subject"
                                value={formik.values.subject}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    setTopicSelectedSubject(e.target.value);
                                }}
                                onBlur={formik.handleBlur}
                                className='appearance-none border w-full text-sm text-gray-500 items-center justify-center px-4 my-2 py-3 bg-[#ebf8f8] border-gray-400 rounded-lg cursor-pointer hover:bg-[#d3f0f3] transition'
                            >
                                {subjectsArray.map((sub, index) => (
                                    <option key={index} value={sub.subject}>{sub.subject}</option>
                                ))}
                            </select>
                        </div>

                        <div className='w-full'>
                            <label className='text-sm text-gray-500 my-2'>Topics</label>
                            <select
                                name="topic"
                                value={formik.values.topic}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className='appearance-none border w-full text-sm text-gray-500 items-center justify-center px-4 my-2 py-3 bg-[#ebf8f8] border-gray-400 rounded-lg cursor-pointer hover:bg-[#d3f0f3] transition'
                            >
                                {topics.map((top, index) => (
                                    <option key={index} value={top}>{top}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <Suspense fallback={<div>Loading...</div>}>
                            {formik.values.questionsType === "mcq" && <Mcq formik={formik} questionsType={formik.values.questionsType} />}
                            {formik.values.questionsType === "msq" && <Msq formik={formik} questionsType={formik.values.questionsType} />}
                            {formik.values.questionsType === "mcqImage" && <McqImage formik={formik} questionsType={formik.values.questionsType} />}
                            {formik.values.questionsType === "msqImage" && <MsqImage formik={formik} questionsType={formik.values.questionsType} />}
                            {formik.values.questionsType === "ntq" && <Ntq formik={formik} questionsType={formik.values.questionsType} />}
                        </Suspense>
                    </div>

                    <div className='flex flex-col my-2'>
                        <label className='text-sm text-gray-500 my-2'>Explanation</label>
                        <input
                            name='explanation'
                            value={formik.values.explanation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type="text"
                            placeholder='Add your explanations'
                            className='border-1 h-20 pl-2 rounded-lg placeholder-gray-400 border-gray-400 bg-[#ebf8f8] hover:bg-[#d3f0f3]'
                        />
                        {formik.touched.explanation && formik.errors.explanation && (
                            <span className="text-red-500 text-sm">{formik.errors.explanation}</span>
                        )}
                    </div>

                    <div className='flex flex-col my-2'>
                        <label className='text-sm text-gray-500 my-2'>Tag</label>
                        <input
                            type="text"
                            name="tags"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === ",") {
                                    e.preventDefault();
                                    const newTags = e.target.value
                                        .split(",") // comma la split pannu
                                        .map(tag => tag.trim()) // space remove
                                        .filter(tag => tag.length > 0); // empty illa nu check

                                    if (newTags.length > 0) {
                                        const currentTags = Array.isArray(formik.values.tags) ? formik.values.tags : [];
                                        formik.setFieldValue("tags", [...new Set([...currentTags, ...newTags])]);
                                        e.target.value = "";
                                    }
                                }
                            }}
                            placeholder="Add your tags (press Enter or comma)"
                            className="border-1 pl-2 h-9 placeholder-gray-400 rounded-lg border-gray-400 bg-[#ebf8f8] hover:bg-[#d3f0f3]"
                        />

                        {formik.touched.tags && formik.errors.tags && (
                            <span className="text-red-500 text-sm">{formik.errors.tags}</span>
                        )}

                        {Array.isArray(formik.values.tags) && formik.values.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {formik.values.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm cursor-pointer hover:bg-blue-200"
                                        onClick={() => removeTag(tag)}
                                        title="Click to remove"
                                    >
                                        {tag} ×
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type='submit'
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Update Question
                    </button>
                </div>
            </form>

            <div className='fixed z-60 top-1/2 -translate-y-1/2 right-1 p-2 rounded-lg flex flex-col gap-4'>
                <img
                    onClick={() => {
                        if (formik.values.questionsType !== "mcq") {
                            const permission = window.confirm("Switching options will clear the previous options. Continue?");
                            if (permission) {
                                formik.setFieldValue("options", []);
                                formik.setFieldValue("questionsType", "mcq");
                            }
                        }
                    }}
                    src={MCQ}
                    className={`h-10 w-10 cursor-pointer hover:border-3 hover:border-[#71C9CE] rounded border mx-auto ${formik.values.questionsType === "mcq" ? "border-[#71C9CE] border-3" : "border-gray-300"
                        }`}
                    alt="MCQ"
                />

                <img
                    onClick={() => {
                        if (formik.values.questionsType !== "msq") {
                            const permission = window.confirm("Switching options will clear the previous options. Continue?");
                            if (permission) {
                                formik.setFieldValue("options", []);
                                formik.setFieldValue("questionsType", "msq");
                            }
                        }
                    }}
                    src={MSQ}
                    className={`h-10 w-10 cursor-pointer hover:border-3 hover:border-[#71C9CE] rounded border mx-auto ${formik.values.questionsType === "msq" ? "border-[#71C9CE] border-3" : "border-gray-300"
                        }`}
                    alt="MSQ"
                />

                <img
                    onClick={() => {
                        if (formik.values.questionsType !== "mcqImage") {
                            const permission = window.confirm("Switching options will clear the previous options. Continue?");
                            if (permission) {
                                formik.setFieldValue("options", []);
                                formik.setFieldValue("questionsType", "mcqImage");
                            }
                        }
                    }}
                    src={MCQI}
                    className={`h-10 w-10 cursor-pointer hover:border-3 hover:border-[#71C9CE] rounded border mx-auto ${formik.values.questionsType === "mcqImage" ? "border-[#71C9CE] border-3" : "border-gray-300"
                        }`}
                    alt="MCQI"
                />

                <img
                    onClick={() => {
                        if (formik.values.questionsType !== "msqImage") {
                            const permission = window.confirm("Switching options will clear the previous options. Continue?");
                            if (permission) {
                                formik.setFieldValue("options", []);
                                formik.setFieldValue("questionsType", "msqImage");
                            }
                        }
                    }}
                    src={MSQI}
                    className={`h-10 w-10 cursor-pointer hover:border-3 hover:border-[#71C9CE] rounded border mx-auto ${formik.values.questionsType === "msqImage" ? "border-[#71C9CE] border-3" : "border-gray-300"
                        }`}
                    alt="MSQI"
                />

                <img
                    onClick={() => {
                        if (formik.values.questionsType !== "ntq") {
                            const permission = window.confirm("Switching options will clear the previous options. Continue?");
                            if (permission) {
                                formik.setFieldValue("options", []);
                                formik.setFieldValue("questionsType", "ntq");
                            }
                        }
                    }}
                    src={NTQ}
                    className={`h-10 w-10 cursor-pointer hover:border-3 hover:border-[#71C9CE] rounded border mx-auto ${formik.values.questionsType === "ntq" ? "border-[#71C9CE] border-3" : "border-gray-300"
                        }`}
                    alt="NTQ"
                />
            </div>
        </div>
    );
}

export default EditForm;