/*global MutationObserver, html2canvas, saveAs, window, Node*/
(function () {
    'use strict';
    Node.prototype.findParent = function (query) {
        var parent = this;
        while (parent && !parent.matches(query)) {
            parent = parent.parentElement;
        }
        return parent;
    };
    var mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            Array.prototype.slice.call(mutation.addedNodes).forEach(function (addedNode) {
                if (addedNode.querySelectorAll) {
                    var answers = addedNode.querySelectorAll('.feed_item_inner:not(.download-quora-answers-processed), .AnswerBase:not(.download-quora-answers-processed)');
                    if (answers) {
                        addedNode.getElementsByClassName('feed_item_inner');
                        Array.prototype.slice.call(answers).forEach(function (answer) {
                            var actionBar = answer.querySelector('div.action_bar_inner');
                            if (actionBar) {
                                var downloadButton = document.createElement('a');
                                downloadButton.className = 'secondary_action';
                                downloadButton.href = '#';
                                downloadButton.innerText = 'Download';
                                downloadButton.onclick = function (event) {
                                    answer.classList.add('download-quora-answers-processing');
                                    var moreButton = answer.querySelector('.AnswerExpandable:not(.hidden) a.more_link');
                                    var scroll = {x: window.scrollX, y: window.scrollY};
                                    var question;
                                    function proceed() {
                                        html2canvas(answer, {
                                            onrendered: function (canvas) {
                                                window.scrollTo(scroll.x, scroll.y);
                                                answer.classList.remove('download-quora-answers-processing');
                                                if (question) {
                                                    question.remove();
                                                    answer = answer.parentElement;
                                                }
                                                canvas.toBlob(function (blob) {
                                                    saveAs(blob, answer.id + '.jpg');
                                                }, 'image/jpeg', 1);
                                            },
                                            useCORS: true
                                        });
                                    }
                                    if (answer.matches('.AnswerBase')) {
                                        question = document.querySelector('.grid_page .header').cloneNode();
                                        question.appendChild(document.querySelector('.grid_page .header .question_text_edit').cloneNode(true));
                                        answer.insertBefore(question, answer.firstChild);
                                        proceed();
                                    } else if (moreButton) {
                                        var expandableObserver;
                                        expandableObserver = new MutationObserver(function () {
                                            expandableObserver.disconnect();
                                            proceed();
                                        });
                                        expandableObserver.observe(moreButton.findParent('.AnswerExpandable'), {attributes: true});
                                        moreButton.click();
                                    } else {
                                        proceed();
                                    }
                                    event.preventDefault();
                                };
                                actionBar.appendChild(downloadButton);
                            }
                            answer.classList.add('download-quora-answers-processed');
                        });
                    }
                }
            });
        });
    });
    mutationObserver.observe(document, {childList: true, subtree: true});
}());