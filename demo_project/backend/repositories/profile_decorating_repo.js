const calculateUserProfileData = (username, contests) => {
    let totalSubmittedProblems = 0; //attempted
    let totalSolvedProblems = 0;
    let submissionActivity = {};

    contests.forEach(contest => {
        const user = contest?.leaderboard?.find(user => user?.username === username);
        console.log('user', user);
        if (user) {
            
            const uniqueProblems = new Set();
            user?.submittedProblems.forEach(problem => {
                if (!uniqueProblems.has(problem?.pid)) {
                    uniqueProblems.add(problem?.pid);
                    totalSubmittedProblems++;

                    if (problem.result?.verdict === 'Accepted' || (Array.isArray(problem?.result) && problem?.result[0]?.verdict === 'OK')) {
                        totalSolvedProblems++;
                    }
                }
                // uniqueProblems.add(problem?.pid);
                // if (problem.result?.verdict === 'Accepted' || (Array.isArray(problem?.result) && problem?.result[0]?.verdict === 'OK')) {
                //     totalSolvedProblems++;
                // }
            });
            // totalSubmittedProblems += uniqueProblems.size;
            // console.log(totalSolvedProblems);

            user?.submittedProblems.forEach(problem => {
                const date = new Date(contest?.startTime).toISOString().split('T')[0];
                if (!submissionActivity[date]) {
                    submissionActivity[date] = { submissions: 0, solved: 0 };
                }
                submissionActivity[date].submissions++;
                if (problem?.result?.verdict === 'Accepted' || (Array.isArray(problem?.result) && problem?.result[0]?.verdict === 'OK')) {
                    submissionActivity[date].solved++;
                }
            });
        }
    });

    return { totalSubmittedProblems, totalSolvedProblems, submissionActivity };
};

module.exports = { calculateUserProfileData };
