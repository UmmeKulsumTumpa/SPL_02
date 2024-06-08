// ../utils/createContest.js
import axios from 'axios';

export const createEmptyProblem = (type = 'custom') => ({
    type, // 'custom' or 'oj'
    oj: '',
    pid: '',
    title: '',
    statement: '',
    constraints: '',
    testCase: '',
    alias: '',
    weight: ''
});

export const addProblem = (problems, type) => [
    ...problems,
    createEmptyProblem(type)
];

export const updateProblem = (problems, index, field, value) => {
    const updatedProblems = [...problems];
    updatedProblems[index][field] = value;
    return updatedProblems;
};

export const deleteProblem = (problems, index) => {
    const updatedProblems = [...problems];
    updatedProblems.splice(index, 1);
    return updatedProblems;
};

export const moveProblem = (problems, fromIndex, toIndex) => {
    const updatedProblems = [...problems];
    const [movedProblem] = updatedProblems.splice(fromIndex, 1);
    updatedProblems.splice(toIndex, 0, movedProblem);
    return updatedProblems;
};

export const fetchProblemTitle = async (oj, pid) => {
    if (!pid) return 'No such problem exists!';

    try {
        const response = await axios.get(`http://localhost:8000/api/problem/retrieve/${oj}/${pid}`);
        return response.data.title || 'No such problem exists!';
    } catch (error) {
        return 'There might occurred some error';
    }
};

export const validateField = (value, fieldName) => {
    if (!value) {
        return `${fieldName} is required`;
    }
    return '';
};
