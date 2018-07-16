const observableModule = require("data/observable");

function questionViewModel(question) {
    let viewModel = new observableModule.fromObject(question);

    viewModel.initQuestion = function () {
        if (question.answers) {
            viewModel.answers = question.answers.map((answer, key) => {
                return new observableModule.fromObject({
                    answerText: answer,
                    isSelected: false,
                    showCorrect: false,
                    isCorrect: key === question.correctAnswerIndex
                });
            });
        }
    }

    viewModel.checkMultipleChoiceAnswer = function (chosenAnswer) {
        chosenAnswer.isSelected = true;
        let answers = viewModel.get("answers");
        let correctAnswer = answers[question.correctAnswerIndex];
        correctAnswer.showCorrect = true;
        return chosenAnswer.isCorrect;
    };

    getLongitudeDistance = function (longitude1, longitude2) {
        let rawDistance = Math.abs(longitude1 - longitude2);
        return Math.min(rawDistance, 360 - rawDistance)
    }

    viewModel.checkMapLocationAnswer = function (chosenLatitude, chosenLongitude) {
        let locationAnswer = viewModel.get("locationAnswer");
        let distanceSquared = Math.pow((chosenLatitude - locationAnswer.latitude), 2) +
            Math.pow(getLongitudeDistance(chosenLongitude, locationAnswer.longitude), 2);
        let distance = Math.sqrt(distanceSquared);
        let answerIsCorrect = distance < viewModel.get("errorMarginRadius");
        return answerIsCorrect;
    };


    return viewModel;

}
module.exports = questionViewModel;
