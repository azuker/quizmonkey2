const socialShare = require("nativescript-social-share");
const NavigationModule = require("../../shared/navigation");

var vm;

exports.summaryViewLoaded = function (args) {
    var page = args.object;
    vm = page.bindingContext;
}

exports.backToQuizListTapped = function (args) {
    NavigationModule.goToQuizList();
}

exports.shareTapped = function (args) {
    var userScore = vm.get("presentableScore");
    var quizName = vm.get("name");
    socialShare.shareText("Hi, I just scored " + userScore + " on the " + quizName + " quiz in QuizMonkey - the best quiz app ever!");
}


exports.quizNameLoaded = function (args) {
    if (args.object.android) {
        args.object.android.setGravity(17);
    }
}
