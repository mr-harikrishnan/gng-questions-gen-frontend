import React, { Suspense, useState, useEffect } from 'react'
import { useFormik } from 'formik'
import CodeEditor from '../../Components/Code-Editor/CodeEditor'
import DragAndDrop from '../../Components/Drag-And-Drop/DragAndDrop'

import MCQ from '../../assets/MCQ.png'
import MSQ from '../../assets/MSQ.png'
import MCQI from '../../assets/MCQI.png'
import MSQI from '../../assets/MSQI.png'
import NTQ from '../../assets/NTQ.png'
import { createQuestion } from '../../hook/api/questionsApi'
import { getAllSubjectsAndTopics } from '../../hook/api/subjectAndTopic'
import { Link } from 'react-router-dom'

const Mcq = React.lazy(() => import('../../Components/MCQ/Mcq'))
const Msq = React.lazy(() => import('../../Components/MSQ/Msq'))
const McqImage = React.lazy(() => import('../../Components/MCQI/McqImage'))
const MsqImage = React.lazy(() => import('../../Components/MSQI/MsqImage'))
const Ntq = React.lazy(() => import('../../Components/NTQ/Ntq'))

function CreateForm() {
  const [subjectsArray, setSubjectsArray] = useState([]);
  const [topics, setTopics] = useState([]);
  const [showEditor, setShowEditor] = useState(false)


  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getAllSubjectsAndTopics();
        setSubjectsArray(data);

        if (data.length > 0) {
          setTopics(data[0].topics);
          formik.setFieldValue('subject', data[0].subject);
          formik.setFieldValue('topic', data[0].topics[0]);
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    }

    fetchSubjects();
  }, []);




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
    validate: (values) => {
      const errors = {};

      // Question
      if (!values.question || values.question.trim().length < 5) {
        errors.question = "Please enter minimum 5 letters";
      }

      // Explanation
      if (!values.explanation || values.explanation.trim().length < 5) {
        errors.explanation = "Please enter minimum 5 letters";
      }

      // Tags
      if (values.tags.length < 2) {
        errors.tags = "Please enter minimum 2 tags ";
      }

      // For NTQ type questions
      if (values.questionsType === 'ntq') {
        if (!values.min) {
          errors.min = "Please enter minimum value";
        }
        if (!values.max) {
          errors.max = "Please enter maximum value";
        }
      }

      // Options Validation for non-NTQ questions
      if (values.questionsType !== 'ntq') {
        const optionErrors = [];

        values.options.forEach((opt, index) => {
          const err = {};

          if (!opt.option || opt.option.toString().trim() === "") {
            if (values.questionsType === "mcq" || values.questionsType === "msq") {
              err.option = "Please enter option";
            } else if (values.questionsType === "mcqImage" || values.questionsType === "msqImage") {
              err.option = "Please add image in your option";
            }
          }

          // Only push if there is actually an error
          if (Object.keys(err).length > 0) {
            optionErrors[index] = err;
          }
        });

        // Check if any option has error
        if (optionErrors.some(err => err !== undefined)) {
          errors.options = optionErrors;
        }
      }

      return errors;
    },
    onSubmit: async (values) => {
      // For non-NTQ questions, remove min and max fields
      if (values.questionsType !== 'ntq') {
        delete values.min;
        delete values.max;
      }
      try {
        const response = await createQuestion(values)
        console.log(response)
        alert("submit successfull")
      } catch (error) {

      }

      console.log("Form submitted with values:", values);
    }
  })

  const setTopicSelectedSubject = (value) => {
    const selectedSubject = subjectsArray.find(sub => sub.subject === value);
    if (selectedSubject) {
      setTopics([...selectedSubject.topics]);
      formik.setFieldValue('topic', selectedSubject.topics[0]);
    }
  };

  const addNewTag = (tags) => {
    if (tags.includes(",")) {
      let newTags = tags.split(",").map(tag => tag.trim());
      formik.setFieldValue("tags", [...newTags]);
    }
  }

  return (
    <div className='min-h-full w-full  flex flex-col items-center'>
      {/* HEADLINE */}
      <div className="w-full flex items-center bg-[#71C9CE]">
        <div className='w-full ml-4'>
          <Link to={"/"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-6 cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </Link>
        </div>
        <h1 className=' p-2 w-full font-medium text-3xl text-white text-center font-sans'>Question Generator</h1>
        <div className='w-full'></div>
      </div>

      {/* QUESTION FORM */}
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

          {/* CHOOSE FILE */}
          <DragAndDrop formik={formik} questionsType={formik.values.questionsType}/>

          {/* ADD CODE */}
          <button
            type="button"
            onClick={() => {
              setShowEditor(!showEditor)
            }}
            className="flex text-sm text-gray-500 items-center justify-center w-full px-4 my-2 py-3 bg-[#ebf8f8] border border-gray-400 rounded-lg cursor-pointer hover:bg-[#d3f0f3] transition">
            Add code
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="size-5 mx-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
            </svg>
          </button>

          {showEditor && (
            <CodeEditor
              code={formik.values.code}
              setCode={(val) => {
                formik.setFieldValue('code', val)
              }}
            />
          )}

          {/* CHOOSE SUBJECT AND TOPIC */}
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='w-full'>
              <label className='text-sm text-gray-500 my-2'>Subject</label>
              <select
                name="subject"
                value={formik.values.subject}
                onChange={(e) => {
                  formik.handleChange(e)
                  setTopicSelectedSubject(e.target.value)
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

          {/* QUESTION TYPE COMPONENTS */}
          <div>
            <Suspense fallback={<div>Loading...</div>}>
              {formik.values.questionsType === "mcq" && <Mcq formik={formik} />}
              {formik.values.questionsType === "msq" && <Msq formik={formik} />}
              {formik.values.questionsType === "mcqImage" && <McqImage formik={formik} questionsType={formik.values.questionsType}/>}
              {formik.values.questionsType === "msqImage" && <MsqImage formik={formik} questionsType={formik.values.questionsType}/>}
              {formik.values.questionsType === "ntq" && <Ntq formik={formik} />}
            </Suspense>
          </div>

          {/* EXPLANATION */}
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

          {/* TAGS */}
          <div className='flex flex-col my-2'>
            <label className='text-sm text-gray-500 my-2'>Tag</label>
            <input
              name='tags'
              onChange={(e) => {
                formik.handleChange(e)
                addNewTag(e.target.value)
              }}
              onBlur={formik.handleBlur}
              type="text"
              placeholder='Add your tags (comma separated)'
              className='border-1 pl-2 h-9 placeholder-gray-400 rounded-lg border-gray-400 bg-[#ebf8f8] hover:bg-[#d3f0f3]'
            />
            {formik.touched.tags && formik.errors.tags && (
              <span className="text-red-500 text-sm">{formik.errors.tags}</span>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type='submit'
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Question
          </button>
        </div>
      </form>

      {/* QUESTION TYPE NAVIGATION */}
      <div className='fixed z-60 top-1/2 -translate-y-1/2 right-1 p-2 rounded-lg flex flex-col gap-4 '>
        <img
          onClick={() => {
            if (formik.values.questionsType !== "mcq") {
              const permission = window.confirm("Switching options will clear the previous options. Continue?");
              if (permission) {
                formik.setFieldValue("options", [])
                formik.setFieldValue("questionsType", "mcq")
              }
            }
          }}
          src={MCQ}
          className='h-10 w-10 cursor-pointer hover:border-3 hover:border-[#71C9CE] rounded border border-gray-300 mx-auto'
          alt="MCQ"
        />

        <img
          onClick={() => {
            if (formik.values.questionsType !== "msq") {
              const permission = window.confirm("Switching options will clear the previous options. Continue?");
              if (permission) {
                formik.setFieldValue("options", [])
                formik.setFieldValue("questionsType", "msq")
              }
            }
          }}
          src={MSQ}
          className='h-10 w-10 cursor-pointer hover:border-3 hover:border-[#71C9CE] rounded border border-gray-300 mx-auto'
          alt="MSQ"
        />

        <img
          onClick={() => {
            if (formik.values.questionsType !== "mcqImage") {
              const permission = window.confirm("Switching options will clear the previous options. Continue?");
              if (permission) {
                formik.setFieldValue("options", [])
                formik.setFieldValue("questionsType", "mcqImage")
              }
            }
          }}
          src={MCQI}
          className='h-10 w-10 cursor-pointer hover:border-3 hover:border-[#71C9CE] rounded border border-gray-300 mx-auto'
          alt="MCQI"
        />

        <img
          onClick={() => {
            if (formik.values.questionsType !== "msqImage") {
              const permission = window.confirm("Switching options will clear the previous options. Continue?");
              if (permission) {
                formik.setFieldValue("options", [])
                formik.setFieldValue("questionsType", "msqImage")
              }
            }
          }}
          src={MSQI}
          className='h-10 w-10 cursor-pointer hover:border-3 hover:border-[#71C9CE] rounded border border-gray-300 mx-auto'
          alt="MSQI"
        />

        <img
          onClick={() => {
            if (formik.values.questionsType !== "ntq") {
              const permission = window.confirm("Switching options will clear the previous options. Continue?");
              if (permission) {
                formik.setFieldValue("options", [])
                formik.setFieldValue("questionsType", "ntq")
              }
            }
          }}
          src={NTQ}
          className='h-10 w-10 cursor-pointer hover:border-3 hover:border-[#71C9CE] rounded border border-gray-300 mx-auto'
          alt="NTQ"
        />
      </div>
    </div>
  )
}

export default CreateForm