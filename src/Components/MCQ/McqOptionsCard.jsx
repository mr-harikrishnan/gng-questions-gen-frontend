import React, { useState } from 'react'

function McqOptionsCard({ formik, index, correctAnswer, setCorrectAnswer }) {



    const deleteOptions = (idx) => {
        const optionsData = [...formik.values.options]
        optionsData.splice(idx, 1)
        formik.setFieldValue(`options`, optionsData)

        if(idx == correctAnswer){
            setCorrectAnswer(0)
        }
    }

    

    return (
        <div>

            <div className='flex items-center gap-3'>
                <h1 className='text-sm text-gray-500 my-2'>Option {index + 1}</h1>
                <svg
                    onClick={() => deleteOptions(index)}

                    className={`${formik.values.options.length > 2 ? "block" : "hidden"} size-5 cursor-pointer hover:scale-120`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="red">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

            </div>



            <div className='flex gap-4 items-center' >
                <div
                    onClick={() => { setCorrectAnswer(index) }}
                    className={`${correctAnswer === index
                        ? "bg-[#71C9CE] justify-end"
                        : "bg-gray-200 justify-start"} border flex items-center border-gray-100 h-7 rounded-3xl min-w-12 py-1`}>
                    <div className='border border-gray-300 bg-white h-5.5 w-5.5 rounded-3xl ml-1 '></div>

                </div>
                <div className='w-full'>
                    <input
                        type="text"
                        name={`options[${index}].option`}
                        value={formik.values.options[index].option}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='Write option'
                        className="appearance-none border w-full text-sm text-gray-500 items-center justify-center  px-4 my-2 py-3 bg-[#ebf8f8]  border-gray-400 rounded-lg cursor-pointer hover:bg-[#d3f0f3] transition"
                    />
                    {formik.touched.options?.[index]?.option && formik.errors.options?.[index]?.option && (
                        <span className="text-red-500 text-sm">{formik.errors.options[index].option}</span>
                    )}


                </div>


                <div className='w-14 h-12 appearance-none border text-md text-gray-500 flex items-center justify-center   my-2  bg-[#ebf8f8]  border-gray-400 rounded-lg cursor-pointer hover:bg-[#d3f0f3] transition'>
                    {formik.values.options[index].mark}
                </div>
            </div>


        </div>
    )
}

export default McqOptionsCard

//     < div

// className = {`${formik.values.correctAnswerIndex === index
//     ? "bg-[#71C9CE] justify-end"
//     : "bg-gray-200 justify-start"} border flex items-center border-gray-100 h-7 rounded-3xl min-w-12 py-1`}>

