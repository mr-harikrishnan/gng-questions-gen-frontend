import React, { useEffect, useState } from 'react'
import McqImageOptionsCard from './McqImageOptionsCard';



function McqImage({ formik }) {

    const [correctAnswer, setCorrectAnswer] = useState(0)


    useEffect(() => {
        if (formik.values.options.length === 0) {
            const newOptions = [
                { option: "", mark: 10, isCorrect: true },
                { option: "", mark: 0, isCorrect: false }
            ];
            formik.setFieldValue("options", newOptions);
            setCorrectAnswer(0);
        }
    }, [formik.values.options]);

    const addOption = () => {
        const newOptions = [...formik.values.options, {
            option: "",
            mark: 0,
            isCorrect: false
        }];
        formik.setFieldValue("options", newOptions);

    }

    useEffect(() => {
        const updatedOptions = formik.values.options.map((opt, idx) => ({
            ...opt,
            isCorrect: idx === correctAnswer,
            mark: idx === correctAnswer ? 10 : 0

        }));
        formik.setFieldValue("options", updatedOptions);



    }, [correctAnswer]);


    return (
        <div>
            <h1 className='text-sm  text-gray-500 my-2'>MCQ type image option</h1>

            <div

                className='flex justify-end'>
                <svg
                    onClick={() => {
                        addOption()
                    }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="gray" className="size-6 cursor-pointer hover:scale-120">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {formik.values.options.map((opt, index) => (
                    <McqImageOptionsCard
                        key={index}
                        formik={formik}
                        index={index}
                        correctAnswer={correctAnswer}
                        setCorrectAnswer={setCorrectAnswer}
                    />
                ))}
            </div>



        </div>
    )
}

export default McqImage