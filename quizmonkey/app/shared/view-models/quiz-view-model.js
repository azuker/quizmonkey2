const observableModule = require("data/observable");
const mockQuestionsData = require("../mockData/mockQuestionsData.json");
const config = require("../config");
const utilities = require("../../shared/utilities");

function quizViewModel(quiz) {
    let viewModel = new observableModule.fromObject(quiz);
    viewModel.currentScore = 0;

    loadBackEndDataQuestions = function () {
        return fetch(config.apiUrl + 'quizzes/' + quiz.id + '/questions')
            .then(handleErrors)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                viewModel.questions = data;
            })
    };

    loadMockDataQuestions = function () {
        var quizRelatedQuestions = mockQuestionsData.filter(q => q.quiz_id === quiz.id)
        viewModel.questions = quizRelatedQuestions;
    }

    viewModel.loadQuestions = function () {
        if (config.useMockData) {
            return new Promise(resolve =>
                setTimeout(resolve, 1000)
            ).then(loadMockDataQuestions);
        }
        else {
            return loadBackEndDataQuestions();
        }
    }

    postScore = function (finalScore) {
        return fetch(config.apiUrl + 'quizzes/' + quiz.id, {
            method: "PATCH",
            body: JSON.stringify({
                score: finalScore,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleErrors);
    }

    viewModel.finalizeScore = function () {
        let correctAnswers = viewModel.currentScore;
        let quizLength = viewModel.questions.length;
        let finalScore = correctAnswers / quizLength;
        viewModel.set("finalScore", finalScore);
        let presentableScore = utilities.convertFractionToPercentageString(finalScore);
        viewModel.set("presentableScore", presentableScore);
        if (!config.useMockData) {
            postScore(finalScore);
        }
        console.log('finalScore: ', finalScore);
    };

    viewModel.incrementScore = function () {
        const newScore = viewModel.currentScore + 1;
        viewModel.currentScore = newScore;
    }

    return viewModel;
}

module.exports = quizViewModel;
