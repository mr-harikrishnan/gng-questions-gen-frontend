import React, { useEffect, useState } from "react";
import { getAllQuestions } from "../../hook/api/questionsApi";
import QuestionCard from "../../Components/QuestionCard/QuestionCrad";
import { Link } from "react-router-dom";

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);


  const fetchData = async () => {
    try {
      const data = await getAllQuestions();
      setQuestions(data);
      console.log(data)
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-full pb-12 flex flex-col items-center">
      <div className="w-full flex items-center justify-between bg-[#71C9CE] p-4 shadow-md">
        <button
          className=""
        >
          
        </button>
        <h1 className="text-3xl font-bold text-white font-sans">
          Questions
        </h1>
        <button
          className="px-4 py-2 rounded-md bord bg-white hover:bg-[#4FB3B9] hover:text-white text-[#4FB3B9] font-medium transition-colors"
        >
          Logout
        </button>
      </div>


      <div className="w-full flex justify-end p-4 max-w-4xl">
        <Link to={"/createform"}>
          <button className="border px-3 py-1 rounded text-white bg-[#71c9ce] hover:bg-[#4b969a]">
            + Create
          </button>
        </Link>

      </div>

      <div className="w-full flex flex-col gap-4 p-4 md:px-8 lg:px-12 xl:px-20">
        {/* mcq */}
        <div className="w-full flex flex-col items-center">
          <h1 className="m-1 font-bold">MCQ</h1>
          <div className="w-full flex flex-col gap-4 max-w-4xl">
            {questions.map((q) => (
              q.questionsType == "mcq" ? <QuestionCard key={q._id} q={q} fetchData={fetchData} /> : null
            ))}
          </div>
        </div>

        {/* msq */}
        <div className="w-full flex flex-col items-center">
          <h1 className="m-1 font-bold">MSQ</h1>
          <div className="w-full flex flex-col gap-4 max-w-4xl">
            {questions.map((q) => (
              q.questionsType == "msq" ? <QuestionCard key={q._id} q={q} fetchData={fetchData} /> : null
            ))}
          </div>
        </div>

        {/* mcqImage */}
        <div className="w-full flex flex-col items-center">
          <h1 className="m-1 font-bold">MCQIMAGE</h1>
          <div className="w-full flex flex-col gap-4 max-w-4xl">
            {questions.map((q) => (
              q.questionsType == "mcqImage" ? <QuestionCard key={q._id} q={q} fetchData={fetchData} /> : null
            ))}
          </div>
        </div>

        {/* msqImage */}
        <div className="w-full flex flex-col items-center">
          <h1 className="m-1 font-bold">MSQIMAGE</h1>
          <div className="w-full flex flex-col gap-4 max-w-4xl">
            {questions.map((q) => (
              q.questionsType == "msqImage" ? <QuestionCard key={q._id} q={q} fetchData={fetchData} /> : null
            ))}
          </div>
        </div>

        {/* ntq */}
        <div className="w-full flex flex-col items-center">
          <h1 className="m-1 font-bold">NTQ</h1>
          <div className="w-full flex flex-col gap-4 max-w-4xl">
            {questions.map((q) => (
              q.questionsType == "ntq" ? <QuestionCard key={q._id} q={q} fetchData={fetchData} /> : null
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsList;