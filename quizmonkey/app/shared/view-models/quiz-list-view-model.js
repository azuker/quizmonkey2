const ObservableArray = require("data/observable-array").ObservableArray;
const mockQuizzesData = require("../mockData/mockQuizzesData.json");
const utilities = require("../utilities");
const config = require("../config");

function QuizListViewModel() {
    let viewModel = new ObservableArray();

    getAverageScore = function (quiz) {
        let averageScore = (quiz.gameCounter && quiz.gameCounter > 0) ?
            quiz.aggregatedScore / quiz.gameCounter : undefined;
        averageScore = utilities.convertFractionToPercentageString(averageScore);
        return averageScore;
    }

    addQuizzesToViewModel = function (quizzes) {
        viewModel.splice(0);
        quizzes.forEach((quiz) => {
            let averageScore = getAverageScore(quiz);
            viewModel.push({
                id: quiz._id,
                name: quiz.name,
                image: quiz.image,
                averageScore: averageScore,
                averageScoreExists: typeof averageScore !== 'undefined'
            });
        });
    }

    handleErrors = function (response) {
        if (!response.ok) {
            console.log(JSON.stringify(response));
            throw Error(response.statusText);
        }
        return response;
    }


    loadBackEndDataQuizzes = function () {
        return fetch(config.apiUrl + 'quizzes')
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                addQuizzesToViewModel(data);
            });
    };

    loadMockDataQuizzes = function () {
        addQuizzesToViewModel(mockQuizzesData);
    }

    viewModel.loadQuizzes = function () {
        if (config.useMockData) {
            return new Promise(resolve =>
                setTimeout(resolve, 1000)
            ).then(loadMockDataQuizzes);
        }
        else {
            return loadBackEndDataQuizzes();
        }
    }

    return viewModel;
}
module.exports = QuizListViewModel;
