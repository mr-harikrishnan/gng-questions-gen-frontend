import axios from "axios";
import { config } from "../config";


const BASE_URL = `${config.api}/subjectandtopics`;


export const createcreateSubject = async (subjectData) => {
  try {
    const response = await axios.post(BASE_URL, subjectData);
    console.log("Subject created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating subject:", error);
    throw error;
  }
};


export const getAllSubjectsAndTopics = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching all subjects:", error);
    throw error;
  }
};


export const getSubjectsAndTopicsById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subject with ID ${id}:`, error);
    throw error;
  }
};


export const updateSubjectsAndTopics = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedData);
    console.log(`Subject with ID ${id} updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating subject with ID ${id}:`, error);
    throw error;
  }
};


export const deleteSubjectsAndTopics = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    console.log(`Subject with ID ${id} deleted successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting subject with ID ${id}:`, error);
    throw error;
  }
};
