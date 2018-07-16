const observableModule = require("data/observable");
const QuizListViewModel = require('../../shared/view-models/quiz-list-view-model');
const QuizViewModel = require('../../shared/view-models/quiz-view-model');
const NavigationModule = require("../../shared/navigation");
const dialogs = require("ui/dialogs");

let vm = new QuizListViewModel();

let quizListData = new observableModule.fromObject({
    quizList: vm
})

exports.onQuizListPageLoaded = function (args) {
    quizListData.set("isLoading", true);
    page = args.object;
    page.bindingContext = quizListData;
    vm.loadQuizzes().then(function () {
        quizListData.set("isLoading", false)
    });
};

exports.onSelectQuiz = function (args) {
    let selectedQuizData = args.view.bindingContext;
    let quiz = new QuizViewModel(selectedQuizData);
    quizListData.set("isLoading", true);
    quiz.loadQuestions().then(function () {
        quizListData.set("isLoading", false);
        let quizLength = quiz.questions.length;
        if (quizLength > 0) {
            NavigationModule.goToQuestionView(quiz, 0);
        }
        else {
            dialogs.alert("No questions were found for this quiz. Please try another one.").
                then(function () {
                    console.log("error loading questions. notification dialog closed.");
                });
        }
    });
}
