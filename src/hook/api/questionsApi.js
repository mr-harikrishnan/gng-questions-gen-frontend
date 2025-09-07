import axios from "axios";
import { config } from "../config";

// Base URL of your backend
const BASE_URL = config.api;

// Fetch all questions
export const getAllQuestions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/questions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

// Create a new question
export const createQuestion = async (questionData) => {
  try {
    const response = await axios.post(`${BASE_URL}/questions`, questionData);
    console.log("datainquestion", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

// Get a question by ID
export const getQuestionById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/questions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

export const updateQuestion = async (id, updatedData) => {
  try {
    const token = window.localStorage.getItem("myapp");

    const response = await axios.put(
      `${BASE_URL}/question/${id}`,
      updatedData,        // data goes second
      {
        headers: {
          authorization: token,  // raw token
        },
      }
    );

    console.log("Updated question:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};



// Delete a question by ID
export const deleteQuestionApi = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/question/${id}`);
    console.log("Deleted question:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};
