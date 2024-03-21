const reader = new FileReader();
const mountainFile = document.getElementsByClassName('mountain_file')[0];
const mountainGameBlock = document.getElementsByClassName('mountain_game')[0];

const clickedElementList = [];
const clickedLine = []
const arrayOfLineElemenets = [];
const arrayOfPosiblePaths = [];
let userSum = 0;

function readFile(mountainFile) {
    const file = mountainFile.files[0];
    reader.readAsText(file);

    reader.onload = () => {
        const content = reader.result;
        const numbers = content.trim().split(/\s+/).map(Number);

        const arrayOfArrays = [];
        let lineCounter = 1;
        let result = document.createElement('p');

        while (numbers.length > 0) {
            let arrayOfNumbers = [];
            const arrayOfLineData = []
            const newLine = document.createElement('div');
            newLine.classList.add('mountain_line')

            for (let i = 0; i < lineCounter && numbers.length > 0; i++) {
                arrayOfNumbers.push(numbers.shift());
                const newNumber = document.createElement('p');
                newNumber.innerHTML = arrayOfNumbers[arrayOfNumbers.length - 1];
                newLine.append(newNumber);
                arrayOfLineData.push(newNumber)
            }

            arrayOfArrays.push(arrayOfNumbers);
            arrayOfLineElemenets.push(arrayOfLineData);
            mountainGameBlock.append(newLine);
            lineCounter++;

            arrayOfLineData.forEach((element, index) => {
                element.addEventListener('click', (e) => {
                    const clickedElement = e.target;
                    clickedElementList.push(clickedElement);
                    let indexOfPossibleWay;
                    const indexOfCurrentLine = arrayOfLineElemenets.findIndex(line => line.includes(clickedElement));
                    clickedLine.push(indexOfCurrentLine);
                    let prevLine = clickedLine[clickedLine.length - 2];
                    if (indexOfCurrentLine == 0) {
                        indexOfPossibleWay = arrayOfLineElemenets[indexOfCurrentLine].indexOf(clickedElementList[clickedElementList.length - 2])
                    }
                    else {
                        indexOfPossibleWay = arrayOfLineElemenets[prevLine].indexOf(clickedElementList[clickedElementList.length - 2])
                    }

                    if ((clickedLine.length > 1) && clickedLine[clickedLine.length - 1] !== prevLine + 1) {
                        clickedLine.pop();
                        clickedElementList.pop();
                        console.log(clickedLine[clickedLine.length - 1], ' ', prevLine + 1)
                        clickedElement.style.backgroundColor = 'red'
                    }
                    else {
                        findPath(arrayOfLineElemenets, clickedElement, indexOfCurrentLine, indexOfPossibleWay, indexOfCurrentLine + 1);

                        result.innerText = `Yout path: ${userSum}. Max sum you will learn when go to the end.`

                        mountainGameBlock.appendChild(result);
                    }
                })

            })

            if (numbers.length <= arrayOfNumbers.length) {
                break;
            }
        }

        const maxSum = findRichestPath(arrayOfArrays);
        console.log(arrayOfLineElemenets[arrayOfLineElemenets.length - 1])

        arrayOfLineElemenets[arrayOfLineElemenets.length - 1].forEach(element => {
            element.addEventListener('click', (e) => {
                if (userSum != maxSum) {
                    result.innerText = `Wrong path, your sum = ${userSum}, while maxsum = ${maxSum}`
                }
                else {
                    result.innerText = `Victory! Max sum = ${maxSum}`
                }
            })
        })
    }
}

function findPath(mountainOfElements, clickedElement, indexOfCurrentLine, indexOfPossibleWay, indexOfNextLine) {
    const indexOfSecondPosibleWay = indexOfPossibleWay + 1;

    if (clickedElement == mountainOfElements[indexOfCurrentLine][indexOfPossibleWay]) {
        clickedElement.style.backgroundColor = 'green'
        userSum += +clickedElement.innerText;
    }
    else if (clickedElement == mountainOfElements[indexOfCurrentLine][indexOfSecondPosibleWay]) {
        clickedElement.style.backgroundColor = 'green'
        userSum += +clickedElement.innerText;
    }
    else {
        clickedElement.style.backgroundColor = 'red'
    }
}

function findRichestPath(mountain) {
    for (let row = mountain.length - 2; row >= 0; row--) {
        for (let col = 0; col < mountain[row].length; col++) {
            mountain[row][col] += Math.max(mountain[row + 1][col], mountain[row + 1][col + 1]);
        }
    }
    return mountain[0][0];
}



mountainFile.addEventListener('change', () => {
    readFile(mountainFile);
})




