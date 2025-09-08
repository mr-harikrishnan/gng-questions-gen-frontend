
import DragAndDrop from '../Drag-And-Drop/DragAndDrop'

function MsqImageOptionsCard({ formik, index, correctAnswer, setCorrectAnswer, questionId }) {



    const deleteOptions = (idx) => {
        const optionsData = [...formik.values.options]
        optionsData.splice(idx, 1)
        formik.setFieldValue(`options`, optionsData)

        if (idx == correctAnswer) {
            setCorrectAnswer(0)
        }
    }


    const toggleCorrectAnswer = (idx) => {
        if (correctAnswer.includes(idx)) {
            setCorrectAnswer(correctAnswer.filter(ans => ans !== idx));
        } else {
            setCorrectAnswer([...correctAnswer, idx]);
        }
    };

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



            <div className='flex md:items-center flex-col gap-2 md:flex-row' >
                <div
                    onClick={() => { toggleCorrectAnswer(index) }}
                    className={`${correctAnswer.includes(index)
                        ? "bg-[#71C9CE] justify-end"
                        : "bg-gray-200 justify-start"} border flex items-center border-gray-100 h-7 rounded-3xl max-w-12 md:min-w-12 py-1`}>
                    <div className='border border-gray-300 bg-white h-5.5 w-5.5 rounded-3xl ml-1 '></div>

                </div>

                <div className='w-full'>

                    <div className="">
                        <DragAndDrop formik={formik}
                            questionId={questionId}
                            fieldName="options"
                            index={index}
                            size="small"
                            placeholder="Drag & Drop Image for Option"></DragAndDrop>
                    </div>

                    {formik.touched.options?.[index]?.option && formik.errors.options?.[index]?.option && (
                        <span className="text-red-500 text-sm">{formik.errors.options[index].option}</span>
                    )}


                </div>


                <div className='md:w-12 h-12 appearance-none border text-md text-gray-500 flex items-center justify-center   my-2  bg-[#ebf8f8]  border-gray-400 rounded-lg cursor-pointer hover:bg-[#d3f0f3] transition'>
                    {formik.values.options[index].mark}
                </div>
            </div>


        </div>
    )
}

export default MsqImageOptionsCard