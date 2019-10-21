$(function () {
    // 作业答案
    if ($("#_block_exam_1").length > 0) {
        homeworkAnswer();
    }
    // 写入答案
    if ($("#tblDataList").length > 0) {

        /**
         * 监听周期值变化
         */
        chrome.storage.onChanged.addListener(function callback (changes, name) {
            if (name == 'local') {
                if (changes.writeAnswert) {
                    if ($("#_block_exam_1").text().indexOf("查看考卷") == -1) { // 不是查看考卷才写

                        chrome.storage.local.get('answers1', function (str) {
                            answers = JSON.parse(str.answers1);

                            if (answers) {
                                doHomework(answers);
                                alert("答题完成！");
                            }
                        });
                    }
                }

                if (changes.testAnswer) {
                    if ($("#_block_exam_1").text().indexOf("查看考卷") == -1) { // 不是查看考卷才写
                        let answer = 'C|A|B|A|C|D|D|C|A|A|B|B|B|B|A|B|A|A|D|D';

                        autoAnswer(answer);
                        alert("注入完成！");
                    }
                }
            }
        });
    }

});

function homeworkAnswer () {
    var listTable = $("#_block_content_exam_1>form>table>tbody")[0];
    var rows = listTable.rows;
    var results = [];
    var results1 = [];

    for (var i = 0; i < rows.length; i++) {
        var item = rows[i];

        // var tagName = item.children[1].children[1].children[0].children[1].children[0].children[0].tagName;
        // var text = "";
        // if("SPAN" == tagName){
        //     try{
        //         text = item.children[1].children[1].children[0].children[1].children[0].children[0].children[0].children[1].innerText;
        //     } catch(e) {}
        //     try{
        //         item.children[1].children[1].children[0].children[1].children[0].children[0].children[1].innerText;
        //     } catch(e) {}
        // }else{
        //     text = item.children[1].children[1].children[0].children[1].children[0].children[1].innerText;
        // }

        var text = $(item).find('div[style]').html();
        // "[参考答案：B]  分值：5"

        var index_a = text.indexOf("：") + 1;
        var index_b = text.indexOf("]");
        var result = text.substring(index_a, index_b);

        var questBox = item.children[1].children[1];
        var quest = questBox.children[0].children[0].children[0];

        console.log(i + 1 + ':' + quest.innerText.trim());

        var answerBox = questBox.children[0].children[1].children[0].children[0];
        var answers = $(answerBox).find('table>tbody').children();
        var answersObj = $(answers);
        var rightAnswer = [];

        if (answersObj.length === 1) {

            let obj = answersObj.children();

            function sliceArray (array, size) {
                var sliceArray = [];

                for (var x = 0; x < Math.ceil(array.length / size); x++) {
                    var start = x * size;
                    var end = start + size;
                    let silce = array.slice(start, end);

                    sliceArray.push(silce);
                }

                return sliceArray;
            }

            answersObj = sliceArray(obj, 3);

            for (let j = 0; j < answersObj.length; j++) {
                const element = answersObj[j];
                let answerLabel = element[1];

                answerLabel = answerLabel.innerText.substring(1, 2);

                if (result.indexOf(answerLabel) !== -1) {
                    rightAnswer.push({
                        label: answerLabel,
                        text: element[2].innerText.trim()
                    });
                }
            }
        }
        else {

            for (let j = 0; j < answersObj.length; j++) {
                const element = answers[j];
                let answerLabel = element.children[1];

                answerLabel = answerLabel.innerText.substring(1, 2);

                if (result.indexOf(answerLabel) !== -1) {
                    rightAnswer.push({
                        label: answerLabel,
                        text: element.children[2].innerText.trim()
                    });
                }
            }
        }

        console.log('答案：');
        for (let k = 0; k < rightAnswer.length; k++) {
            const element = rightAnswer[k];

            console.log(element.label + ':' + element.text);
        }

        console.log('----------------------------------------------');

        var questObj = {
            quest: quest.innerText.trim(),
            answer: rightAnswer
        };

        results.push(result);
        results1.push(questObj);
    }

    chrome.storage.local.set({'answers': results.join("|")}, function () {
        alert("答案读取成功！按 F12 点击 console 查看");
    });

    chrome.storage.local.set({'answers1': JSON.stringify(results1)});
}

/**
 * 自动做作业函数
 * @author marker
 * @param answerStr
 */
function doHomework (answerArray) {
    console.log(answerArray);
    var questionNode = $("#tblDataList>tbody")[0];
    var rows = questionNode.rows;

    for (var i = 0; i < rows.length; i++) {
        var item = rows[i];
        // var right = ans[i];//正确答案 A =65
        // if(!right){
        //     continue;// 不存在就继续走
        // }

        // if(right.length <= 1) {// 单项选择
        if (true) { // 单项选择

            // console.log(i+".单选题:"+right);

            // var rightIndex = right.charCodeAt() - 65;// 0开始
            // 答案里列表
            // var answerListNode = item.children[0].children[0].children[0].children[0].children[1].children[1].children[0].children[1].children[0].children[0].children[0].children[0]

            var answerNode = item.children[0].children[0].children[0].children[0].children[1].children[1].children[0].children[1].children[0].children[0];
            var questNode = item.children[0].children[0].children[0].children[0].children[1].children[1].children[0].children[0].innerText.trim();

            var answerNodeBox = $(answerNode).find('table');
            var answerListNode = answerNodeBox['0'].children[0];

            if (answerListNode.children.length > 1) {
                let answerList = answerListNode.children;

                for (let j = 0; j < answerArray.length; j++) {

                    const element = answerArray[j];

                    if (questNode === element.quest) {

                        for (let k = 0; k < element.answer.length; k++) {
                            const answer = element.answer[k];

                            console.log('right', answer.text);

                            for (let h = 0; h < answerList.length; h++) {
                                const element = answerList[h];

                                if (element.children[2].children[0].innerText.trim() === answer.text) {
                                    element.children[0].children[0].click();
                                }
                            }
                        }
                    }
                }
            }
            else {

                for (let j = 0; j < answerArray.length; j++) {
                    const element = answerArray[j];

                    if (questNode === element.quest) {
                        for (let k = 0; k < element.answer.length; k++) {
                            const answer = element.answer[k];

                            console.log('right', answer.text);
                            console.log();
                            if (answer.text === answerListNode.children[0].children[2].innerText.trim()) {
                                answerListNode.children[0].children[0].children[0].click();
                            }
                            else if (answer.text === answerListNode.children[0].children[5].innerText.trim()) {
                                answerListNode.children[0].children[3].children[0].click();
                            }
                            else if (answer.text === answerListNode.children[0].children[8].innerText.trim()) {
                                answerListNode.children[0].children[6].children[0].click();
                            }
                            else if (answer.text === answerListNode.children[0].children[11].innerText.trim()) {
                                answerListNode.children[0].children[9].children[0].click();
                            }
                        }
                    }
                }
            }

            // if(answerListNode.children.length == 1){
            //     // 选中答案
            //     try{// 尝试选择判断题/单选题
            //         if(rightIndex == 0){
            //             answerListNode.children[0].children[0].children[0].click();
            //         } else if(rightIndex == 1){
            //             answerListNode.children[0].children[3].children[0].click();
            //         } else if(rightIndex == 2){
            //             answerListNode.children[0].children[6].children[0].click();
            //         } else if(rightIndex == 3){
            //             answerListNode.children[0].children[9].children[0].click();
            //         }
            //     }catch(e){}
            // }else{//
            //     // 选中答案
            //     try{// 尝试选择判断题/单选题
            //         answerListNode.rows[rightIndex].children[0].children[0].click();
            //     }catch(e){}
            // }

        }
        else { // 多选题

            // console.log(i+".多选题:"+right);

            for (var j = 0; j < right.length; j++) {
                var crooet = right[j];
                var rightIndex = crooet.charCodeAt() - 65;
                // 答案里列表
                var answerListNode = item.children[0].children[0].children[0].children[0].children[1].children[1].children[0].children[1].children[0].children[0].children[0].children[0];

                // 选中答案
                try { // 尝试选择判断题
                    answerListNode.rows[rightIndex].children[0].children[0].click();
                }
                catch (e) {
                    console.log(e);
                }
            }

        }

    }

}

/**
 * 一键注入 测试正确答案
 * @author marker
 * @param answerStr
 */
function autoAnswer (answerStr) {
    var ans = answerStr.split("|");// 答案列表
    var questionNode = $("#tblDataList>tbody")[0];
    var rows = questionNode.rows;

    for (var i = 0; i < rows.length; i++) {
        var item = rows[i];
        var right = ans[i];// 正确答案 A =65

        if (!right) {
            continue;// 不存在就继续走
        }

        if (right.length <= 1) { // 单项选择
            // console.log(i+".单选题:"+right);

            var rightIndex = right.charCodeAt() - 65;// 0开始
            // 答案里列表

            var answerNode = item.children[0].children[0].children[0].children[0].children[1].children[1].children[0].children[1].children[0].children[0];

            var answerNodeBox = $(answerNode).find('table');
            var answerListNode = answerNodeBox['0'].children[0];

            if (answerListNode.children.length == 1) {
                // 选中答案
                try { // 尝试选择判断题/单选题
                    if (rightIndex == 0) {
                        answerListNode.children[0].children[0].children[0].click();
                    }
                    else if (rightIndex == 1) {
                        answerListNode.children[0].children[3].children[0].click();
                    }
                    else if (rightIndex == 2) {
                        answerListNode.children[0].children[6].children[0].click();
                    }
                    else if (rightIndex == 3) {
                        answerListNode.children[0].children[9].children[0].click();
                    }
                }
                catch (e) {}

            }
            else { //
                // 选中答案
                try { // 尝试选择判断题/单选题
                    answerListNode.rows[rightIndex].children[0].children[0].click();
                }
                catch (e) {}
            }

        }
        else { // 多选题

            // console.log(i+".多选题:"+right);

            for (var j = 0; j < right.length; j++) {
                var crooet = right[j];
                var rightIndex = crooet.charCodeAt() - 65;
                // 答案里列表
                var answerListNode = item.children[0].children[0].children[0].children[0].children[1].children[1].children[0].children[1].children[0].children[0].children[0].children[0];

                // 选中答案
                try { // 尝试选择判断题
                    answerListNode.rows[rightIndex].children[0].children[0].click();
                }
                catch (e) {
                    console.log(e)
                    ;
                }
            }

        }
    }
}
